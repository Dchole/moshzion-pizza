import Link from "next/link";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import { SOCIAL_LINKS } from "@/lib/constants";

type SocialLinksVariant = "light" | "dark";
type SocialLinksSize = "sm" | "md" | "lg";

interface SocialLinksProps {
  variant?: SocialLinksVariant;
  size?: SocialLinksSize;
  className?: string;
}

const sizeClasses: Record<SocialLinksSize, { icon: number; gap: string }> = {
  sm: { icon: 20, gap: "gap-3" },
  md: { icon: 24, gap: "gap-4" },
  lg: { icon: 28, gap: "gap-5" }
};

const variantClasses: Record<SocialLinksVariant, string> = {
  light: "text-gray-600 hover:text-gray-900",
  dark: "text-(--footer-muted) hover:text-white"
};

const SOCIAL_ITEMS = [
  {
    key: "facebook",
    href: SOCIAL_LINKS.facebook,
    Icon: FacebookIcon,
    label: "Facebook"
  },
  {
    key: "whatsapp",
    href: SOCIAL_LINKS.whatsapp,
    Icon: WhatsAppIcon,
    label: "WhatsApp"
  },
  {
    key: "instagram",
    href: SOCIAL_LINKS.instagram,
    Icon: InstagramIcon,
    label: "Instagram"
  }
];

export function SocialLinks({
  variant = "dark",
  size = "md",
  className = ""
}: SocialLinksProps) {
  const sizes = sizeClasses[size];
  const colorClass = variantClasses[variant];

  return (
    <nav
      aria-label="Social media links"
      className={`flex items-center ${sizes.gap} ${className}`}
    >
      {SOCIAL_ITEMS.map(({ key, href, Icon, label }) => (
        <Link
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`transition-colors ${colorClass}`}
          aria-label={`Visit our ${label} page`}
        >
          <Icon sx={{ fontSize: sizes.icon }} />
        </Link>
      ))}
    </nav>
  );
}

export default SocialLinks;
