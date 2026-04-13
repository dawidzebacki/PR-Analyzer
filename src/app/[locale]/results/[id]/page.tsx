"use client";

import { use } from "react";
import { useResults } from "@/hooks/useResults";
import { AnalysisLoading } from "@/components/dashboard/AnalysisLoading";
import { RepoHeader } from "@/components/dashboard/RepoHeader";
import { TotalScore } from "@/components/dashboard/TotalScore";
import { ScoreBreakdown } from "@/components/dashboard/ScoreBreakdown";
import { PRList } from "@/components/dashboard/PRList";
import { AuthorStats } from "@/components/dashboard/AuthorStats";
import { Container } from "@/components/ui/Container";

interface ResultsPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const { id } = use(params);
  const { data, isLoading, error } = useResults({ id });

  if (isLoading) {
    return <AnalysisLoading />;
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-error">{error.message}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
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
      </div>
    </Container>
  );
}
