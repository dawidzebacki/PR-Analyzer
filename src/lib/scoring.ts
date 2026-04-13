import Groq from "groq-sdk";
import { z } from "zod/v4";

import { SCORING_WEIGHTS, ANALYSIS_TIMEOUT_MS } from "@/constants";
import type { ParsedPR } from "@/types/github";
import type {
  PRAnalysis,
  RepoAnalysis,
  AuthorStats,
  LLMScoringResponse,
} from "@/types/scoring";
import { SCORING_SYSTEM_PROMPT, buildUserPrompt } from "./prompts";

// --- Groq client ---

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
const MODEL = "llama-3.3-70b-versatile";

// --- Validation ---

const llmResponseSchema = z.object({
  prs: z.array(
    z.object({
      number: z.number().int(),
      impact: z.number().min(0).max(100),
      aiLeverage: z.number().min(0).max(100),
      quality: z.number().min(0).max(100),
      summary: z.string(),
    }),
  ),
});

// --- Score calculation ---

function calculateTotal(impact: number, aiLeverage: number, quality: number): number {
  const raw =
    impact * SCORING_WEIGHTS.impact +
    aiLeverage * SCORING_WEIGHTS.aiLeverage +
    quality * SCORING_WEIGHTS.quality;
  return Math.round(raw);
}

// --- LLM call ---

async function callLLM(prs: ParsedPR[]): Promise<LLMScoringResponse[]> {
  const userPrompt = buildUserPrompt(prs);

  const completion = await groq.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SCORING_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  const text = completion.choices[0]?.message?.content ?? "";
  return parseLLMResponse(text);
}

function parseLLMResponse(text: string): LLMScoringResponse[] {
  const parsed: unknown = JSON.parse(text);
  return llmResponseSchema.parse(parsed).prs;
}

// --- Author stats ---

function calculateAuthorStats(analyses: PRAnalysis[]): AuthorStats[] {
  const byAuthor = new Map<string, PRAnalysis[]>();

  for (const pr of analyses) {
    const existing = byAuthor.get(pr.author) ?? [];
    existing.push(pr);
    byAuthor.set(pr.author, existing);
  }

  return Array.from(byAuthor.entries()).map(([author, prs]) => {
    const avgImpact = Math.round(prs.reduce((s, p) => s + p.scores.impact, 0) / prs.length);
    const avgAiLeverage = Math.round(prs.reduce((s, p) => s + p.scores.aiLeverage, 0) / prs.length);
    const avgQuality = Math.round(prs.reduce((s, p) => s + p.scores.quality, 0) / prs.length);
    const avgTotal = calculateTotal(avgImpact, avgAiLeverage, avgQuality);

    return {
      author,
      prCount: prs.length,
      avgScores: {
        impact: avgImpact,
        aiLeverage: avgAiLeverage,
        quality: avgQuality,
        total: avgTotal,
      },
      prs: prs.map((p) => p.number),
    };
  });
}

// --- Recommendations ---

function generateRecommendations(analyses: PRAnalysis[]): string[] {
  const recommendations: string[] = [];
  const avgScores = {
    impact: Math.round(analyses.reduce((s, p) => s + p.scores.impact, 0) / analyses.length),
    aiLeverage: Math.round(analyses.reduce((s, p) => s + p.scores.aiLeverage, 0) / analyses.length),
    quality: Math.round(analyses.reduce((s, p) => s + p.scores.quality, 0) / analyses.length),
  };

  if (avgScores.quality < 50) {
    recommendations.push(
      "Code quality scores are low. Consider enforcing PR templates, requiring tests, and using linters.",
    );
  } else if (avgScores.quality < 70) {
    recommendations.push(
      "Code quality is decent but has room for improvement. Focus on test coverage and PR descriptions.",
    );
  }

  if (avgScores.impact < 40) {
    recommendations.push(
      "Many PRs have low impact. Consider batching trivial changes and prioritizing meaningful features.",
    );
  }

  if (avgScores.aiLeverage < 30) {
    recommendations.push(
      "Low AI tool adoption detected. Consider introducing AI coding assistants to boost productivity.",
    );
  } else if (avgScores.aiLeverage >= 70) {
    recommendations.push(
      "Strong AI tool usage detected. Ensure human review remains thorough to maintain code quality.",
    );
  }

  const largePRs = analyses.filter((p) => p.filesChanged > 20);
  if (largePRs.length > analyses.length * 0.3) {
    recommendations.push(
      "Over 30% of PRs touch 20+ files. Break down large PRs into smaller, focused changesets.",
    );
  }

  const noDesc = analyses.filter((p) => !p.description || p.description.length < 20);
  if (noDesc.length > analyses.length * 0.3) {
    recommendations.push(
      "Many PRs lack meaningful descriptions. Adopt PR templates to improve documentation.",
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Great work! PR quality, impact, and AI usage are all at healthy levels.",
    );
  }

  return recommendations;
}

// --- Main entry ---

export async function scorePullRequests(
  prs: ParsedPR[],
  repoUrl: string,
  repoName: string,
): Promise<RepoAnalysis> {
  let llmScores: LLMScoringResponse[];

  try {
    llmScores = await Promise.race([
      callLLM(prs),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Analysis timed out")), ANALYSIS_TIMEOUT_MS),
      ),
    ]);
  } catch (error) {
    // Retry once on JSON parse errors
    if (error instanceof SyntaxError || error instanceof z.ZodError) {
      llmScores = await callLLM(prs);
    } else {
      throw error;
    }
  }

  // Map LLM scores to PR analyses
  const analyses: PRAnalysis[] = prs.map((pr) => {
    const score = llmScores.find((s) => s.number === pr.number);
    const impact = score?.impact ?? 50;
    const aiLeverage = score?.aiLeverage ?? 50;
    const quality = score?.quality ?? 50;

    return {
      number: pr.number,
      title: pr.title,
      author: pr.author,
      description: pr.description,
      state: pr.state,
      mergedAt: pr.mergedAt,
      filesChanged: pr.filesChanged,
      additions: pr.additions,
      deletions: pr.deletions,
      scores: {
        impact,
        aiLeverage,
        quality,
        total: calculateTotal(impact, aiLeverage, quality),
      },
      summary: score?.summary ?? "No analysis available.",
    };
  });

  // Aggregate scores
  const avgImpact = Math.round(analyses.reduce((s, p) => s + p.scores.impact, 0) / analyses.length);
  const avgAiLeverage = Math.round(analyses.reduce((s, p) => s + p.scores.aiLeverage, 0) / analyses.length);
  const avgQuality = Math.round(analyses.reduce((s, p) => s + p.scores.quality, 0) / analyses.length);

  return {
    repoUrl,
    repoName,
    analyzedAt: new Date().toISOString(),
    totalScore: calculateTotal(avgImpact, avgAiLeverage, avgQuality),
    scores: {
      impact: avgImpact,
      aiLeverage: avgAiLeverage,
      quality: avgQuality,
      total: calculateTotal(avgImpact, avgAiLeverage, avgQuality),
    },
    prs: analyses,
    recommendations: generateRecommendations(analyses),
    authorStats: calculateAuthorStats(analyses),
  };
}
