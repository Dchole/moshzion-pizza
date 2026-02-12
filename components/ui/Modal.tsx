/**
 * Unified Modal Component
 * Uses native <dialog> element with proper a11y and focus trap
 */

"use client";

import { useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg";
  showCloseButton?: boolean;
  closeOnClickOutside?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg"
};

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "md",
  showCloseButton = true,
  closeOnClickOutside = true
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
      // Focus trap is automatic with <dialog>
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
    };

    const handleClick = (e: MouseEvent) => {
      if (!closeOnClickOutside) return;

      const rect = dialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("click", handleClick);
    dialog.addEventListener("keydown", handleKeyDown);

    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleClick);
      dialog.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, closeOnClickOutside]);

  return (
    <dialog
      ref={dialogRef}
      className={`${maxWidthClasses[maxWidth]} w-full rounded-lg shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-sm p-0 open:animate-in open:fade-in open:zoom-in-95 duration-200`}
    >
      <div className="bg-white rounded-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between mb-4">
              {title && (
                <h2 className="text-2xl font-display text-brown-dark">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-auto text-gray-500 hover:text-brown-dark transition-colors p-1 rounded-full hover:bg-gray-100"
                  aria-label="Close modal"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </dialog>
  );
}
