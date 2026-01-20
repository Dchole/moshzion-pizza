"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { useCart } from "@/lib/cart-context";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-40 bg-transparent">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo and Navigation Links */}
              <div className="flex items-center gap-8">
                {/* Logo */}
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  aria-label="Moshzion Home"
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
                    className="text-sm font-medium text-[#2D1B0E] hover:text-[#5D3A1A] transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className="text-sm font-medium text-[#2D1B0E] hover:text-[#5D3A1A] transition-colors"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contacts"
                    className="text-sm font-medium text-[#2D1B0E] hover:text-[#5D3A1A] transition-colors"
                  >
                    Contacts
                  </Link>
                  <Link
                    href="/faqs"
                    className="text-sm font-medium text-[#2D1B0E] hover:text-[#5D3A1A] transition-colors"
                  >
                    FAQs
                  </Link>
                </nav>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {/* Shopping Cart */}
                <Link
                  href="/cart"
                  className="relative rounded-full bg-white p-2 shadow-md hover:shadow-lg transition-shadow"
                  aria-label={`Shopping cart with ${totalItems} items`}
                >
                  <LocalMallOutlinedIcon
                    className="text-[#2D1B0E]"
                    sx={{ fontSize: 20 }}
                  />
                  {totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#8B5A2B] text-xs font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* User Account */}
                <Link
                  href="/account"
                  className="rounded-full bg-[#8B5A2B] p-2 shadow-md hover:shadow-lg transition-shadow"
                  aria-label="User account"
                >
                  <PersonOutlineOutlinedIcon
                    className="text-white"
                    sx={{ fontSize: 20 }}
                  />
                </Link>
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
                aria-label="Moshzion Home"
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
                  <LocalMallOutlinedIcon
                    className="text-[#2D1B0E]"
                    sx={{ fontSize: 20 }}
                  />
                  {totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#8B5A2B] text-xs font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* User Menu Button */}
                <button
                  className="rounded-full bg-[#8B5A2B] p-2 shadow-md"
                  aria-label="Open menu"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <PersonOutlineOutlinedIcon
                    className="text-white"
                    sx={{ fontSize: 20 }}
                  />
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
