import React, { forwardRef, InputHTMLAttributes, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: "default" | "newsletter";
  labelClassName?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      startIcon,
      endIcon,
      variant = "default",
      className = "",
      labelClassName = "",
      containerClassName = "",
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;

    const variantStyles = {
      default:
        "rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:border-brown-medium focus:outline-none focus:ring-1 focus:ring-brown-medium disabled:opacity-50 disabled:cursor-not-allowed",
      newsletter:
        "rounded-sm border border-gray-400 bg-(--newsletter-input-bg) px-4 py-3 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
    };

    const baseStyles = variantStyles[variant];
    const errorStyles = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "";
    const iconPaddingLeft = startIcon ? "pl-10" : "";
    const iconPaddingRight = endIcon ? "pr-10" : "";

    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-medium text-gray-700 mb-1 font-open-sans ${labelClassName}`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full font-open-sans ${baseStyles} ${errorStyles} ${iconPaddingLeft} ${iconPaddingRight} ${className}`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />
          {endIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              {endIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs text-red-600 mt-1 font-open-sans"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-xs text-gray-600 mt-1 font-open-sans"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
