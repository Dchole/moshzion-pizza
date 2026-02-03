type SectionHeaderAlignment = "left" | "center";
type SectionHeaderColor = "brown" | "white" | "red";

interface SectionHeaderProps {
  title: string;
  subtitle?: string | string[];
  alignment?: SectionHeaderAlignment;
  color?: SectionHeaderColor;
  className?: string;
}

const colorClasses: Record<
  SectionHeaderColor,
  { title: string; subtitle: string }
> = {
  brown: {
    title: "text-brown-dark",
    subtitle: "text-gray-700"
  },
  white: {
    title: "text-white",
    subtitle: "text-gray-300"
  },
  red: {
    title: "text-(--newsletter-heading)",
    subtitle: "text-(--newsletter-body)"
  }
};

const alignmentClasses: Record<SectionHeaderAlignment, string> = {
  left: "text-left",
  center: "text-center"
};

export function SectionHeader({
  title,
  subtitle,
  alignment = "center",
  color = "brown",
  className = ""
}: SectionHeaderProps) {
  const colors = colorClasses[color];
  const align = alignmentClasses[alignment];

  // Normalize subtitle to array for consistent rendering
  const subtitles = subtitle
    ? Array.isArray(subtitle)
      ? subtitle
      : [subtitle]
    : [];

  return (
    <div className={`mb-8 ${align} ${className}`}>
      <h2
        className={`font-display text-5xl sm:text-6xl lg:text-7xl mb-4 ${colors.title}`}
      >
        {title}
      </h2>
      {subtitles.map((text, index) => (
        <p
          key={index}
          className={`text-lg sm:text-xl max-w-2xl mx-auto ${index > 0 ? "mt-2" : ""} ${colors.subtitle}`}
        >
          {text}
        </p>
      ))}
    </div>
  );
}

export default SectionHeader;
