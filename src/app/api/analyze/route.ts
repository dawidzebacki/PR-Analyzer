import { NextResponse } from "next/server";
import Groq from "groq-sdk";

import { analyzeRequestSchema } from "@/schemas";
import * as cache from "@/lib/cache";
import {
  parseGitHubUrl,
  fetchPRs,
  fetchSinglePR,
  GitHubApiError,
  NoPullRequestsError,
  PRNotFoundError,
  RateLimitError,
  RepoNotFoundError,
  RepoPrivateError,
} from "@/lib/github";
import { scorePullRequests } from "@/lib/scoring";
import type { ApiResponse, AnalyzeResponse } from "@/types/api";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = analyzeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Invalid repository URL", code: "INVALID_URL" },
        { status: 400 },
      );
    }

    const { repoUrl, scope, typeFilter } = parsed.data;
    const { owner, repo, prNumber } = parseGitHubUrl(repoUrl);

    // Build a cache variant so repo+scope+filter and PR URL all get distinct keys
    const variant =
      prNumber !== undefined
        ? `pr=${prNumber}`
        : `scope=${scope}&types=${(typeFilter ?? []).join(",")}`;

    const cacheKey = cache.generateKey(repoUrl, variant);
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json<AnalyzeResponse>({
        success: true,
        data: cached,
        id: cacheKey,
      });
    }

    const token = process.env.GITHUB_TOKEN;

    // Fetch PRs (single or list) and score them
    const prs =
      prNumber !== undefined
        ? await fetchSinglePR(owner, repo, prNumber, token)
        : await fetchPRs(owner, repo, { scope, typeFilter }, token);

    const repoName = `${owner}/${repo}`;

    const result = await Promise.race([
      scorePullRequests(prs, repoUrl, repoName),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("TIMEOUT")), 55_000),
      ),
    ]);

    cache.set(cacheKey, result);

    return NextResponse.json<AnalyzeResponse>({
      success: true,
      data: result,
      id: cacheKey,
    });
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown): NextResponse<ApiResponse<never>> {
  if (error instanceof RepoNotFoundError) {
    return NextResponse.json(
      { success: false, error: error.message, code: "REPO_NOT_FOUND" },
      { status: 404 },
    );
  }

  if (error instanceof PRNotFoundError) {
    return NextResponse.json(
      { success: false, error: error.message, code: "PR_NOT_FOUND" },
      { status: 404 },
    );
  }

  if (error instanceof RepoPrivateError) {
    return NextResponse.json(
      { success: false, error: error.message, code: "ACCESS_DENIED" },
      { status: 403 },
    );
  }

  if (error instanceof RateLimitError) {
    return NextResponse.json(
      { success: false, error: error.message, code: "GITHUB_RATE_LIMIT" },
      { status: 403 },
    );
  }

  if (error instanceof NoPullRequestsError) {
    return NextResponse.json(
      { success: false, error: error.message, code: "NO_MERGED_PRS" },
      { status: 422 },
    );
  }

  if (error instanceof GitHubApiError) {
    return NextResponse.json(
      { success: false, error: error.message, code: "GITHUB_API_ERROR" },
      { status: error.status },
    );
  }

  if (error instanceof Error && error.message === "TIMEOUT") {
    return NextResponse.json(
      { success: false, error: "Analysis timed out. Please try again.", code: "TIMEOUT" },
      { status: 504 },
    );
  }

  // Groq API errors (e.g. rate limit, auth)
  if (error instanceof Groq.APIError) {
    console.error("[analyze] Groq error:", error.status, error.message);
    if (error.status === 429) {
      return NextResponse.json(
        { success: false, error: "AI rate limit reached. Please try again in a minute.", code: "AI_RATE_LIMIT" },
        { status: 429 },
      );
    }
    if (error.status === 413) {
      return NextResponse.json(
        { success: false, error: "Request too large for AI model. Narrow your filters.", code: "AI_TOO_LARGE" },
        { status: 413 },
      );
    }
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json(
        { success: false, error: "AI service authentication failed.", code: "AI_AUTH_ERROR" },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { success: false, error: "AI service error. Please try again.", code: "AI_ERROR" },
      { status: 502 },
    );
  }

  console.error("[analyze] Unhandled error:", error);
  return NextResponse.json(
    { success: false, error: "An unexpected error occurred", code: "INTERNAL_ERROR" },
    { status: 500 },
  );
}
