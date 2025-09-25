// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, type MouseEvent } from "react";

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
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? ""; // basePath público (Pages)

  // No marcamos anclas como "active" para que el hover funcione en home
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Intercepta clics a anclas y hace scroll suave si estás en "/"
  const handleAnchorClick = (
    e: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const isAnchor = href.startsWith("#") || href.startsWith("/#");
    const isHome = pathname === "/";
    if (!isAnchor || !isHome) return; // deja que Next navegue si no estás en "/"

    e.preventDefault();
    const id = href.replace("/#", "#");
    const el = document.querySelector<HTMLElement>(id);
    if (!el) return;

    const HEADER_OFFSET = 96; // px
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    smoothScrollTo(y, 420);

    setOpen(false);
    history.replaceState(null, "", id); // actualiza hash sin salto
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--brand)] shadow-lg font-sans">
      <nav className="container mx-auto h-16 flex items-center justify-center px-10">
        {/* Logo */}
        <Link href="/" aria-current={isActive("/") ? "page" : undefined}>
          <Image
            className="hover:scale-110 transition-transform duration-200 ease-in-out"
            src={`${bp}/logo.png`} // respeta /chimeralinsight-web en GitHub Pages
            alt="Chimeralinsight logo"
            width={280}
            height={40}
            priority
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
                  "hover:text-[var(--brand-600)] hover:scale-110", // hover SIEMPRE
                  isActive(link.href) ? "text-[var(--accent)]" : "",
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
                    "hover:text-[var(--brand-600)]",
                    isActive(link.href) ? "text-[var(--accent)]" : "",
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
