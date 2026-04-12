"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { FileCode2, ExternalLink, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { getScoreClasses } from "@/constants";
import type { PRAnalysis } from "@/types/scoring";

interface PRCardProps {
  pr: PRAnalysis;
  repoUrl: string;
}

function getScoreBadgeVariant(score: number): "success" | "warning" | "error" {
  if (score >= 70) return "success";
  if (score >= 40) return "warning";
  return "error";
}

export function PRCard({ pr, repoUrl }: PRCardProps) {
  const t = useTranslations("dashboard");
  const [expanded, setExpanded] = useState(false);
  const { text: totalTextClass } = getScoreClasses(pr.scores.total);

  const prUrl = `${repoUrl}/pull/${pr.number}`;
  const diffUrl = `${prUrl}/files`;

  return (
    <Card hover className="overflow-hidden">
      <div className="flex flex-col gap-4">
        {/* Header: title + total score */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={prUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-lg font-bold text-navy hover:text-primary transition-colors truncate"
              >
                {pr.title}
              </a>
              <Badge variant="neutral" size="sm">
                {t("prNumber", { number: pr.number })}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-text-muted">{pr.author}</p>
          </div>

          <div className="flex-shrink-0">
            <Badge variant={getScoreBadgeVariant(pr.scores.total)} size="md">
              <span className={`font-bold ${totalTextClass}`}>
                {pr.scores.total}
              </span>
            </Badge>
          </div>
        </div>

        {/* Size info + mini scores */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Size */}
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <span className="flex items-center gap-1">
              <FileCode2 className="h-4 w-4" />
              {t("filesChanged", { count: pr.filesChanged })}
            </span>
            <span className="text-accent-green font-medium">
              {t("additions", { count: pr.additions })}
            </span>
            <span className="text-error font-medium">
              {t("deletions", { count: pr.deletions })}
            </span>
          </div>

          {/* Mini score rings */}
          <div className="flex items-center gap-4">
            <ScoreRing
              score={pr.scores.impact}
              size="sm"
              label={t("impact")}
            />
            <ScoreRing
              score={pr.scores.aiLeverage}
              size="sm"
              label={t("aiLeverage")}
            />
            <ScoreRing
              score={pr.scores.quality}
              size="sm"
              label={t("quality")}
            />
          </div>
        </div>

        {/* Expandable summary + actions */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-primary transition-colors"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            />
            {pr.summary.slice(0, 60)}{pr.summary.length > 60 && !expanded ? "..." : ""}
          </button>

          <a
            href={diffUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            {t("viewDiff")}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-sm text-text-muted leading-relaxed">
                {pr.summary}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
