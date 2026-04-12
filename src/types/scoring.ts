import type { z } from "zod/v4";

import type {
  prScoreSchema,
  prAnalysisSchema,
  repoAnalysisSchema,
  authorStatSchema,
} from "@/schemas";

export type PRScore = z.infer<typeof prScoreSchema>;

export type PRAnalysis = z.infer<typeof prAnalysisSchema>;

export type RepoAnalysis = z.infer<typeof repoAnalysisSchema>;

export type AuthorStats = z.infer<typeof authorStatSchema>;

export interface LLMScoringResponse {
  impact: number;
  aiLeverage: number;
  quality: number;
  summary: string;
}
