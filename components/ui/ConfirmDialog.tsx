/**
 * Confirm Dialog Component
 * Replaces window.confirm with accessible modal dialog
 */

"use client";

import { Dialog } from "./Dialog";
import { Button } from "./Button";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

const variantStyles = {
  danger: {
    icon: WarningAmberIcon,
    iconColor: "text-red-600",
    iconBg: "bg-red-100"
  },
  warning: {
    icon: WarningAmberIcon,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100"
  },
  info: {
    icon: HelpOutlineIcon,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100"
  }
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "info",
  isLoading = false
}: ConfirmDialogProps) {
  const style = variantStyles[variant];
  const Icon = style.icon;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      closeOnClickAway={!isLoading}
      className="rounded-lg shadow-2xl border-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm w-[min(400px,calc(100%-2rem))] p-0"
    >
      <div className="p-6">
        <div className="flex gap-4">
          <div
            className={`${style.iconBg} rounded-full p-3 shrink-0 h-fit`}
            aria-hidden="true"
          >
            <Icon className={style.iconColor} sx={{ fontSize: 24 }} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-display text-brown-dark mb-2">
              {title}
            </h3>
            <p className="text-gray-700 font-open-sans text-sm leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            color="brown"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="primary"
            color={variant === "danger" ? "beige" : "beige"}
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
