"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
  const pathname = usePathname();

  const isProductPage = pathname?.startsWith("/product/");

  // Auto-detect if we should use app variant for about/contacts pages
  const shouldUseAppVariant =
    variant === "app" || pathname === "/about" || pathname === "/contacts";
  const effectiveVariant = shouldUseAppVariant ? "app" : "landing";

  const handleOpenMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const textColor =
    effectiveVariant === "app" ? "text-brown-dark" : "text-white";
  const hoverColor =
    effectiveVariant === "app"
      ? "hover:text-brown-medium"
      : "hover:text-gray-200";

  const navLinks =
    effectiveVariant === "app"
      ? [{ label: "Store", href: "/store" }, ...NAV_LINKS.slice(1)]
      : NAV_LINKS;

  const headerPosition = effectiveVariant === "app" ? "fixed" : "absolute";
  const headerBg = effectiveVariant === "app" ? "bg-primary" : "bg-transparent";
  const headerZIndex = effectiveVariant === "app" ? "z-40" : "z-30";

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
                  <Logo className="h-16 w-16" variant={effectiveVariant} />
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
                        index === 0 && effectiveVariant === "landing"
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
              {isProductPage ? (
                <Link
                  href="/store"
                  className={`flex items-center gap-1 ${textColor} hover:opacity-80 transition-opacity`}
                  aria-label="Back to store"
                >
                  <ArrowBackIcon sx={{ fontSize: 20 }} />
                  <span className="text-sm font-medium font-open-sans">
                    Back
                  </span>
                </Link>
              ) : (
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  aria-label="Moshzion Home"
                >
                  <Logo className="h-8 w-8" variant={effectiveVariant} />
                </Link>
              )}

              <CartButtonGroup showAccount onAccountClick={handleOpenMenu} />
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={handleCloseMenu} />
    </>
  );
}
