"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { sectionVariants } from "@/lib/animations";

interface TotalScoreProps {
  score: number;
}

function getScoreTier(score: number) {
  if (score >= 90) return { key: "above90" as const, variant: "success" as const };
  if (score >= 70) return { key: "above70" as const, variant: "success" as const };
  if (score >= 40) return { key: "above40" as const, variant: "warning" as const };
  return { key: "below40" as const, variant: "error" as const };
}

export function TotalScore({ score }: TotalScoreProps) {
  const t = useTranslations("dashboard");
  const tier = getScoreTier(score);

  return (
    <motion.section variants={sectionVariants} aria-labelledby="total-score-heading">
      <Card className="flex flex-col items-center gap-4 py-10">
        <ScoreRing score={score} size="lg" animated />
        <div className="flex flex-col items-center gap-2">
          <h2
            id="total-score-heading"
            className="font-heading text-[1.5rem] font-bold leading-[1.875rem] tracking-[-0.0625rem] text-navy lg:text-[2rem] lg:leading-[2.375rem]"
          >
            {t("totalScore")}
          </h2>
          <Badge variant={tier.variant}>{t(tier.key)}</Badge>
        </div>
      </Card>
    </motion.section>
  );
}
