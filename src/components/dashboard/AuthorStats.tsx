"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AuthorCard } from "@/components/dashboard/AuthorCard";
import type { AuthorStats as AuthorStatsType, PRAnalysis, PRScore } from "@/types/scoring";
import {
  itemContainerVariants,
  itemVariants,
  sectionVariants,
} from "@/lib/animations";

interface AuthorStatsProps {
  authorStats: AuthorStatsType[];
  prs: PRAnalysis[];
  repoAvg: PRScore;
}

type SortField = "name" | "prCount" | "score";

const SORT_OPTIONS: { value: SortField; labelKey: string }[] = [
  { value: "score", labelKey: "sortAuthorScore" },
  { value: "prCount", labelKey: "sortAuthorPrCount" },
  { value: "name", labelKey: "sortAuthorName" },
];

function sortAuthors(
  stats: AuthorStatsType[],
  field: SortField,
): AuthorStatsType[] {
  const sorted = [...stats];
  sorted.sort((a, b) => {
    switch (field) {
      case "name":
        return a.author.localeCompare(b.author);
      case "prCount":
        return b.prCount - a.prCount;
      case "score":
        return b.avgScores.total - a.avgScores.total;
    }
  });
  return sorted;
}

export function AuthorStats({ authorStats, prs, repoAvg }: AuthorStatsProps) {
  const t = useTranslations("dashboard");
  const [sortField, setSortField] = useState<SortField>("score");

  const sorted = useMemo(
    () => sortAuthors(authorStats, sortField),
    [authorStats, sortField],
  );

  if (authorStats.length === 0) return null;

  // Single PR mode: only 1 PR total — show inline simplified view
  const isSinglePrMode = prs.length === 1 && authorStats.length === 1;

  return (
    <motion.section
      variants={sectionVariants}
      className="space-y-6"
      aria-labelledby="authors-heading"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="authors-heading"
          className="font-heading text-[1.5rem] font-bold leading-[1.875rem] tracking-[-0.0625rem] text-navy lg:text-[2rem] lg:leading-[2.375rem]"
        >
          {t("authors")}
        </h2>

        {!isSinglePrMode && authorStats.length > 1 && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="author-sort"
              className="text-sm font-medium text-text-muted whitespace-nowrap"
            >
              {t("sortBy")}
            </label>
            <select
              id="author-sort"
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {isSinglePrMode ? (
        <div className="max-w-md">
          <AuthorCard stats={authorStats[0]} prs={prs} repoAvg={repoAvg} />
        </div>
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          variants={itemContainerVariants}
        >
          {sorted.map((stats) => (
            <motion.div key={stats.author} layout variants={itemVariants}>
              <AuthorCard stats={stats} prs={prs} repoAvg={repoAvg} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
}
