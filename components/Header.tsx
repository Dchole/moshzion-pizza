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
import {
  NAV_LINKS,
  SCROLL_THRESHOLDS,
  MOBILE_MENU_CONFIG,
  APP_NAV_LINKS,
  APP_MOBILE_NAV_LINKS,
  LANDING_GROUP_PATHS
} from "@/lib/constants";

const ICON_MAP = {
  Person: PersonIcon,
  Storefront: StorefrontIcon,
  Info: InfoIcon,
  Receipt: ReceiptIcon,
  LocalShipping: LocalShippingIcon
} as const;

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
  const shouldShowWhiteBg = isAppVariant || !isLandingPage || isScrolled;
  const shouldShowShadow = !isAppVariant && shouldShowWhiteBg;

  const textColor = shouldUseDarkText ? "text-brown-dark" : "text-white";
  const hoverColor = shouldUseDarkText
    ? "hover:text-brown-medium"
    : "hover:text-gray-200";

  const navLinks = isAppVariant ? APP_NAV_LINKS : NAV_LINKS;
  const mobileNavLinks = isAppVariant
    ? APP_MOBILE_NAV_LINKS.map(link => ({
        ...link,
        icon: ICON_MAP[link.icon as keyof typeof ICON_MAP]
      }))
    : NAV_LINKS.map(link => ({ ...link, icon: undefined }));

  const headerClasses = [
    isAppVariant || isLandingGroupPage ? "fixed" : "absolute",
    "top-0 left-0 right-0",
    isAppVariant ? "z-40" : "z-30",
    shouldShowWhiteBg ? "bg-white" : "bg-transparent",
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

  const getMobileNavLinkClasses = (isActive: boolean, index: number) => {
    const base =
      "block px-6 py-4 text-gray-900 hover:bg-gray-50 font-open-sans transition-colors duration-300 relative";
    const border =
      index < mobileNavLinks.length - 1 ? "border-b border-gray-100" : "";
    const weight = isActive ? "font-bold" : "font-medium";
    const active = isActive
      ? "bg-brown-dark/5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-brown-dark"
      : "";

    return `${base} ${weight} ${active} ${border}`;
  };

  const getAppMobileNavLinkClasses = (isActive: boolean) => {
    const base = `${textColor} ${hoverColor} py-3 px-4 rounded-lg font-open-sans transition-colors duration-300 hover:bg-brown-medium/10 flex items-center gap-3`;
    const weight = isActive ? "font-bold" : "font-medium";
    const active = isActive
      ? "bg-brown-medium/20 border-l-4 border-brown-dark"
      : "";

    return `${base} ${weight} ${active}`;
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
                  className="flex items-center gap-8"
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
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={getAppMobileNavLinkClasses(isActive)}
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
                    onClick={() => setIsMobileMenuOpen(false)}
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
                      {mobileNavLinks.map((link, index) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={getMobileNavLinkClasses(
                            pathname === link.href,
                            index
                          )}
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

      {(isAppVariant || isLandingGroupPage) && !isProductPage && (
        <div
          className="md:hidden transition-all duration-300"
          style={{ height: `${menuHeight}px` }}
        />
      )}
    </>
  );
}
