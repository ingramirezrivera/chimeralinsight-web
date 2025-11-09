// src/components/Footer.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = { label: string; href: string };

const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Books", href: "/#books" },
  { label: "Press Kit", href: "/presskit" },
  { label: "Contact", href: "/contact" },
  { label: "Mailing List", href: "/#mailing-list" },
];

const legalNav: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

// Easing + scroll programático
const smoothScrollTo = (to: number, duration = 450) => {
  const start = window.scrollY || window.pageYOffset;
  const diff = to - start;
  let startTime: number | null = null;
  const ease = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const step = (ts: number) => {
    if (startTime === null) startTime = ts;
    const p = Math.min((ts - startTime) / duration, 1);
    window.scrollTo(0, start + diff * ease(p));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

export default function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const [hash, setHash] = useState<string>("");

  // Detecta cambios en el hash (#about, #books, etc.)
  useEffect(() => {
    const update = () => setHash(window.location.hash || "");
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  // Determina si un enlace está activo (excepto Home que no se resalta)
  const isActive = (href: string) => {
    // Rutas "reales" (no anclas)
    if (!href.startsWith("/#") && !href.startsWith("#")) {
      if (href === "/") {
        // Home: nunca usar estilo "activo"
        return false;
      }
      const base = href.split("#")[0];
      return pathname === base || pathname.startsWith(base + "/");
    }
    // Anclas del home
    const target = "#" + href.split("#")[1];
    return pathname === "/" && hash === target;
  };

  // Intercepta clics para scroll suave desde el Footer cuando ya estás en "/"
  const handleFooterClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const onHome = pathname === "/";

    // Home → top suave si ya estás en "/"
    if (href === "/" && onHome) {
      e.preventDefault();
      smoothScrollTo(0, 420);
      history.replaceState(null, "", "/");
      return;
    }

    // Ancla del home → scroll suave si ya estás en "/"
    const isAnchor = href.startsWith("#") || href.startsWith("/#");
    if (isAnchor && onHome) {
      e.preventDefault();
      const id = href.replace("/#", "#");
      const el = document.querySelector<HTMLElement>(id);
      if (!el) return;

      const HEADER_OFFSET = 62; // ajusta a la altura de tu navbar
      const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

      smoothScrollTo(y, 420);
      history.replaceState(null, "", id);
      return;
    }
    // Si no estás en home, Next navega normal
  };

  return (
    <footer
      className="w-full text-gray-300 border-t border-white/10 font-sans font-medium text-center"
      style={{ backgroundColor: "var(--fg, #111827)" }}
      aria-labelledby="site-footer"
    >
      <h2 id="site-footer" className="sr-only">
        Footer
      </h2>

      {/* Top area */}
      <div className="md:mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group no-underline"
              onClick={(e) => handleFooterClick(e, "/")}
            >
              <span className="text-lg font-semibold tracking-wide">
                Chimeral Insight
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Appearances may be deceptive.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white/90">Navigate</h3>
            <ul className="mt-4 space-y-2">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleFooterClick(e, item.href)}
                    className={[
                      "inline-block text-sm no-underline hover:no-underline focus:no-underline transition duration-200 ease-in-out hover:scale-110",
                      // Home siempre blanco; los demás usan activo/normal
                      item.href === "/"
                        ? "text-white hover:text-[var(--brand-600)]"
                        : isActive(item.href)
                        ? "text-[var(--accent)] hover:opacity-90"
                        : "text-gray-300 hover:text-[var(--brand-600)]",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white/90">Legal</h3>
            <ul className="mt-4 space-y-2">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors no-underline hover:no-underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <div className="pt-2">
              <span className="text-sm font-semibold text-white/90">
                Follow us
              </span>
              <div className="mt-3 flex items-center justify-center gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61573030175351"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5a3.5 3.5 0 0 1 3.8-3.9c1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.3 0-1.7.8-1.7 1.6V12H18l-.5 3h-2.9v7A10 10 0 0 0 22 12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-gray-400 text-center w-full">
            © {year} Chimeral Insight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
