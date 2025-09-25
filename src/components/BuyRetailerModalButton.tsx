"use client";

import { useState } from "react";
import RetailerModal, { Retailer } from "./RetailerModal";

export default function BuyRetailerModalButton({
  title,
  retailers,
  href, // fallback si no hay retailers
  className,
  ariaLabel,
  children = "Buy on Amazon",
}: {
  title: string;
  retailers?: Retailer[];
  href?: string;
  className?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const hasRetailers = Array.isArray(retailers) && retailers.length > 0;

  if (!hasRetailers && href) {
    // Sin retailers -> deja el enlace normal
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => setOpen(true)}
        className={className}
      >
        {children}
      </button>

      <RetailerModal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        retailers={retailers || []}
      />
    </>
  );
}
