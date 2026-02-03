type ChipVariant = "default" | "outline";
type ChipSize = "sm" | "md";

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  className?: string;
}

const sizeClasses: Record<ChipSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm"
};

const variantClasses: Record<ChipVariant, string> = {
  default: "border border-(--chip-border) bg-(--chip-bg) text-(--chip-text)",
  outline: "border border-gray-300 bg-transparent text-gray-700"
};

export function Chip({
  label,
  variant = "default",
  size = "md",
  className = ""
}: ChipProps) {
  const classes = [
    "inline-block rounded-md",
    sizeClasses[size],
    variantClasses[variant],
    className
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{label}</span>;
}

export default Chip;
