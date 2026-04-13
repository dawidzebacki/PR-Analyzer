"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export type ToastVariant = "success" | "error" | "info";

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onDismiss?: () => void;
}

const VARIANT_STYLES: Record<
  ToastVariant,
  { icon: typeof CheckCircle2; className: string; iconClass: string }
> = {
  success: {
    icon: CheckCircle2,
    className: "border-accent-green/30 bg-accent-green/10 text-navy",
    iconClass: "text-accent-green",
  },
  error: {
    icon: XCircle,
    className: "border-error/30 bg-error-bg text-navy",
    iconClass: "text-error",
  },
  info: {
    icon: Info,
    className: "border-accent-blue/30 bg-accent-blue/10 text-navy",
    iconClass: "text-accent-blue",
  },
};

export function Toast({ message, variant = "info", onDismiss }: ToastProps) {
  const { icon: Icon, className, iconClass } = VARIANT_STYLES[variant];

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm ${className}`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} aria-hidden />
      <p className="flex-1 text-sm font-medium leading-5">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-text-muted transition-colors hover:text-navy"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}

interface ActiveToast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 3000;

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, variant }]);
    },
    [],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onDismiss={() => dismiss(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  toast: ActiveToast;
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <Toast
      message={toast.message}
      variant={toast.variant}
      onDismiss={onDismiss}
    />
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
