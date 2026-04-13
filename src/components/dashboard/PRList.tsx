"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  PRListControls,
  type SortField,
  type SortDirection,
} from "@/components/dashboard/PRListControls";
import { PRCard } from "@/components/dashboard/PRCard";
import type { PRAnalysis } from "@/types/scoring";
import { sectionVariants } from "@/lib/animations";

interface PRListProps {
  prs: PRAnalysis[];
  repoUrl: string;
}

function getSortValue(pr: PRAnalysis, field: SortField): number {
  switch (field) {
    case "total":
      return pr.scores.total;
    case "impact":
      return pr.scores.impact;
    case "aiLeverage":
      return pr.scores.aiLeverage;
    case "quality":
      return pr.scores.quality;
    case "size":
      return pr.additions + pr.deletions;
    case "date":
      return pr.number;
  }
}

export function PRList({ prs, repoUrl }: PRListProps) {
  const t = useTranslations("dashboard");

  const [sortField, setSortField] = useState<SortField>("total");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [authorFilter, setAuthorFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const authors = useMemo(
    () => [...new Set(prs.map((pr) => pr.author))].sort(),
    [prs],
  );

  const filteredAndSorted = useMemo(() => {
    let result = [...prs];

    // Filter by author
    if (authorFilter) {
      result = result.filter((pr) => pr.author === authorFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (pr) =>
          pr.title.toLowerCase().includes(query) ||
          pr.author.toLowerCase().includes(query) ||
          pr.summary.toLowerCase().includes(query) ||
          String(pr.number).includes(query),
      );
    }

    // Sort
    result.sort((a, b) => {
      const aVal = getSortValue(a, sortField);
      const bVal = getSortValue(b, sortField);
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [prs, sortField, sortDirection, authorFilter, searchQuery]);

  return (
    <motion.section
      variants={sectionVariants}
      className="space-y-6"
      aria-labelledby="pr-list-heading"
    >
      <h2
        id="pr-list-heading"
        className="font-heading text-[1.5rem] font-bold leading-[1.875rem] tracking-[-0.0625rem] text-navy lg:text-[2rem] lg:leading-[2.375rem]"
      >
        {t(prs.length === 1 ? "pullRequest" : "pullRequests")}
      </h2>

      {prs.length > 1 && (
        <PRListControls
          sortField={sortField}
          sortDirection={sortDirection}
          authorFilter={authorFilter}
          searchQuery={searchQuery}
          authors={authors}
          onSortFieldChange={setSortField}
          onSortDirectionChange={setSortDirection}
          onAuthorFilterChange={setAuthorFilter}
          onSearchQueryChange={setSearchQuery}
        />
      )}

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredAndSorted.map((pr) => (
            <motion.article
              key={pr.number}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              aria-label={pr.title}
            >
              <PRCard pr={pr} repoUrl={repoUrl} />
            </motion.article>
          ))}
        </AnimatePresence>

        {filteredAndSorted.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center text-text-muted"
          >
            {t("noResults")}
          </motion.p>
        )}
      </div>
    </motion.section>
  );
}
