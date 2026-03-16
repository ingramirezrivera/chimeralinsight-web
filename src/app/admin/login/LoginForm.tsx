"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: "outline" | "filled_black" | "filled_blue";
              size?: "large" | "medium" | "small";
              shape?: "pill" | "rectangular" | "circle" | "square";
              text?:
                | "signin_with"
                | "signup_with"
                | "continue_with"
                | "signin";
              width?: number;
              logo_alignment?: "left" | "center";
            }
          ) => void;
        };
      };
    };
  }
}

function getMessageFromStatus(status: number) {
  if (status === 403) {
    return "This Google account does not have permission to access the editorial desk.";
  }

  if (status === 429) {
    return "Too many login attempts. Please wait a moment and try again.";
  }

  return "Unable to sign in with Google right now. Please try again.";
}

export default function LoginForm({
  redirectTo,
  googleClientId,
  authReady,
}: {
  redirectTo: string;
  googleClientId: string;
  authReady: boolean;
}) {
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!scriptReady || !authReady || !googleClientId || !buttonRef.current || !window.google) {
      return;
    }

    buttonRef.current.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async ({ credential }) => {
        if (!credential) {
          setError("Google did not return a valid credential.");
          return;
        }

        setPending(true);
        setError("");

        try {
          const response = await fetch("/api/admin/auth/google", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              credential,
              redirectTo,
            }),
          });

          const payload = (await response.json().catch(() => null)) as
            | { ok?: boolean; redirectTo?: string; error?: string }
            | null;

          if (!response.ok) {
            setError(payload?.error || getMessageFromStatus(response.status));
            setPending(false);
            return;
          }

          window.sessionStorage.setItem("ci_admin_session_marker", "1");
          if (!window.sessionStorage.getItem("ci_admin_tab_id")) {
            window.sessionStorage.setItem("ci_admin_tab_id", crypto.randomUUID());
          }

          router.push(payload?.redirectTo || "/admin/dashboard");
          router.refresh();
        } catch {
          setError("Unable to sign in with Google right now. Please try again.");
          setPending(false);
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "signin_with",
      width: 420,
      logo_alignment: "left",
    });
  }, [authReady, googleClientId, redirectTo, router, scriptReady]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />

      <div className="space-y-5">
        <div className="rounded-2xl border border-[rgba(47,129,133,0.14)] bg-[rgba(47,129,133,0.06)] px-4 py-4 text-sm leading-6 text-slate-700">
          Access is limited to the approved editorial Google accounts. The session closes when the browser is closed.
        </div>

        {authReady ? (
          <div className="flex justify-center overflow-visible py-3">
            <div className="origin-center scale-[1.18] sm:scale-[1.24]">
              <div ref={buttonRef} />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Google admin access is not configured on the server yet.
          </div>
        )}

        {pending ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Completing Google sign-in...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </div>
    </>
  );
}
