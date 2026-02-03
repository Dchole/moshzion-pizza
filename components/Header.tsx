"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { CartButtonGroup } from "@/components/CartButtonGroup";
import { NAV_LINKS } from "@/lib/constants";

export default function Header({
  variant = "landing"
}: {
  variant?: "landing" | "app";
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const textColor = variant === "app" ? "text-[#5D3A1A]" : "text-white";
  const hoverColor =
    variant === "app" ? "hover:text-[#8B5A2B]" : "hover:text-gray-200";

  const navLinks =
    variant === "app"
      ? [{ label: "Store", href: "/store" }, ...NAV_LINKS.slice(1)]
      : NAV_LINKS;

  const headerPosition = variant === "app" ? "fixed" : "absolute";
  const headerBg = variant === "app" ? "bg-primary" : "bg-transparent";
  const headerZIndex = variant === "app" ? "z-40" : "z-30";

  return (
    <>
      <header
        className={`${headerPosition} top-0 left-0 right-0 ${headerZIndex} ${headerBg}`}
      >
        <div className="hidden md:block">
          <div className="mx-auto max-w-384 px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-8">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  aria-label="Moshzion Home"
                >
                  <Logo className="h-16 w-16" />
                </Link>

                <nav
                  className="flex items-center gap-8"
                  aria-label="Main navigation"
                >
                  {navLinks.map((link, index) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-base font-medium font-open-sans transition-colors ${hoverColor} ${
                        index === 0 && variant === "landing"
                          ? "text-(--hero-accent)"
                          : textColor
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <CartButtonGroup />
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <div className="mx-auto max-w-384 px-4">
            <div className="flex h-14 items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2"
                aria-label="Moshzion Home"
              >
                <Logo className="h-8 w-8" />
              </Link>

              <CartButtonGroup showAccount onAccountClick={handleOpenMenu} />
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={handleCloseMenu} />
    </>
  );
}
