"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useResults, ResultsError } from "@/hooks/useResults";
import { AnalysisLoading } from "@/components/dashboard/AnalysisLoading";
import { RepoHeader } from "@/components/dashboard/RepoHeader";
import { TotalScore } from "@/components/dashboard/TotalScore";
import { ScoreBreakdown } from "@/components/dashboard/ScoreBreakdown";
import { PRList } from "@/components/dashboard/PRList";
import { AuthorStats } from "@/components/dashboard/AuthorStats";
import { Recommendations } from "@/components/dashboard/Recommendations";
import { ShareBar } from "@/components/dashboard/ShareBar";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

interface ResultsPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const sharedRepoUrl = searchParams.get("repo");
  const { data, isLoading, error } = useResults({ id });
  const tErrors = useTranslations("errors");
  const tDashboard = useTranslations("dashboard");

  if (isLoading) {
    return <AnalysisLoading />;
  }

  if (error) {
    const isExpired =
      error instanceof ResultsError && error.code === "NOT_FOUND";

    if (isExpired) {
      return (
        <Container className="py-12 lg:py-16">
          <div className="mx-auto flex max-w-lg flex-col items-center gap-6 rounded-xl border border-border bg-surface p-8 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-bg text-error">
              <AlertCircle className="h-6 w-6" aria-hidden />
            </div>
            <div className="space-y-2">
              <h1 className="font-heading text-[1.5rem] font-bold leading-[1.875rem] tracking-[-0.0625rem] text-navy">
                {tErrors("EXPIRED_TITLE")}
              </h1>
              <p className="text-base text-text-muted">
                {tErrors("EXPIRED_DESCRIPTION")}
              </p>
            </div>
            <Link
              href={sharedRepoUrl ? `/?repo=${encodeURIComponent(sharedRepoUrl)}` : "/"}
            >
              <Button variant="primary" size="md">
                {tDashboard("reanalyze")}
              </Button>
            </Link>
          </div>
        </Container>
      );
    }

    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-error">{error.message}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      <ShareBar analysis={data} />
      <Container className="py-12 lg:py-16">
        <div className="space-y-10">
          <RepoHeader
            repoName={data.repoName}
            repoUrl={data.repoUrl}
            analyzedAt={data.analyzedAt}
            prCount={data.prs.length}
          />

          <TotalScore score={data.totalScore} />

          <ScoreBreakdown scores={data.scores} />

          <PRList prs={data.prs} repoUrl={data.repoUrl} />

          <AuthorStats
            authorStats={data.authorStats}
            prs={data.prs}
            repoAvg={data.scores}
          />

          <Recommendations recommendations={data.recommendations} />
        </div>
      </Container>
    </>
  );
}
