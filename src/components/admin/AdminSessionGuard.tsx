"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ACTIVE_TABS_KEY = "ci_admin_active_tabs";
const SESSION_MARKER_KEY = "ci_admin_session_marker";
const TAB_ID_KEY = "ci_admin_tab_id";
const HEARTBEAT_MS = 4000;
const STALE_MS = 12000;

function now() {
  return Date.now();
}

function readActiveTabs() {
  try {
    const raw = window.localStorage.getItem(ACTIVE_TABS_KEY);
    if (!raw) return {} as Record<string, number>;

    const parsed = JSON.parse(raw) as Record<string, number>;
    if (!parsed || typeof parsed !== "object") return {};

    return parsed;
  } catch {
    return {} as Record<string, number>;
  }
}

function writeActiveTabs(value: Record<string, number>) {
  window.localStorage.setItem(ACTIVE_TABS_KEY, JSON.stringify(value));
}

function pruneActiveTabs(activeTabs: Record<string, number>) {
  const cutoff = now() - STALE_MS;

  return Object.fromEntries(
    Object.entries(activeTabs).filter(([, timestamp]) => timestamp >= cutoff)
  );
}

async function closeServerSession() {
  try {
    await fetch("/api/admin/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
  } catch {
    // We still redirect even if the request fails.
  }
}

export default function AdminSessionGuard() {
  const router = useRouter();

  useEffect(() => {
    const existingTabId = window.sessionStorage.getItem(TAB_ID_KEY);
    const tabId = existingTabId || crypto.randomUUID();

    if (!existingTabId) {
      window.sessionStorage.setItem(TAB_ID_KEY, tabId);
    }

    const initialActiveTabs = pruneActiveTabs(readActiveTabs());
    const hasMarker = window.sessionStorage.getItem(SESSION_MARKER_KEY) === "1";
    const hasOtherActiveTabs = Object.keys(initialActiveTabs).some((key) => key !== tabId);

    if (!hasMarker && !hasOtherActiveTabs) {
      void closeServerSession().finally(() => {
        window.sessionStorage.removeItem(SESSION_MARKER_KEY);
        window.sessionStorage.removeItem(TAB_ID_KEY);
        router.replace("/admin/login");
        router.refresh();
      });
      return;
    }

    window.sessionStorage.setItem(SESSION_MARKER_KEY, "1");

    const updateHeartbeat = () => {
      const activeTabs = pruneActiveTabs(readActiveTabs());
      activeTabs[tabId] = now();
      writeActiveTabs(activeTabs);
    };

    const removeTab = () => {
      const activeTabs = pruneActiveTabs(readActiveTabs());
      delete activeTabs[tabId];
      writeActiveTabs(activeTabs);
    };

    updateHeartbeat();

    const interval = window.setInterval(updateHeartbeat, HEARTBEAT_MS);
    window.addEventListener("pagehide", removeTab);
    window.addEventListener("beforeunload", removeTab);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("pagehide", removeTab);
      window.removeEventListener("beforeunload", removeTab);
      removeTab();
    };
  }, [router]);

  return null;
}
