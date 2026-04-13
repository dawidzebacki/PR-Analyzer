"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Flame, Bot, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { SCORING_WEIGHTS, getScoreClasses } from "@/constants";
import type { PRScore } from "@/types/scoring";
import {
  itemContainerVariants,
  itemVariants,
  sectionVariants,
} from "@/lib/animations";

interface ScoreBreakdownProps {
  scores: PRScore;
}

const DIMENSIONS = [
  { key: "impact" as const, icon: Flame, weight: SCORING_WEIGHTS.impact },
  { key: "aiLeverage" as const, icon: Bot, weight: SCORING_WEIGHTS.aiLeverage },
  { key: "quality" as const, icon: ShieldCheck, weight: SCORING_WEIGHTS.quality },
] as const;

function ScoreBar({ score, label }: { score: number; label: string }) {
  const { text, bg } = getScoreClasses(score);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-navy">{label}</span>
        <AnimatedNumber value={score} className={`font-bold ${text}`} />
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-border">
        <motion.div
          className={`h-full rounded-full ${bg}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

export function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  const t = useTranslations("dashboard");

  const radarData = DIMENSIONS.map((dim) => ({
    dimension: t(dim.key),
    score: scores[dim.key],
    fullMark: 100,
  }));

  return (
    <motion.section
      variants={sectionVariants}
      className="space-y-6"
      aria-labelledby="score-breakdown-heading"
    >
      <h2
        id="score-breakdown-heading"
        className="font-heading text-[1.5rem] font-bold leading-[1.875rem] tracking-[-0.0625rem] text-navy lg:text-[2rem] lg:leading-[2.375rem]"
      >
        {t("scoreBreakdown")}
      </h2>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar Chart */}
        <Card className="flex items-center justify-center py-8">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: "var(--color-text-muted)", fontSize: 13 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
                tickCount={6}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.2}
                strokeWidth={2}
                isAnimationActive
                animationBegin={300}
                animationDuration={900}
                animationEasing="ease-out"
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Charts */}
        <Card className="flex flex-col justify-center gap-5">
          {DIMENSIONS.map((dim) => (
            <ScoreBar
              key={dim.key}
              score={scores[dim.key]}
              label={`${t(dim.key)} (${t("weight", { value: `${Math.round(dim.weight * 100)}%` })})`}
            />
          ))}
        </Card>
      </div>

      {/* Dimension Cards */}
      <motion.div
        className="grid gap-6 md:grid-cols-3"
        variants={itemContainerVariants}
      >
        {DIMENSIONS.map((dim) => {
          const Icon = dim.icon;

          return (
            <motion.div key={dim.key} variants={itemVariants}>
              <Card className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <ScoreRing score={scores[dim.key]} size="sm" animated />
                <div>
                  <h3 className="font-heading text-lg font-bold text-navy">
                    {t(dim.key)}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">
                    {t(`${dim.key}Description`)}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
