"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "./Button";
import { PR_SCOPES, PR_TYPE_PREFIXES, type PRScope, type PRTypePrefix } from "@/constants";

export interface AnalysisScopeSubmit {
  scope: PRScope;
  typeFilter?: PRTypePrefix[];
}

interface AnalysisScopeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AnalysisScopeSubmit) => void;
}

export function AnalysisScopeDialog({
  open,
  onClose,
  onSubmit,
}: AnalysisScopeDialogProps) {
  const t = useTranslations("analysisScope");

  const [scope, setScope] = useState<PRScope>("merged");
  const [types, setTypes] = useState<Set<PRTypePrefix>>(new Set());
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function toggleType(type: PRTypePrefix) {
    const next = new Set(types);
    if (next.has(type)) {
      next.delete(type);
    } else {
      next.add(type);
    }
    setTypes(next);
  }

  function handleSubmit() {
    onSubmit({
      scope,
      typeFilter: types.size > 0 ? Array.from(types) : undefined,
    });
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-sm px-4"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            key="dialog"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-lg rounded-xl bg-surface p-6 shadow-xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="scope-dialog-title"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-border hover:text-navy cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h2
              id="scope-dialog-title"
              className="font-heading text-2xl font-bold tracking-[-0.0625rem] text-navy"
            >
              {t("title")}
            </h2>
            <p className="mt-2 text-sm text-text-muted">{t("subtitle")}</p>

            {/* Scope radio group */}
            <fieldset className="mt-6">
              <legend className="text-sm font-semibold text-navy">
                {t("scopeLabel")}
              </legend>
              <div
                role="radiogroup"
                aria-label={t("scopeLabel")}
                className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
              >
                {PR_SCOPES.map((s) => {
                  const selected = scope === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setScope(s)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                        selected
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-surface text-navy hover:border-primary/50"
                      }`}
                    >
                      {t(`scope.${s}`)}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Type filter chips */}
            <fieldset className="mt-6">
              <legend className="text-sm font-semibold text-navy">
                {t("typesLabel")}
              </legend>
              <p className="mt-1 text-xs text-text-muted">
                {t("typesHint")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {PR_TYPE_PREFIXES.map((type) => {
                  const selected = types.has(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      role="checkbox"
                      aria-checked={selected}
                      onClick={() => toggleType(type)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-surface text-text-secondary hover:border-primary/50"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={onClose}>
                {t("cancel")}
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                {t("submit")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
