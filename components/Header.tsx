"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InfoIcon from "@mui/icons-material/Info";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Logo from "./Logo";
import { CartButtonGroup } from "@/components/CartButtonGroup";
import { NAV_LINKS } from "@/lib/constants";

export default function Header({
  variant = "landing"
}: {
  variant?: "landing" | "app";
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isProductPage = pathname?.startsWith("/product/");
  const isLandingPage = pathname === "/";
  const isLandingGroupPage =
    variant === "landing" ||
    pathname === "/about" ||
    pathname === "/contacts" ||
    pathname === "/faqs" ||
    pathname === "/credits";

  // Track scroll position for landing page
  useEffect(() => {
    if (!isLandingPage) {
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLandingPage]);

  const shouldUseAppVariant = variant === "app";
  const effectiveVariant = shouldUseAppVariant ? "app" : "landing";

  const handleOpenMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Determine text colors based on page type and scroll state
  const shouldUseDarkText =
    effectiveVariant === "app" || !isLandingPage || isScrolled;
  const textColor = shouldUseDarkText ? "text-brown-dark" : "text-white";
  const hoverColor = shouldUseDarkText
    ? "hover:text-brown-medium"
    : "hover:text-gray-200";

  const navLinks =
    effectiveVariant === "app"
      ? [
          { label: "Store", href: "/store" },
          { label: "About", href: "/about" },
          { label: "Orders", href: "/orders" },
          { label: "Track Order", href: "/track-order" }
        ]
      : NAV_LINKS;

  const mobileNavLinks =
    effectiveVariant === "app"
      ? [
          { label: "Account", href: "/account", icon: PersonIcon },
          { label: "Store", href: "/store", icon: StorefrontIcon },
          { label: "About", href: "/about", icon: InfoIcon },
          { label: "Orders", href: "/orders", icon: ReceiptIcon },
          {
            label: "Track Order",
            href: "/track-order",
            icon: LocalShippingIcon
          }
        ]
      : navLinks.map(link => ({ ...link, icon: undefined }));

  // Determine header styling based on variant, page type, and scroll state
  const headerPosition =
    effectiveVariant === "app" || isLandingGroupPage ? "fixed" : "absolute";
  const shouldShowWhiteBg =
    effectiveVariant === "app" || !isLandingPage || isScrolled;
  const headerBg = shouldShowWhiteBg ? "bg-white" : "bg-transparent";
  const headerShadow =
    effectiveVariant === "landing" && shouldShowWhiteBg
      ? "shadow-sm"
      : "shadow-none";
  const headerZIndex = effectiveVariant === "app" ? "z-40" : "z-30";

  const menuHeight =
    isMobileMenuOpen && variant === "app" ? mobileNavLinks.length * 56 + 32 : 0;

  return (
    <>
      <header
        className={`${headerPosition} top-0 left-0 right-0 ${headerZIndex} ${headerBg} ${headerShadow} transition-all duration-300`}
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
                  <Logo
                    className="h-16 w-16"
                    variant={shouldUseDarkText ? "app" : "landing"}
                  />
                </Link>

                <nav
                  className="flex items-center gap-8"
                  aria-label="Main navigation"
                >
                  {navLinks.map(link => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`text-base font-medium font-open-sans transition-all duration-300 px-4 py-2 rounded-full ${
                          isActive
                            ? shouldUseDarkText
                              ? "bg-brown-dark/10 scale-105"
                              : "bg-white/25 scale-105"
                            : shouldUseDarkText
                              ? "hover:bg-brown-dark/5"
                              : "hover:bg-white/15"
                        } ${textColor} ${hoverColor}`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
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
                    className={`${textColor} hover:opacity-80 transition-all duration-300`}
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
                    className={`flex items-center gap-1 ${textColor} hover:opacity-80 transition-all duration-300`}
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
                    <Logo
                      className="h-8 w-8"
                      variant={shouldUseDarkText ? "app" : "landing"}
                    />
                  </Link>
                )}
              </div>

              <CartButtonGroup showAccount />
            </div>
          </div>

          {!isProductPage && (
            <>
              {effectiveVariant === "app" ? (
                <nav
                  className={`bg-white border-t border-brown-medium/10 transition-all duration-300 ease-out overflow-hidden ${
                    isMobileMenuOpen
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                  aria-label="Mobile navigation"
                  aria-hidden={!isMobileMenuOpen}
                >
                  <div className="mx-auto max-w-384 px-4 py-4">
                    <div className="flex flex-col gap-2">
                      {mobileNavLinks.map(link => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={handleCloseMenu}
                            className={`${textColor} ${hoverColor} py-3 px-4 rounded-lg font-open-sans transition-colors duration-300 hover:bg-brown-medium/10 flex items-center gap-3 ${
                              isActive
                                ? "font-bold bg-brown-medium/20 border-l-4 border-brown-dark"
                                : "font-medium"
                            }`}
                          >
                            {Icon && <Icon className="w-5 h-5" />}
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </nav>
              ) : (
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
                      {mobileNavLinks.map((link, index) => {
                        const isActive = pathname === link.href;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={handleCloseMenu}
                            className={`block px-6 py-4 text-gray-900 hover:bg-gray-50 font-open-sans transition-colors duration-300 relative ${
                              isActive
                                ? "font-bold bg-brown-dark/5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-brown-dark"
                                : "font-medium"
                            } ${
                              index < mobileNavLinks.length - 1
                                ? "border-b border-gray-100"
                                : ""
                            }`}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  </nav>
                </>
              )}
            </>
          )}
        </div>
      </header>

      {/* Spacer for fixed header to push content down */}
      {(effectiveVariant === "app" || isLandingGroupPage) && !isProductPage && (
        <div
          className="md:hidden transition-all duration-300"
          style={{ height: isMobileMenuOpen ? `${menuHeight}px` : "0px" }}
        />
      )}
    </>
  );
}
