"use client";

import Link from "next/link";

interface LandingMobileNavProps {
  isOpen: boolean;
  currentPath: string;
  links: Array<{ label: string; href: string }>;
  onClose: () => void;
}

export default function LandingMobileNav({
  isOpen,
  currentPath,
  links,
  onClose
}: LandingMobileNavProps) {
  const getNavLinkClasses = (isActive: boolean, index: number) => {
    const base =
      "block px-6 py-4 text-gray-900 hover:bg-beige-light/30 font-open-sans transition-colors duration-300 relative";
    const border = index < links.length - 1 ? "border-b border-gray-100" : "";
    const weight = isActive ? "font-bold" : "font-medium";
    const active = isActive
      ? "bg-brown-dark/5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-brown-dark"
      : "";

    return `${base} ${weight} ${active} ${border}`;
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 backdrop-blur-sm transition-all duration-200 ${
          isOpen
            ? "bg-black/30 opacity-100 pointer-events-auto"
            : "bg-black/0 opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        className={`fixed top-16 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white rounded-2xl shadow-2xl z-50 overflow-hidden transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        <div className="py-3">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={getNavLinkClasses(currentPath === link.href, index)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
