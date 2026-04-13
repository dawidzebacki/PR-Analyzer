"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Lightbulb, ArrowUp, Target, CheckCircle } from "lucide-react";
import {
  itemContainerVariants,
  itemVariants,
  sectionVariants,
} from "@/lib/animations";

interface RecommendationsProps {
  recommendations: string[];
}

const ICONS = [Lightbulb, ArrowUp, Target, CheckCircle] as const;

export function Recommendations({ recommendations }: RecommendationsProps) {
  const t = useTranslations("dashboard");

  if (recommendations.length === 0) return null;

  return (
    <motion.section
      variants={sectionVariants}
      className="space-y-6"
      aria-labelledby="recommendations-heading"
    >
      <div className="space-y-2">
        <h2
          id="recommendations-heading"
          className="font-heading text-[1.5rem] font-bold leading-[1.875rem] tracking-[-0.0625rem] text-navy lg:text-[2rem] lg:leading-[2.375rem]"
        >
          {t("recommendations")}
        </h2>
        <p className="text-base text-text-muted lg:text-[1.125rem] lg:leading-[1.75rem]">
          {t("recommendationsSubtitle")}
        </p>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-2"
        variants={itemContainerVariants}
      >
        {recommendations.map((recommendation, index) => {
          const Icon = ICONS[index % ICONS.length];

          return (
            <motion.div
              key={`${index}-${recommendation.slice(0, 24)}`}
              variants={itemVariants}
              className="flex gap-4 rounded-xl border border-accent-green/20 bg-accent-green/5 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
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
      </motion.div>
    </motion.section>
  );
}
