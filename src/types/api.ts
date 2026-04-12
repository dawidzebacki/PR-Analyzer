import type { z } from "zod/v4";

import type { analyzeRequestSchema } from "@/schemas";
import type { RepoAnalysis } from "@/types/scoring";

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

export type AnalyzeResponse =
  | { success: true; data: RepoAnalysis; id: string }
  | { success: false; error: string; code?: string };
