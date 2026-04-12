interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "neutral";
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
}: BadgeProps) {
  const variants = {
    success: "bg-accent-green/10 text-accent-green",
    warning: "bg-score-yellow/10 text-score-yellow",
    error: "bg-error/10 text-error",
    neutral: "bg-border text-text-secondary",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}
