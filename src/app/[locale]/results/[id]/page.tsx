"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import { useResults, ResultsError } from "@/hooks/useResults";
import { AnalysisLoading } from "@/components/dashboard/AnalysisLoading";
import { RepoHeader } from "@/components/dashboard/RepoHeader";
import { TotalScore } from "@/components/dashboard/TotalScore";
import { ScoreBreakdown } from "@/components/dashboard/ScoreBreakdown";
import { PRList } from "@/components/dashboard/PRList";
import { AuthorStats } from "@/components/dashboard/AuthorStats";
import { Recommendations } from "@/components/dashboard/Recommendations";
import { ShareBar } from "@/components/dashboard/ShareBar";
import { ErrorState, type ErrorVariant } from "@/components/shared/ErrorState";
import { Container } from "@/components/ui/Container";

interface ResultsPageProps {
  params: Promise<{ locale: string; id: string }>;
}

function mapErrorCodeToVariant(code: string): ErrorVariant {
  switch (code) {
    case "INVALID_URL":
      return "INVALID_URL";
    case "REPO_NOT_FOUND":
      return "REPO_NOT_FOUND";
    case "PR_NOT_FOUND":
      return "PR_NOT_FOUND";
    case "ACCESS_DENIED":
      return "REPO_PRIVATE";
    case "GITHUB_RATE_LIMIT":
      return "GITHUB_RATE_LIMIT";
    case "NO_MERGED_PRS":
      return "NO_PRS";
    case "AI_RATE_LIMIT":
      return "AI_RATE_LIMIT";
    case "AI_TOO_LARGE":
      return "AI_TOO_LARGE";
    case "AI_AUTH_ERROR":
      return "AI_AUTH_ERROR";
    case "NOT_FOUND":
      return "EXPIRED";
    default:
      return "ANALYSIS_FAILED";
  }
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const sharedRepoUrl = searchParams.get("repo");
  const { data, isLoading, error } = useResults({ id });

  if (isLoading) {
    return <AnalysisLoading />;
  }

  if (error) {
    const code = error instanceof ResultsError ? error.code : "INTERNAL_ERROR";
    const variant = mapErrorCodeToVariant(code);
    const homeHref = sharedRepoUrl
      ? `/?repo=${encodeURIComponent(sharedRepoUrl)}`
      : "/";

    return <ErrorState variant={variant} actionHref={homeHref} />;
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
