// Navbar.tsx (fragmento)
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#books", label: "Books" },
  { href: "/#mailing-list", label: "Mailing List" },
  { href: "/presskit", label: "Presskit" },
];

// Easing y scroll con duración controlada
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

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  // ⚡️ Intercepta los clics a anclas y hace scroll rápido
  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const isAnchor = href.startsWith("#") || href.startsWith("/#");
    const isHome = pathname === "/";
    if (!isAnchor || !isHome) return; // deja que Next navegue si no estás en "/"

    e.preventDefault();
    const id = href.replace("/#", "#");
    const el = document.querySelector<HTMLElement>(id);
    if (!el) return;

    // Altura del header (ajusta si cambia el alto)
    const HEADER_OFFSET = 96; // px (h-16 = 64px + margen/extra; ajusta a tu caso)
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    smoothScrollTo(y, 420); // 420ms: más ágil que el nativo

    setOpen(false);
    // Opcional: actualiza el hash sin saltos
    history.replaceState(null, "", id);
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--brand)] shadow-lg font-sans">
      <nav className="container mx-auto h-16 flex items-center justify-center px-10">
        {/* Logo */}
        <Link href="/" aria-current={isActive("/") ? "page" : undefined}>
          <Image
            className="hover:scale-110 transition-transform duration-200 ease-in-out"
            src="/logo.png"
            alt="Chimeralinsight logo"
            width={280}
            height={40}
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 pl-10">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={[
                  "inline-block px-3 py-2 text-lg font-medium text-white",
                  "no-underline hover:no-underline focus:no-underline",
                  "transition-transform duration-200 ease-in-out",
                  isActive(link.href)
                    ? "text-[var(--accent)]"
                    : "hover:text-[var(--brand-600)] hover:scale-110",
                ].join(" ")}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-[var(--brand-600)]"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {/* ...tus íconos... */}
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-[var(--brand-600)] bg-[var(--brand)]"
        >
          <ul className="divide-y divide-[var(--brand-600)]">
            {links.map((link) => (
              <li key={link.href} className="text-center">
                <Link
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={[
                    "block w-full px-6 py-4 text-white text-base font-medium",
                    "no-underline hover:no-underline focus:no-underline",
                    isActive(link.href)
                      ? "text-[var(--accent)]"
                      : "hover:text-[var(--brand-600)]",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
