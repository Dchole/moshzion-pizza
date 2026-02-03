"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { useCart } from "@/lib/cart-context";
import { NAV_LINKS } from "@/lib/constants";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import PersonIcon from "@mui/icons-material/Person";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  const handleOpenMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-40 bg-transparent">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div className="mx-auto max-w-384 px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo and Navigation Links */}
              <div className="flex items-center gap-8">
                {/* Logo */}
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  aria-label="Moshzion Home"
                >
                  <Logo className="h-16 w-16" />
                </Link>

                {/* Navigation Links */}
                <nav
                  className="flex items-center gap-8"
                  aria-label="Main navigation"
                >
                  {NAV_LINKS.map((link, index) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-base font-medium transition-colors hover:text-gray-200 ${
                        index === 0 ? "text-(--hero-accent)" : "text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 rounded-full bg-white border-2 border-primary p-1">
                {/* Shopping Cart */}
                <Link
                  href="/cart"
                  className="relative flex items-center justify-center rounded-full p-2 hover:bg-gray-100 transition-colors"
                  aria-label={`Shopping cart with ${totalItems} items`}
                >
                  <LocalMallIcon
                    sx={{ fontSize: 20, color: "var(--text-dark)" }}
                  />
                  {totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brown-medium text-xs font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* User Account */}
                <Link
                  href="/account"
                  className="flex items-center justify-center rounded-full bg-primary p-2 hover:bg-(--primary-beige-hover) transition-colors"
                  aria-label="User account"
                >
                  <PersonIcon
                    sx={{ fontSize: 20, color: "var(--text-dark)" }}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="mx-auto max-w-384 px-4">
            <div className="flex h-14 items-center justify-between">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2"
                aria-label="Moshzion Home"
              >
                <Logo className="h-8 w-8" />
              </Link>

              {/* Mobile Action Buttons */}
              <div className="flex items-center gap-1 rounded-full bg-white border-2 border-primary p-1">
                {/* Shopping Cart */}
                <Link
                  href="/cart"
                  className="relative flex items-center justify-center rounded-full p-2 hover:bg-gray-100 transition-colors"
                  aria-label={`Shopping cart with ${totalItems} items`}
                >
                  <LocalMallIcon
                    sx={{ fontSize: 20, color: "var(--text-dark)" }}
                  />
                  {totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brown-medium text-xs font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* User Menu Button */}
                <button
                  className="flex items-center justify-center rounded-full bg-primary p-2 hover:bg-(--primary-beige-hover) transition-colors"
                  aria-label="Open menu"
                  onClick={handleOpenMenu}
                >
                  <PersonIcon
                    sx={{ fontSize: 20, color: "var(--text-dark)" }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={handleCloseMenu} />
    </>
  );
}
