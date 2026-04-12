"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitPullRequest,
  Code,
  Brain,
  Calculator,
  Lightbulb,
  Check,
} from "lucide-react";

const STEPS = [
  { key: "step1", icon: GitPullRequest },
  { key: "step2", icon: Code },
  { key: "step3", icon: Brain },
  { key: "step4", icon: Calculator },
  { key: "step5", icon: Lightbulb },
] as const;

const STEP_INTERVAL = 5000;
const FUN_FACT_KEYS = [
  "funFact1",
  "funFact2",
  "funFact3",
  "funFact4",
  "funFact5",
] as const;

export function AnalysisLoading() {
  const t = useTranslations("loading");
  const [activeStep, setActiveStep] = useState(0);
  const [funFactIndex, setFunFactIndex] = useState(() =>
    Math.floor(Math.random() * FUN_FACT_KEYS.length)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, STEP_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFunFactIndex((prev) => (prev + 1) % FUN_FACT_KEYS.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-[18px]">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="mb-10 h-1.5 w-full overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={`flex items-center gap-4 rounded-xl px-5 py-4 transition-colors duration-300 ${
                  isActive
                    ? "bg-surface shadow-sm ring-1 ring-border"
                    : isCompleted
                      ? "bg-transparent"
                      : "bg-transparent opacity-40"
                }`}
              >
                {/* Icon / Checkmark */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                    isCompleted
                      ? "bg-accent-green/10 text-accent-green"
                      : isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-border text-text-muted"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Check className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="icon"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Label */}
                <span
                  className={`text-base font-medium transition-colors duration-300 ${
                    isCompleted
                      ? "text-accent-green"
                      : isActive
                        ? "text-navy"
                        : "text-text-muted"
                  }`}
                >
                  {t(step.key)}
                </span>

                {/* Active spinner */}
                {isActive && (
                  <motion.div
                    className="ml-auto h-4 w-4 rounded-full border-2 border-primary border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress hint */}
        <p className="mt-8 text-center text-sm text-text-muted">
          {t("progress")}
        </p>

        {/* Fun fact */}
        <div className="mt-4 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={funFactIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-center text-sm italic text-text-secondary"
            >
              {t(FUN_FACT_KEYS[funFactIndex])}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
