"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { TotalScore } from "@/components/dashboard/TotalScore";
import { ScoreBreakdown } from "@/components/dashboard/ScoreBreakdown";
import { PRCard } from "@/components/dashboard/PRCard";
import type { PRAnalysis, PRScore } from "@/types/scoring";

const MOCK_SCORES: PRScore = {
  impact: 87,
  aiLeverage: 76,
  quality: 89,
  total: 84,
};

const MOCK_PR: PRAnalysis = {
  number: 142,
  title: "feat: add OAuth2 login flow",
  author: "maintainer",
  description: "Adds OAuth2 provider with Google and GitHub.",
  state: "closed",
  mergedAt: "2026-01-15T10:30:00.000Z",
  filesChanged: 12,
  additions: 287,
  deletions: 43,
  scores: { impact: 87, aiLeverage: 76, quality: 89, total: 84 },
  summary:
    "Delivers a complete OAuth2 login flow with Google and GitHub providers, full test coverage, and robust error handling.",
};

const MOCK_REPO_URL = "https://github.com/owner/repo";

export function DashboardPreview() {
  const t = useTranslations("preview");

  return (
    <section id="preview" className="bg-background py-20 lg:py-28">
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
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="mt-16 space-y-10"
        >
          <TotalScore score={MOCK_SCORES.total} />
          <ScoreBreakdown scores={MOCK_SCORES} />
          <PRCard pr={MOCK_PR} repoUrl={MOCK_REPO_URL} />
        </motion.div>
      </div>
    </section>
  );
}
