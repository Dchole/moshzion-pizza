import React from "react";

interface SelectButtonProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SelectButton({
  selected,
  onClick,
  children,
  className = ""
}: SelectButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border-2 p-3 text-center transition-colors font-open-sans ${
        selected
          ? "border-brown-dark bg-[#BCE7FF]"
          : "border-gray-200 bg-white hover:border-gray-300"
      } ${className}`}
      aria-pressed={selected}
    >
      {children}
    </button>
  );
}
