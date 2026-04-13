"use client";

import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GitMerge, GitPullRequest, GitPullRequestClosed } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { getScoreClasses } from "@/constants";
import type { AuthorStats, PRAnalysis, PRScore } from "@/types/scoring";

interface AuthorCardProps {
  stats: AuthorStats;
  prs: PRAnalysis[];
  repoAvg: PRScore;
}

const AVATAR_PALETTE = [
  "bg-primary text-white",
  "bg-accent-green text-white",
  "bg-accent-blue text-white",
  "bg-error text-white",
  "bg-navy text-white",
] as const;

function pickAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

interface PRStateCounts {
  merged: number;
  open: number;
  closed: number;
}

function countStates(prs: PRAnalysis[]): PRStateCounts {
  const counts: PRStateCounts = { merged: 0, open: 0, closed: 0 };
  for (const pr of prs) {
    if (pr.state === "open") {
      counts.open += 1;
    } else if (pr.mergedAt) {
      counts.merged += 1;
    } else {
      counts.closed += 1;
    }
  }
  return counts;
}

export function AuthorCard({ stats, prs, repoAvg }: AuthorCardProps) {
  const t = useTranslations("dashboard");
  const authorPrs = prs.filter((pr) => pr.author === stats.author);
  const initial = stats.author.charAt(0).toUpperCase();
  const avatarClass = pickAvatarColor(stats.author);
  const stateCounts = countStates(authorPrs);
  const { text: totalTextClass } = getScoreClasses(stats.avgScores.total);

  const chartData = [
    {
      dimension: t("impact"),
      author: stats.avgScores.impact,
      repo: repoAvg.impact,
    },
    {
      dimension: t("aiLeverage"),
      author: stats.avgScores.aiLeverage,
      repo: repoAvg.aiLeverage,
    },
    {
      dimension: t("quality"),
      author: stats.avgScores.quality,
      repo: repoAvg.quality,
    },
  ];

  return (
    <Card hover className="flex flex-col gap-5">
      {/* Header: avatar + name + total avg */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full font-heading text-lg font-bold ${avatarClass}`}
            aria-hidden="true"
          >
            {initial}
          </div>
          <div className="min-w-0">
            <p className="truncate font-heading text-lg font-bold text-navy">
              {stats.author}
            </p>
            <p className="text-sm text-text-muted">
              {t("prsCount", { count: stats.prCount })}
            </p>
          </div>
        </div>

        <div className="flex flex-shrink-0 flex-col items-end gap-1">
          <span className="text-xs font-medium text-text-muted">
            {t("avgScore")}
          </span>
          <AnimatedNumber
            value={stats.avgScores.total}
            className={`font-heading text-2xl font-bold ${totalTextClass}`}
          />
        </div>
      </div>

      {/* State counts */}
      <div className="flex flex-wrap items-center gap-2">
        {stateCounts.merged > 0 && (
          <Badge variant="success" size="sm">
            <span className="flex items-center gap-1">
              <GitMerge className="h-3 w-3" />
              {t("merged", { count: stateCounts.merged })}
            </span>
          </Badge>
        )}
        {stateCounts.open > 0 && (
          <Badge variant="warning" size="sm">
            <span className="flex items-center gap-1">
              <GitPullRequest className="h-3 w-3" />
              {t("open", { count: stateCounts.open })}
            </span>
          </Badge>
        )}
        {stateCounts.closed > 0 && (
          <Badge variant="error" size="sm">
            <span className="flex items-center gap-1">
              <GitPullRequestClosed className="h-3 w-3" />
              {t("closed", { count: stateCounts.closed })}
            </span>
          </Badge>
        )}
      </div>

      {/* Scores: chart for 2+ PRs, score rings for 1 PR */}
      {stats.prCount > 1 ? (
        <div className="-ml-2">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              barCategoryGap="20%"
            >
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="dimension"
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "var(--color-border)" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={28}
              />
              <Tooltip
                cursor={{ fill: "var(--color-border)", opacity: 0.4 }}
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "4px" }}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                dataKey="author"
                name={t("authorAverage")}
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
                isAnimationActive
                animationBegin={200}
                animationDuration={800}
                animationEasing="ease-out"
              />
              <Bar
                dataKey="repo"
                name={t("repoAverage")}
                fill="var(--color-text-muted)"
                fillOpacity={0.5}
                radius={[4, 4, 0, 0]}
                isAnimationActive
                animationBegin={350}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-around gap-3 pt-1">
          <ScoreRing
            score={stats.avgScores.impact}
            size="sm"
            label={t("impact")}
            animated
          />
          <ScoreRing
            score={stats.avgScores.aiLeverage}
            size="sm"
            label={t("aiLeverage")}
            animated
          />
          <ScoreRing
            score={stats.avgScores.quality}
            size="sm"
            label={t("quality")}
            animated
          />
        </div>
      )}
    </Card>
  );
}
