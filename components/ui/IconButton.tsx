import Link from "next/link";

type IconButtonVariant = "filled" | "outline" | "ghost";
type IconButtonColor = "white" | "brown" | "beige";
type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonBaseProps {
  variant?: IconButtonVariant;
  color?: IconButtonColor;
  size?: IconButtonSize;
  icon: React.ReactNode;
  "aria-label": string;
  className?: string;
  disabled?: boolean;
}

interface IconButtonAsButton extends IconButtonBaseProps {
  href?: never;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface IconButtonAsLink extends IconButtonBaseProps {
  href: string;
  type?: never;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export type IconButtonProps = IconButtonAsButton | IconButtonAsLink;

const sizeClasses: Record<IconButtonSize, string> = {
  sm: "p-1.5",
  md: "p-2",
  lg: "p-3"
};

const getVariantClasses = (
  variant: IconButtonVariant,
  color: IconButtonColor
): string => {
  const variants: Record<IconButtonVariant, Record<IconButtonColor, string>> = {
    filled: {
      white: "bg-white text-brown-dark hover:bg-gray-100 shadow-md",
      brown: "bg-brown-dark text-white hover:bg-brown-medium",
      beige:
        "bg-primary text-brown-dark hover:bg-(--primary-beige-hover) shadow-md"
    },
    outline: {
      white: "border-2 border-white text-white hover:bg-white/10",
      brown:
        "border-2 border-brown-dark text-brown-dark hover:bg-brown-dark hover:text-white",
      beige: "border-2 border-primary text-brown-dark hover:bg-primary"
    },
    ghost: {
      white: "text-white hover:bg-white/10",
      brown: "text-brown-dark hover:bg-gray-100",
      beige: "text-brown-dark hover:bg-(--primary-beige-hover)"
    }
  };

  return variants[variant][color];
};

export function IconButton({
  variant = "filled",
  color = "beige",
  size = "md",
  icon,
  "aria-label": ariaLabel,
  className = "",
  disabled = false,
  ...props
}: IconButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full transition-colors";

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";

  const classes = [
    baseClasses,
    sizeClasses[size],
    getVariantClasses(variant, color),
    disabledClasses,
    className
  ]
    .filter(Boolean)
    .join(" ");

  // Render as Link if href is provided
  if ("href" in props && props.href) {
    const { href, onClick } = props as IconButtonAsLink;
    return (
      <Link
        href={href}
        className={classes}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {icon}
      </Link>
    );
  }

  // Render as button
  const { type = "button", onClick } = props as IconButtonAsButton;
  return (
    <button
      type={type}
      className={classes}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

export default IconButton;
