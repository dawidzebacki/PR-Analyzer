"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import type { AnalyzeResponse } from "@/types/api";
import type { PRScope, PRTypePrefix } from "@/constants";

export class AnalyzeError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "AnalyzeError";
    this.code = code;
  }
}

export interface AnalyzeParams {
  repoUrl: string;
  scope?: PRScope;
  typeFilter?: PRTypePrefix[];
}

async function analyzeRepo(params: AnalyzeParams): Promise<{ id: string }> {
  let res: Response;
  try {
    res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  } catch {
    throw new AnalyzeError("Network error", "NETWORK_ERROR");
  }

  const json: AnalyzeResponse = await res.json();

  if (!json.success) {
    throw new AnalyzeError(json.error, json.code ?? "INTERNAL_ERROR");
  }

  return { id: json.id };
}

export function useAnalyze() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (params: AnalyzeParams) => analyzeRepo(params),
    onSuccess: ({ id }) => {
      router.push(`/results/${id}`);
    },
  });

  const error =
    mutation.error instanceof AnalyzeError ? mutation.error : null;

  return {
    analyze: mutation.mutate,
    isLoading: mutation.isPending,
    error,
    isError: mutation.isError,
  };
}
