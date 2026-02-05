"use client";

import { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function SignInModal({ isOpen, onClose, children }: SignInModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className="relative z-10 w-full h-full md:h-auto md:max-h-[90vh] md:max-w-md md:rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors z-10"
          aria-label="Close sign in modal"
        >
          <CloseIcon />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
