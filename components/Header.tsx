"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#E5D4C1] shadow-sm">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2"
                aria-label="Mostrizza Home"
              >
                <Logo className="h-10 w-10" />
              </Link>

              {/* Navigation Links */}
              <nav
                className="flex items-center gap-8"
                aria-label="Main navigation"
              >
                <Link
                  href="/"
                  className="text-sm font-medium text-[#5D3A1A] hover:text-[#8B5A2B] transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-medium text-[#5D3A1A] hover:text-[#8B5A2B] transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/contacts"
                  className="text-sm font-medium text-[#5D3A1A] hover:text-[#8B5A2B] transition-colors"
                >
                  Contacts
                </Link>
                <Link
                  href="/faqs"
                  className="text-sm font-medium text-[#5D3A1A] hover:text-[#8B5A2B] transition-colors"
                >
                  FAQs
                </Link>
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {/* Shopping Cart */}
                <Link
                  href="/cart"
                  className="relative rounded-full bg-white p-2.5 shadow-md hover:shadow-lg transition-shadow"
                  aria-label={`Shopping cart with ${totalItems} items`}
                >
                  <svg
                    className="h-5 w-5 text-[#5D3A1A]"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#8B5A2B] text-xs font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* User Account */}
                <button
                  className="rounded-full bg-white p-2.5 shadow-md hover:shadow-lg transition-shadow"
                  aria-label="User account"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <svg
                    className="h-5 w-5 text-[#5D3A1A]"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex h-14 items-center justify-between">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2"
                aria-label="Mostrizza Home"
              >
                <Logo className="h-8 w-8" />
              </Link>

              {/* Mobile Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Shopping Cart */}
                <Link
                  href="/cart"
                  className="relative rounded-full bg-white p-2 shadow-md"
                  aria-label={`Shopping cart with ${totalItems} items`}
                >
                  <svg
                    className="h-5 w-5 text-[#5D3A1A]"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#8B5A2B] text-xs font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* User Menu Button */}
                <button
                  className="rounded-full bg-white p-2 shadow-md"
                  aria-label="Open menu"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <svg
                    className="h-5 w-5 text-[#5D3A1A]"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
