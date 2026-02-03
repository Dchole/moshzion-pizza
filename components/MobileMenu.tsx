"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InfoIcon from "@mui/icons-material/Info";
import PhoneIcon from "@mui/icons-material/Phone";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import WorkIcon from "@mui/icons-material/Work";
import LogoutIcon from "@mui/icons-material/Logout";
import { NAV_LINKS } from "@/lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-[var(--primary-beige)] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-[var(--brown-dark)] hover:bg-[var(--primary-beige-hover)] transition-colors"
          aria-label="Close menu"
        >
          <CloseIcon sx={{ fontSize: 24 }} />
        </button>

        {/* Menu Content */}
        <nav
          className="flex h-full flex-col px-6 py-16"
          aria-label="Mobile menu"
        >
          {/* User Section */}
          <div className="space-y-4 border-b border-[var(--brown-dark)]/20 pb-6">
            <Link
              href="/account"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-lg py-3 text-[var(--text-dark)] hover:bg-[var(--primary-beige-hover)] transition-colors"
            >
              <PersonIcon sx={{ fontSize: 20 }} />
              <span className="font-medium">Account</span>
            </Link>

            <Link
              href="/orders"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-lg py-3 text-[var(--text-dark)] hover:bg-[var(--primary-beige-hover)] transition-colors"
            >
              <ReceiptLongIcon sx={{ fontSize: 20 }} />
              <span className="font-medium">Orders</span>
            </Link>

            <Link
              href="/store"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-lg py-3 text-[var(--text-dark)] hover:bg-[var(--primary-beige-hover)] transition-colors"
            >
              <ShoppingCartIcon sx={{ fontSize: 20 }} />
              <span className="font-medium">Store</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4 border-b border-[var(--brown-dark)]/20 py-6">
            <Link
              href="/about"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-lg py-3 text-[var(--text-dark)] hover:bg-[var(--primary-beige-hover)] transition-colors"
            >
              <InfoIcon sx={{ fontSize: 20 }} />
              <span className="font-medium">About Us</span>
            </Link>

            <Link
              href="/contacts"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-lg py-3 text-[var(--text-dark)] hover:bg-[var(--primary-beige-hover)] transition-colors"
            >
              <PhoneIcon sx={{ fontSize: 20 }} />
              <span className="font-medium">Contact Us</span>
            </Link>

            <Link
              href="/faqs"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-lg py-3 text-[var(--text-dark)] hover:bg-[var(--primary-beige-hover)] transition-colors"
            >
              <QuestionAnswerIcon sx={{ fontSize: 20 }} />
              <span className="font-medium">FAQs</span>
            </Link>
          </div>

          {/* Jobs Link */}
          <div className="py-6">
            <Link
              href="/jobs"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-lg py-3 text-[var(--text-dark)] hover:bg-[var(--primary-beige-hover)] transition-colors"
            >
              <WorkIcon sx={{ fontSize: 20 }} />
              <span className="font-medium">Jobs</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="mt-auto border-t border-[var(--brown-dark)]/20 pt-6">
            <button
              onClick={onClose}
              className="flex w-full items-center gap-3 rounded-lg py-3 text-[var(--text-dark)] hover:bg-[var(--primary-beige-hover)] transition-colors"
            >
              <LogoutIcon sx={{ fontSize: 20 }} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
