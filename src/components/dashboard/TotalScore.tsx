"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="flex flex-col items-center gap-4 py-10">
        <ScoreRing score={score} size="lg" animated />
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-heading text-xl font-bold text-navy">
            {t("repoScore")}
          </h2>
          <Badge variant={tier.variant}>{t(tier.key)}</Badge>
        </div>
      </Card>
    </motion.div>
  );
}
