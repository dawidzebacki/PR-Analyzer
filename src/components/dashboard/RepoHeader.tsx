"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ExternalLink, GitPullRequest, Calendar } from "lucide-react";

interface RepoHeaderProps {
  repoName: string;
  repoUrl: string;
  analyzedAt: string;
  prCount: number;
}

export function RepoHeader({
  repoName,
  repoUrl,
  analyzedAt,
  prCount,
}: RepoHeaderProps) {
  const t = useTranslations("dashboard");

  const formattedDate = new Date(analyzedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="font-heading text-[2rem] font-bold leading-[2.375rem] tracking-[-0.0625rem] text-navy lg:text-[3rem] lg:leading-[3.375rem] lg:tracking-[-0.1125rem]">
        {repoName}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-muted">
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-accent-blue transition-colors hover:text-primary"
        >
          <ExternalLink className="h-4 w-4" />
          {t("viewOnGithub")}
        </a>

        <span className="h-4 w-px bg-border" />

        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {t("analyzedAt", { date: formattedDate })}
        </span>

        <span className="h-4 w-px bg-border" />

        <span className="inline-flex items-center gap-1.5">
          <GitPullRequest className="h-4 w-4" />
          {t("prCount", { count: prCount })}
        </span>
      </div>
    </motion.div>
  );
}
