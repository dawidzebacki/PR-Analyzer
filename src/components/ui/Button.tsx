"use client";

import { Loader2 } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  onClick,
  type = "button",
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const base =
    "inline-flex items-center justify-center font-medium tracking-[-0.019rem] transition-colors duration-300 rounded-lg cursor-pointer";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-hover disabled:bg-btn-disabled-bg disabled:text-btn-disabled-text disabled:cursor-not-allowed",
    secondary:
      "bg-transparent text-navy border border-navy hover:text-primary hover:border-primary disabled:border-btn-disabled-bg disabled:text-btn-disabled-text disabled:cursor-not-allowed",
    ghost:
      "bg-transparent text-navy hover:bg-border disabled:text-btn-disabled-text disabled:cursor-not-allowed",
  };

  const sizes = {
    sm: "min-h-[44px] px-5 py-2 text-sm",
    md: "h-12 px-8 text-base",
    lg: "h-[60px] px-[50px] text-base",
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
