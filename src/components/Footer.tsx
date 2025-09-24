"use client";

import Link from "next/link";
import Image from "next/image";

type NavItem = { label: string; href: string };

const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Books", href: "/books" },
  { label: "Contact", href: "/contact" },
];

const legalNav: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full text-gray-300 border-t border-white/10"
      style={{ backgroundColor: "var(--fg, #111827)" }}
      aria-labelledby="site-footer"
    >
      <h2 id="site-footer" className="sr-only">
        Footer
      </h2>

      {/* Top area */}
      <div className=" ml-10 md:mx-auto max-w-7xl px-6 py-12 ">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              {/* Logo real */}

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
                    className="text-sm text-gray-300 hover:text-white transition-colors"
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
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            {/* Socials (solo Facebook por ahora) */}
            <div className="pt-2">
              <span className="text-sm font-semibold text-white/90">
                Follow
              </span>
              <div className="mt-3 flex items-center gap-3">
                <Link
                  href="https://www.facebook.com/TU_USUARIO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  {/* Ícono Facebook (SVG inline, sin dependencias) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5a3.5 3.5 0 0 1 3.8-3.9c1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.3 0-1.7.8-1.7 1.6V12H18l-.5 3h-2.9v7A10 10 0 0 0 22 12z" />
                  </svg>
                </Link>
                {/* Cuando tengas más redes, añade más <Link> aquí */}
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
