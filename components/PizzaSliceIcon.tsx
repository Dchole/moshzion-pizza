export default function PizzaSliceIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 4 4 L 22 12 L 4 20 Z" />
      <path d="M 4 4 Q 1 12 4 20 Z" />
      <circle cx="10" cy="9" r="1.2" fill="white" opacity="0.3" />
      <circle cx="14" cy="12" r="1.5" fill="white" opacity="0.3" />
      <circle cx="10" cy="15" r="1.2" fill="white" opacity="0.3" />
    </svg>
  );
}
