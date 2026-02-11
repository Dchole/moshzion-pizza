"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "./Logo";
import { CartButtonGroup } from "@/components/CartButtonGroup";
import AppMobileNav from "@/components/AppMobileNav";
import LandingMobileNav from "@/components/LandingMobileNav";
import {
  NAV_LINKS,
  SCROLL_THRESHOLDS,
  MOBILE_MENU_CONFIG,
  APP_NAV_LINKS,
  APP_MOBILE_NAV_LINKS,
  LANDING_GROUP_PATHS
} from "@/lib/constants";

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
    variant === "landing" || LANDING_GROUP_PATHS.includes(pathname || "");
  const isAppVariant = variant === "app";

  // Track scroll position for landing page
  useEffect(() => {
    if (!isLandingPage) return;

    const handleScroll = () =>
      setIsScrolled(window.scrollY > SCROLL_THRESHOLDS.headerScroll);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLandingPage]);

  // Determine styling based on variant and state
  const shouldUseDarkText = isAppVariant || !isLandingPage || isScrolled;
  const shouldShowWhiteBg = !isAppVariant && (!isLandingPage || isScrolled);
  const shouldShowShadow = !isAppVariant && shouldShowWhiteBg;

  const textColor = shouldUseDarkText ? "text-brown-dark" : "text-white";
  const hoverColor = shouldUseDarkText
    ? "hover:text-brown-medium"
    : "hover:text-gray-200";

  const navLinks = isAppVariant ? APP_NAV_LINKS : NAV_LINKS;
  const mobileNavLinks = isAppVariant ? APP_MOBILE_NAV_LINKS : NAV_LINKS;

  const headerClasses = [
    isAppVariant || isLandingGroupPage ? "fixed" : "absolute",
    "top-0 left-0 right-0",
    isAppVariant ? "z-0" : "z-30",
    isAppVariant
      ? "bg-primary"
      : shouldShowWhiteBg
        ? "bg-white"
        : "bg-transparent",
    shouldShowShadow ? "shadow-sm" : "shadow-none",
    "transition-all duration-300"
  ].join(" ");

  const menuHeight =
    isMobileMenuOpen && isAppVariant
      ? mobileNavLinks.length * MOBILE_MENU_CONFIG.itemHeight +
        MOBILE_MENU_CONFIG.padding
      : 0;

  const getNavLinkClasses = (isActive: boolean) => {
    const base =
      "text-base font-medium font-open-sans transition-all duration-300 px-4 py-2 rounded-full";
    const colors = `${textColor} ${hoverColor}`;

    if (isActive) {
      const activeBg = shouldUseDarkText ? "bg-brown-dark/10" : "bg-white/25";
      return `${base} ${colors} ${activeBg} scale-105`;
    }

    const hoverBg = shouldUseDarkText
      ? "hover:bg-brown-dark/5"
      : "hover:bg-white/15";
    return `${base} ${colors} ${hoverBg}`;
  };

  return (
    <>
      <header className={headerClasses}>
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
                  className="flex items-center gap-4"
                  aria-label="Main navigation"
                >
                  {navLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={getNavLinkClasses(pathname === link.href)}
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
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
              {isAppVariant ? (
                <AppMobileNav
                  isOpen={isMobileMenuOpen}
                  currentPath={pathname || ""}
                  links={mobileNavLinks}
                  textColor={textColor}
                  hoverColor={hoverColor}
                  onClose={() => setIsMobileMenuOpen(false)}
                />
              ) : (
                <LandingMobileNav
                  isOpen={isMobileMenuOpen}
                  currentPath={pathname || ""}
                  links={mobileNavLinks}
                  onClose={() => setIsMobileMenuOpen(false)}
                />
              )}
            </>
          )}
        </div>
      </header>

      {(isAppVariant || isLandingGroupPage) && !isProductPage && (
        <div
          className="md:hidden transition-all duration-300"
          style={{ height: `${menuHeight}px` }}
        />
      )}
    </>
  );
}
