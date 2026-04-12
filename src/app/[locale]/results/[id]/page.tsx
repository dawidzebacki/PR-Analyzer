"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { useResults } from "@/hooks/useResults";
import { AnalysisLoading } from "@/components/dashboard/AnalysisLoading";

interface ResultsPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const { id } = use(params);
  const t = useTranslations("results");
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

  return (
    <div className="mx-auto max-w-[1110px] px-[18px] py-16">
      <h1 className="font-heading text-[2rem] font-bold leading-[2.375rem] tracking-[-0.0625rem] text-navy lg:text-[3rem] lg:leading-[3.375rem] lg:tracking-[-0.1125rem]">
        {t("heading", { id })}
      </h1>
      <pre className="mt-8 overflow-auto rounded-xl bg-surface p-6 text-sm ring-1 ring-border">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
