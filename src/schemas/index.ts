import { z } from "zod/v4";

// --- Primitives ---

export const repoUrlSchema = z
  .url({ error: "Please enter a valid URL" })
  .regex(
    /github\.com\/[\w.-]+\/[\w.-]+/,
    "URL must be a valid GitHub repository (e.g. github.com/owner/repo)",
  );

export const scoreSchema = z.number().min(0).max(100);

// --- Composite Scores ---

export const prScoreSchema = z.object({
  impact: scoreSchema,
  aiLeverage: scoreSchema,
  quality: scoreSchema,
  total: scoreSchema,
});

// --- Author Stats ---

export const authorStatSchema = z.object({
  author: z.string(),
  prCount: z.number().int().min(0),
  avgScores: prScoreSchema,
  prs: z.array(z.number().int()),
});

// --- PR Analysis ---

export const prAnalysisSchema = z.object({
  number: z.number().int(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
  filesChanged: z.number().int().min(0),
  additions: z.number().int().min(0),
  deletions: z.number().int().min(0),
  scores: prScoreSchema,
  summary: z.string(),
});

// --- Repo Analysis ---

export const repoAnalysisSchema = z.object({
  repoUrl: z.url(),
  repoName: z.string(),
  analyzedAt: z.iso.datetime(),
  totalScore: scoreSchema,
  scores: prScoreSchema,
  prs: z.array(prAnalysisSchema),
  recommendations: z.array(z.string()),
  authorStats: z.array(authorStatSchema),
});

// --- Request ---

export const analyzeRequestSchema = z.object({
  repoUrl: repoUrlSchema,
});
