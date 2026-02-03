export default function Logo({
  className = "w-12 h-12"
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Moshzion Pizza Logo"
    >
      <circle
        cx="35"
        cy="50"
        r="25"
        stroke="#5D3A1A"
        strokeWidth="6"
        fill="none"
      />
      <circle
        cx="65"
        cy="50"
        r="25"
        stroke="#5D3A1A"
        strokeWidth="6"
        fill="none"
      />
      <path
        d="M 50 30 Q 50 40, 50 50 Q 50 60, 50 70"
        stroke="#8B5A2B"
        strokeWidth="4"
        fill="none"
      />
    </svg>
  );
}
