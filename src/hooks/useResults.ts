"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/api";
import type { RepoAnalysis } from "@/types/scoring";

async function fetchResults(id: string): Promise<RepoAnalysis> {
  const res = await fetch(`/api/results/${encodeURIComponent(id)}`);
  const json: ApiResponse<RepoAnalysis> = await res.json();

  if (!json.success) {
    throw new Error(json.error);
  }

  return json.data;
}

interface UseResultsOptions {
  id: string | null;
}

export function useResults({ id }: UseResultsOptions) {
  return useQuery({
    queryKey: ["results", id],
    queryFn: () => fetchResults(id!),
    enabled: !!id,
  });
}
