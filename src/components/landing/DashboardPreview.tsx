"use client";

import { useTranslations } from "next-intl";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const MOCK_PRS = [
  { title: "feat: add OAuth2 login flow", score: 92 },
  { title: "fix: resolve race condition in queue", score: 45 },
  { title: "refactor: extract payment module", score: 85 },
  { title: "chore: bump deps, update lockfile", score: 31 },
] as const;

const DIMENSION_KEYS = ["impact", "aiLeverage", "quality"] as const;

const DIMENSION_SCORES: Record<(typeof DIMENSION_KEYS)[number], number> = {
  impact: 87,
  aiLeverage: 76,
  quality: 89,
};

const DIMENSION_COLOR = "#4E43E1";

const OVERALL_SCORE = { score: 84, color: "#4E43E1" };

const CIRCUMFERENCE_LG = 2 * Math.PI * 56;
const CIRCUMFERENCE_SM = 2 * Math.PI * 27;

interface AnimatedRingProps {
  score: number;
  color: string;
  size: "sm" | "lg";
  label: string;
  inView: boolean;
}

function AnimatedRing({ score, color, size, label, inView }: AnimatedRingProps) {
  const value = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  const isLg = size === "lg";
  const dimension = isLg ? 128 : 64;
  const center = dimension / 2;
  const radius = isLg ? 56 : 27;
  const strokeWidth = isLg ? 8 : 5;
  const circumference = isLg ? CIRCUMFERENCE_LG : CIRCUMFERENCE_SM;
  const offset = useTransform(value, (v) => circumference * (1 - v / 100));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, score, {
      duration: 1.2,
      ease: "easeOut",
      delay: 0.3,
    });
    const unsub = value.on("change", (v) => setDisplay(Math.round(v)));
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, score, value]);

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div className="relative" style={{ width: dimension, height: dimension }}>
        <svg
          width={dimension}
          height={dimension}
          viewBox={`0 0 ${dimension} ${dimension}`}
          className="-rotate-90"
          role="img"
          aria-label={`${label}: ${score}`}
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: offset }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-bold ${isLg ? "text-3xl" : "text-base"}`}
            style={{ color }}
          >
            {display}
          </span>
        </div>
      </div>
      <span className={`font-medium text-text-muted ${isLg ? "text-sm" : "text-xs"}`}>
        {label}
      </span>
    </div>
  );
}

function getBadgeVariant(score: number): "success" | "warning" | "error" {
  if (score >= 70) return "success";
  if (score >= 40) return "warning";
  return "error";
}

export function DashboardPreview() {
  const t = useTranslations("preview");
  const tScoring = useTranslations("scoring");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="preview" ref={ref} className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1110px] px-[18px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="font-heading text-[2rem] font-bold leading-[2.375rem] tracking-[-0.0625rem] text-navy lg:text-[3rem] lg:leading-[3.375rem] lg:tracking-[-0.1125rem]">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-text-muted">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="mt-16 flex justify-center"
        >
          <Card className="w-full max-w-[680px] p-8 lg:p-10">
            {/* Overall Score */}
            <div className="flex flex-col items-center">
              <AnimatedRing
                score={OVERALL_SCORE.score}
                color={OVERALL_SCORE.color}
                size="lg"
                label={t("overallScore")}
                inView={inView}
              />
            </div>

            {/* Dimension mini rings */}
            <div className="mt-8 flex justify-center gap-8 sm:gap-12">
              {DIMENSION_KEYS.map((key) => (
                <AnimatedRing
                  key={key}
                  score={DIMENSION_SCORES[key]}
                  color={DIMENSION_COLOR}
                  size="sm"
                  label={tScoring(`${key}.title`)}
                  inView={inView}
                />
              ))}
            </div>

            {/* Mini PR table */}
            <div className="mt-8 border-t border-border pt-6">
              <p className="mb-4 text-sm font-semibold text-navy">
                {t("recentPRs")}
              </p>
              <div className="space-y-3">
                {MOCK_PRS.map((pr) => (
                  <div
                    key={pr.title}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="truncate text-sm text-text-secondary">
                      {pr.title}
                    </span>
                    <Badge variant={getBadgeVariant(pr.score)} size="sm">
                      {pr.score}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
