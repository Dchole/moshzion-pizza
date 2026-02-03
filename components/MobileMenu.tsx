"use client";

import { useEffect } from "react";
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
import { MOBILE_MENU_SECTIONS } from "@/lib/constants";

// Icon mapping for dynamic rendering
const ICON_MAP = {
  Person: PersonIcon,
  ReceiptLong: ReceiptLongIcon,
  ShoppingCart: ShoppingCartIcon,
  Info: InfoIcon,
  Phone: PhoneIcon,
  QuestionAnswer: QuestionAnswerIcon,
  Work: WorkIcon
} as const;

type IconName = keyof typeof ICON_MAP;

interface MenuLinkProps {
  href: string;
  icon: IconName;
  label: string;
  onClick: () => void;
}

function MenuLink({ href, icon, label, onClick }: MenuLinkProps) {
  const IconComponent = ICON_MAP[icon];

  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg py-3 text-(--text-dark) hover:bg-(--primary-beige-hover) transition-colors"
    >
      {IconComponent && <IconComponent sx={{ fontSize: 20 }} />}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

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

  const handleLinkClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-primary shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-brown-dark hover:bg-(--primary-beige-hover) transition-colors"
          aria-label="Close menu"
        >
          <CloseIcon sx={{ fontSize: 24 }} />
        </button>

        <nav
          className="flex h-full flex-col px-6 py-16"
          aria-label="Mobile menu"
        >
          <div className="space-y-4 border-b border-(--brown-dark)/20 pb-6">
            {MOBILE_MENU_SECTIONS.user.map(link => (
              <MenuLink
                key={link.href}
                href={link.href}
                icon={link.icon as IconName}
                label={link.label}
                onClick={handleLinkClick}
              />
            ))}
          </div>

          <div className="space-y-4 border-b border-(--brown-dark)/20 py-6">
            {MOBILE_MENU_SECTIONS.navigation.map(link => (
              <MenuLink
                key={link.href}
                href={link.href}
                icon={link.icon as IconName}
                label={link.label}
                onClick={handleLinkClick}
              />
            ))}
          </div>

          <div className="py-6">
            {MOBILE_MENU_SECTIONS.other.map(link => (
              <MenuLink
                key={link.href}
                href={link.href}
                icon={link.icon as IconName}
                label={link.label}
                onClick={handleLinkClick}
              />
            ))}
          </div>

          <div className="mt-auto border-t border-(--brown-dark)/20 pt-6">
            <button
              onClick={onClose}
              className="flex w-full items-center gap-3 rounded-lg py-3 text-(--text-dark) hover:bg-(--primary-beige-hover) transition-colors"
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
