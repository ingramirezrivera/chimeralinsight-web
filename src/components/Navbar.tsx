// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#books", label: "Books" },
  { href: "/#mailing-list", label: "Mailing List" },
  { href: "/presskit", label: "Presskit" },
];

const SECTION_IDS = ["top", "about", "books", "mailing-list"] as const;
type SectionId = (typeof SECTION_IDS)[number];

// Scroll suave
const smoothScrollTo = (to: number, duration = 450) => {
  const start = window.scrollY || window.pageYOffset;
  const diff = to - start;
  let t0: number | null = null;
  const ease = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const step = (ts: number) => {
    if (t0 === null) t0 = ts;
    const p = Math.min((ts - t0) / duration, 1);
    window.scrollTo(0, start + diff * ease(p));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

// Lee la altura del navbar (desde la CSS var o midiendo el <header>)
const getNavHeight = () => {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue("--nav-h")
    .trim();
  const parsed = parseInt(v, 10);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  const header = document.querySelector<HTMLElement>("header[data-nav='true']");
  return header?.offsetHeight ?? 62; // fallback coherente con tu Footer
};

export default function Navbar() {
  const router = useRouter();
  const rawPathname = usePathname();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const pathname =
    basePath && rawPathname.startsWith(basePath)
      ? rawPathname.slice(basePath.length) || "/"
      : rawPathname;

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("top");

  // Referencia para medir el header y publicar --nav-h
  const headerRef = useRef<HTMLElement>(null);

  // Mide y publica la altura real del header
  useEffect(() => {
    const setVars = () => {
      const h = headerRef.current?.offsetHeight ?? 62;
      document.documentElement.style.setProperty("--nav-h", `${h}px`);
    };
    setVars();
    window.addEventListener("resize", setVars);
    window.addEventListener("load", setVars);
    const t = setTimeout(setVars, 50); // por si el logo/fuente tarda
    return () => {
      window.removeEventListener("resize", setVars);
      window.removeEventListener("load", setVars);
      clearTimeout(t);
    };
  }, []);

  // Re-medir cuando abres/cerras menú móvil
  useEffect(() => {
    const h = headerRef.current?.offsetHeight ?? 62;
    document.documentElement.style.setProperty("--nav-h", `${h}px`);
  }, [open]);

  // Efecto de fondo al hacer scroll (solo desktop)
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onScroll = () => setScrolled(window.scrollY > 8);
    const attach = () => {
      if (mql.matches) {
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        setScrolled(false);
        window.removeEventListener("scroll", onScroll);
      }
    };
    attach();
    mql.addEventListener("change", attach);
    return () => {
      window.removeEventListener("scroll", onScroll);
      mql.removeEventListener("change", attach);
    };
  }, []);

  // Scroll-spy usando altura real
  useEffect(() => {
    const any = SECTION_IDS.some((id) => document.getElementById(id));
    if (!any) return;
    const computeActive = () => {
      const pos = window.scrollY + getNavHeight() + 1;
      let current: SectionId = "top";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= pos) current = id;
      }
      setActiveSection(current);
    };
    computeActive();
    window.addEventListener("scroll", computeActive, { passive: true });
    window.addEventListener("resize", computeActive);
    return () => {
      window.removeEventListener("scroll", computeActive);
      window.removeEventListener("resize", computeActive);
    };
  }, [pathname]);

  // Activo por ruta real
  const isRouteActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    if (href === "/") return pathname === "/" ? activeSection === "top" : false;
    const base = href.split("#")[0];
    return pathname === base || pathname.startsWith(base + "/");
  };

  // Activo por sección (home)
  const isSectionActive = (href: string) => {
    if (href === "/") return activeSection === "top";
    if (href.startsWith("/#"))
      return activeSection === (href.slice(2) as SectionId);
    return false;
  };

  const linkClasses = (href: string) => {
    const active = isRouteActive(href) || isSectionActive(href);
    const base =
      "inline-block px-3 py-2 font-medium no-underline focus:no-underline transition duration-200 ease-in-out hover:scale-110";
    const baseColor = scrolled ? "text-white/90" : "text-white";
    const hoverColor = scrolled
      ? "hover:text-white"
      : "hover:text-[var(--brand-600,#0891b2)]";
    const activeColor = "text-[var(--accent,#fbbf24)] hover:opacity-90";
    return [base, active ? activeColor : `${baseColor} ${hoverColor}`].join(
      " "
    );
  };

  // Click en enlaces (manejo de anclas con offset dinámico)
  const handleAnchorClick = (
    e: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const onHome = pathname === "/";
    setOpen(false);

    // Click en Home estando en Home → scroll top suave
    if (href === "/" && onHome) {
      e.preventDefault();
      smoothScrollTo(0, 420);
      history.replaceState(null, "", "/");
      return;
    }

    const isAnchor = href.startsWith("#") || href.startsWith("/#");
    if (isAnchor) {
      e.preventDefault();
      const hash = href.replace("/#", "#");

      if (onHome) {
        // Ya en Home: medir después de cerrar menú y desplazar
        requestAnimationFrame(() => {
          const el = document.querySelector<HTMLElement>(hash);
          if (!el) return;
          const y =
            el.getBoundingClientRect().top + window.scrollY - getNavHeight();
          smoothScrollTo(y, 420);
          history.replaceState(null, "", hash);
        });
      } else {
        // Viniendo de otra ruta: navegar y ajustar al pintar
        router.push("/" + hash);
        setTimeout(() => {
          const el = document.querySelector<HTMLElement>(hash);
          if (!el) return;
          const y =
            el.getBoundingClientRect().top + window.scrollY - getNavHeight();
          window.scrollTo(0, y);
        }, 0);
      }
      return;
    }

    // Rutas reales (páginas) → dejar que Next navegue normal
  };

  return (
    <>
      <header
        ref={headerRef}
        data-nav="true"
        className={[
          "sticky top-0 left-0 right-0 z-50 font-sans",
          "bg-[var(--brand,#0f766e)]",
          "md:transition md:duration-300",
          scrolled
            ? "md:bg-[var(--brand,#0f766e)]/80 md:backdrop-blur md:shadow-md"
            : "md:bg-[var(--brand,#0f766e)] md:shadow-lg",
        ].join(" ")}
      >
        <nav className="container mx-auto h-20 md:h-14 flex items-center justify-between md:justify-center px-4 md:px-10">
          {/* LOGO */}
          <Link
            href="/"
            onClick={(e) => handleAnchorClick(e, "/")}
            aria-current={
              isRouteActive("/") || isSectionActive("/") ? "page" : undefined
            }
            className="shrink-0"
          >
            <Image
              src={`${basePath}/images/logo.png`}
              alt="Chimeralinsight logo"
              width={340}
              height={60}
              className="h-auto w-64 md:w-64 transition-transform duration-200 ease-in-out hover:scale-110"
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
                  aria-current={
                    isRouteActive(link.href) || isSectionActive(link.href)
                      ? "page"
                      : undefined
                  }
                  className={linkClasses(link.href)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Botón móvil */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-[var(--brand-600,#0891b2)]"
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

        {/* Menú móvil */}
        {open && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-[var(--brand-600,#0891b2)] bg-[var(--brand,#0f766e)]"
          >
            <ul className="divide-y divide-[var(--brand-600,#0891b2)]">
              {links.map((link) => (
                <li key={link.href} className="text-center">
                  <Link
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    aria-current={
                      isRouteActive(link.href) || isSectionActive(link.href)
                        ? "page"
                        : undefined
                    }
                    className={[
                      "block w-full px-6 py-4 text-base font-medium no-underline hover:no-underline focus:no-underline transition duration-200 ease-in-out",
                      linkClasses(link.href),
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
    </>
  );
}
