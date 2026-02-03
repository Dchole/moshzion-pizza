type ContactItemVariant = "dark" | "light";
type ContactItemSize = "sm" | "md" | "lg";

interface ContactItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  variant?: ContactItemVariant;
  size?: ContactItemSize;
  className?: string;
}

const sizeClasses: Record<
  ContactItemSize,
  { label: string; value: string; icon: string }
> = {
  sm: {
    label: "text-xs",
    value: "text-sm font-medium",
    icon: "text-base"
  },
  md: {
    label: "text-sm",
    value: "text-base font-semibold",
    icon: "text-xl"
  },
  lg: {
    label: "text-sm",
    value: "text-lg font-semibold",
    icon: "text-2xl"
  }
};

const variantClasses: Record<
  ContactItemVariant,
  { label: string; value: string; icon: string }
> = {
  dark: {
    label: "text-(--footer-pink)",
    value: "text-white",
    icon: "text-(--footer-pink)"
  },
  light: {
    label: "text-gray-500",
    value: "text-gray-900",
    icon: "text-brown-dark"
  }
};

export function ContactItem({
  icon,
  label,
  value,
  href,
  variant = "dark",
  size = "md",
  className = ""
}: ContactItemProps) {
  const sizes = sizeClasses[size];
  const colors = variantClasses[variant];

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={colors.icon}>{icon}</div>
      <div>
        <p className={`${sizes.label} ${colors.label}`}>{label}</p>
        <p className={`${sizes.value} ${colors.value}`}>{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="hover:opacity-80 transition-opacity">
        {content}
      </a>
    );
  }

  return content;
}

export default ContactItem;
