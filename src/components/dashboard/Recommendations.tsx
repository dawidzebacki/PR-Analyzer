"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Lightbulb, ArrowUp, Target, CheckCircle } from "lucide-react";

interface RecommendationsProps {
  recommendations: string[];
}

const ICONS = [Lightbulb, ArrowUp, Target, CheckCircle] as const;

export function Recommendations({ recommendations }: RecommendationsProps) {
  const t = useTranslations("dashboard");

  if (recommendations.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="font-heading text-[1.5rem] font-bold leading-[1.875rem] tracking-[-0.0625rem] text-navy lg:text-[2rem] lg:leading-[2.375rem]">
          {t("recommendations")}
        </h2>
        <p className="text-base text-text-muted lg:text-[1.125rem] lg:leading-[1.75rem]">
          {t("recommendationsSubtitle")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((recommendation, index) => {
          const Icon = ICONS[index % ICONS.length];

          return (
            <motion.div
              key={`${index}-${recommendation.slice(0, 24)}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.08 }}
              className="flex gap-4 rounded-xl border border-accent-green/20 bg-accent-green/5 p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-green/15 text-accent-green">
                <Icon className="h-5 w-5" />
              </div>
              <p className="flex-1 text-[0.9375rem] leading-[1.5rem] text-navy">
                {recommendation}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
