"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className = "", id, ...rest }, ref) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-navy"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-xl border bg-surface px-4 py-3 text-base text-text placeholder:text-text-muted outline-none transition-colors duration-200 focus:ring-2 focus:ring-primary/30 focus:border-primary ${
            error
              ? "border-error focus:ring-error/30 focus:border-error"
              : "border-border"
          } ${className}`}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          {...rest}
        />
        {error && (
          <p
            id={inputId ? `${inputId}-error` : undefined}
            className="text-sm text-error"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
