/**
 * Alert Component
 * Reusable component for displaying messages (error, success, warning, info)
 * Fixes code duplication and ensures consistent a11y color contrast
 */

"use client";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface AlertProps {
  variant?: "error" | "success" | "warning" | "info";
  message: string;
  className?: string;
}

const variantStyles = {
  error: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon: ErrorOutlineIcon,
    iconColor: "text-red-600"
  },
  success: {
    container: "bg-green-50 border-green-200 text-green-800",
    icon: CheckCircleOutlineIcon,
    iconColor: "text-green-600"
  },
  warning: {
    container: "bg-amber-50 border-amber-200 text-amber-900",
    icon: WarningAmberIcon,
    iconColor: "text-amber-600"
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-900",
    icon: InfoOutlinedIcon,
    iconColor: "text-blue-600"
  }
};

export function Alert({
  variant = "info",
  message,
  className = ""
}: AlertProps) {
  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <div
      className={`${style.container} border rounded-lg p-4 ${className}`}
      role="alert"
    >
      <div className="flex gap-3">
        <Icon className={`${style.iconColor} shrink-0`} sx={{ fontSize: 20 }} />
        <p className="text-sm font-open-sans leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
