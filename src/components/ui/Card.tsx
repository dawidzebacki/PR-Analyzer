interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-surface rounded-xl shadow-sm border border-border p-6 ${
        hover
          ? "transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-md"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
