import Link from "next/link";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonColor = "white" | "brown" | "beige" | "red";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: never;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  type?: never;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg"
};

const getVariantClasses = (
  variant: ButtonVariant,
  color: ButtonColor
): string => {
  const variants: Record<ButtonVariant, Record<ButtonColor, string>> = {
    primary: {
      white: "bg-white text-brown-dark hover:bg-gray-100 shadow-lg",
      brown: "bg-brown-dark text-white hover:bg-brown-medium",
      beige: "bg-primary text-brown-dark hover:bg-(--primary-beige-hover)",
      red: "bg-white text-(--newsletter-bg) hover:bg-gray-100"
    },
    outline: {
      white: "border-2 border-white text-white hover:bg-white/10",
      brown:
        "border-2 border-brown-dark text-brown-dark hover:bg-brown-dark hover:text-white",
      beige: "border-2 border-primary text-brown-dark hover:bg-primary",
      red: "border-2 border-(--newsletter-bg) text-(--newsletter-bg) hover:bg-(--newsletter-bg) hover:text-white"
    },
    ghost: {
      white: "bg-transparent text-white hover:bg-white/10",
      brown:
        "bg-transparent border border-brown-medium text-brown-medium hover:bg-gray-50",
      beige: "bg-transparent text-brown-dark hover:bg-(--primary-beige-hover)",
      red: "bg-transparent text-(--newsletter-bg) hover:bg-red-50"
    }
  };

  return variants[variant][color];
};

export function Button({
  variant = "primary",
  color = "brown",
  size = "md",
  icon,
  iconPosition = "right",
  fullWidth = false,
  disabled = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer";

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";

  const widthClasses = fullWidth ? "w-full" : "";

  const classes = [
    baseClasses,
    sizeClasses[size],
    getVariantClasses(variant, color),
    disabledClasses,
    widthClasses,
    className
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </>
  );

  if ("href" in props && props.href) {
    const { href, onClick } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  const { type = "button", onClick } = props as ButtonAsButton;
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

export default Button;
