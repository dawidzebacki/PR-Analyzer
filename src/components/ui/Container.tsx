interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-[1110px] px-[18px] ${className}`}>
      {children}
    </div>
  );
}
