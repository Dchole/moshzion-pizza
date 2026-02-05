"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "./Logo";
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

  const shouldUseAppVariant =
    variant === "app" ||
    pathname === "/about" ||
    pathname === "/contacts" ||
    pathname === "/faqs" ||
    pathname === "/credits";
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

  const menuHeight =
    isMobileMenuOpen && variant === "app" ? navLinks.length * 56 + 32 : 0;

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
              <div className="flex items-center gap-3">
                {!isProductPage && (
                  <button
                    onClick={
                      isMobileMenuOpen ? handleCloseMenu : handleOpenMenu
                    }
                    className={`${textColor} hover:opacity-80 transition-opacity`}
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  >
                    {isMobileMenuOpen ? (
                      <CloseIcon sx={{ fontSize: 24 }} />
                    ) : (
                      <MenuIcon sx={{ fontSize: 24 }} />
                    )}
                  </button>
                )}
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
              </div>

              <CartButtonGroup showAccount />
            </div>
          </div>

          {!isProductPage && (
            <>
              {variant === "app" ? (
                <nav
                  className={`bg-primary border-t border-brown-medium/10 transition-all duration-300 ease-out overflow-hidden ${
                    isMobileMenuOpen
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                  aria-label="Mobile navigation"
                  aria-hidden={!isMobileMenuOpen}
                >
                  <div className="mx-auto max-w-384 px-4 py-4">
                    <div className="flex flex-col gap-2">
                      {navLinks.map(link => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={handleCloseMenu}
                          className={`${textColor} ${hoverColor} py-3 px-4 rounded-lg font-medium font-open-sans transition-colors hover:bg-brown-medium/10`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>
              ) : (
                // Popover menu for landing variant
                <>
                  <div
                    className={`fixed inset-0 z-40 backdrop-blur-sm transition-all duration-200 ${
                      isMobileMenuOpen
                        ? "bg-black/30 opacity-100 pointer-events-auto"
                        : "bg-black/0 opacity-0 pointer-events-none"
                    }`}
                    onClick={handleCloseMenu}
                    aria-hidden="true"
                  />
                  <nav
                    className={`fixed top-16 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white rounded-2xl shadow-2xl z-50 overflow-hidden transition-all duration-300 ease-out ${
                      isMobileMenuOpen
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                    aria-label="Mobile navigation"
                    aria-hidden={!isMobileMenuOpen}
                  >
                    <div className="py-3">
                      {navLinks.map((link, index) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={handleCloseMenu}
                          className={`block px-6 py-4 text-gray-900 hover:bg-gray-50 font-medium font-open-sans transition-colors ${
                            index < navLinks.length - 1
                              ? "border-b border-gray-100"
                              : ""
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </nav>
                </>
              )}
            </>
          )}
        </div>
      </header>

      {/* Spacer for app variant to push content down */}
      {variant === "app" && !isProductPage && (
        <div
          className="md:hidden transition-all duration-300"
          style={{ height: isMobileMenuOpen ? `${menuHeight}px` : "0px" }}
        />
      )}
    </>
  );
}
