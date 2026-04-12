interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "primary" | "secondary";
}

export function Section({
  children,
  className = "",
  id,
  background = "primary",
}: SectionProps) {
  const backgrounds = {
    primary: "bg-background",
    secondary: "bg-surface",
  };

  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${backgrounds[background]} ${className}`}
    >
      {children}
    </section>
  );
}
