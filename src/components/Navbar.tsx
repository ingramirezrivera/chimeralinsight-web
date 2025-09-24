"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#books", label: "Books" },
  { href: "/#mailing-list", label: "Mailing List" },
  { href: "/presskit", label: "Presskit" }, // ruta aparte
];

function useHash() {
  const [hash, setHash] = useState<string>("");
  useEffect(() => {
    const update = () => setHash(window.location.hash || "");
    update();
    window.addEventListener("hashchange", update, { passive: true });
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return hash;
}

export default function Navbar() {
  const pathname = usePathname();
  const hash = useHash();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    // anclas de la home
    if (href.startsWith("/#")) {
      return pathname === "/" && hash === href.replace("/", ""); // compara "#about", "#books", etc.
    }
    // rutas normales
    return pathname === href || pathname.startsWith(href + "/");
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
            priority={false}
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 pl-10">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={[
                  "inline-block",
                  "px-3 py-2 text-lg font-medium text-white",
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
          {!open ? (
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
          ) : (
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          )}
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
                  onClick={() => setOpen(false)}
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
