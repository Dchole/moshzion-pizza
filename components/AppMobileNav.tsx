"use client";

import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StorefrontIcon from "@mui/icons-material/Storefront";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import InfoIcon from "@mui/icons-material/Info";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PizzaSliceIcon from "./PizzaSliceIcon";

const ICON_MAP_FILLED = {
  Person: PersonIcon,
  Storefront: StorefrontIcon,
  Info: InfoIcon,
  Receipt: ReceiptIcon,
  LocalShipping: LocalShippingIcon
} as const;

const ICON_MAP_OUTLINE = {
  Person: PersonOutlineIcon,
  Storefront: StorefrontOutlinedIcon,
  Info: InfoOutlineIcon,
  Receipt: ReceiptOutlinedIcon,
  LocalShipping: LocalShippingOutlinedIcon
} as const;

interface AppMobileNavProps {
  isOpen: boolean;
  currentPath: string;
  links: Array<{ label: string; href: string; icon?: string }>;
  textColor: string;
  hoverColor: string;
  onClose: () => void;
}

export default function AppMobileNav({
  isOpen,
  currentPath,
  links,
  textColor,
  hoverColor,
  onClose
}: AppMobileNavProps) {
  const getNavLinkClasses = (isActive: boolean) => {
    const base = `${textColor} ${hoverColor} py-3 px-4 rounded-lg font-open-sans transition-colors duration-300 hover:bg-brown-medium/10 flex items-center gap-3`;
    const weight = isActive ? "font-bold" : "font-medium";

    return `${base} ${weight}`;
  };

  return (
    <nav
      className={`border-t border-brown-medium/10 transition-all duration-300 ease-out overflow-hidden ${
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}
      aria-label="Mobile navigation"
      aria-hidden={!isOpen}
    >
      <div className="mx-auto max-w-384 px-4 py-4">
        <div className="flex flex-col gap-2">
          {links.map(link => {
            const isActive = currentPath === link.href;
            const Icon = link.icon
              ? isActive
                ? ICON_MAP_FILLED[link.icon as keyof typeof ICON_MAP_FILLED]
                : ICON_MAP_OUTLINE[link.icon as keyof typeof ICON_MAP_OUTLINE]
              : null;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={getNavLinkClasses(isActive)}
              >
                {isActive && (
                  <PizzaSliceIcon className="w-5 h-5 text-brown-dark shrink-0" />
                )}
                <div className="flex items-center gap-3 flex-1">
                  {Icon && <Icon className="w-5 h-5" />}
                  {link.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
