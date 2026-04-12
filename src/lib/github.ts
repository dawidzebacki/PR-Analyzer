import { GITHUB_API_BASE, MAX_PRS_TO_ANALYZE } from "@/constants";
import type {
  GitHubPullRequest,
  GitHubPRFile,
  ParsedPR,
} from "@/types/github";

// --- Error classes ---

export class GitHubApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

export class RepoNotFoundError extends GitHubApiError {
  constructor(owner: string, repo: string) {
    super(`Repository "${owner}/${repo}" not found`, 404);
    this.name = "RepoNotFoundError";
  }
}

export class RepoPrivateError extends GitHubApiError {
  constructor(owner: string, repo: string) {
    super(
      `Repository "${owner}/${repo}" is private or access is denied`,
      403,
    );
    this.name = "RepoPrivateError";
  }
}

export class RateLimitError extends GitHubApiError {
  constructor(public resetAt: Date) {
    super(
      `GitHub API rate limit exceeded. Resets at ${resetAt.toISOString()}`,
      429,
    );
    this.name = "RateLimitError";
  }
}

export class NoPullRequestsError extends Error {
  constructor(owner: string, repo: string) {
    super(`No merged pull requests found in "${owner}/${repo}"`);
    this.name = "NoPullRequestsError";
  }
}

// --- URL parsing ---

export function parseRepoUrl(url: string): { owner: string; repo: string } {
  const cleaned = url.trim().replace(/\/+$/, "").replace(/\.git$/, "");

  const patterns = [
    /github\.com\/([^/]+)\/([^/]+)/,
    /^([^/]+)\/([^/]+)$/,
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  }

  throw new Error(`Invalid GitHub repository URL: "${url}"`);
}

// --- API helpers ---

function buildHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function githubFetch<T>(
  path: string,
  owner: string,
  repo: string,
  token?: string,
): Promise<T> {
  const res = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: buildHeaders(token),
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new RepoNotFoundError(owner, repo);
    }

    if (res.status === 403) {
      const rateLimitRemaining = res.headers.get("x-ratelimit-remaining");
      if (rateLimitRemaining === "0") {
        const resetTimestamp = res.headers.get("x-ratelimit-reset");
        const resetAt = resetTimestamp
          ? new Date(Number(resetTimestamp) * 1000)
          : new Date();
        throw new RateLimitError(resetAt);
      }
      throw new RepoPrivateError(owner, repo);
    }

    throw new GitHubApiError(
      `GitHub API error: ${res.status} ${res.statusText}`,
      res.status,
    );
  }

  return res.json() as Promise<T>;
}

// --- Main fetch ---

export async function fetchMergedPRs(
  owner: string,
  repo: string,
  token?: string,
): Promise<ParsedPR[]> {
  const pulls = await githubFetch<GitHubPullRequest[]>(
    `/repos/${owner}/${repo}/pulls?state=closed&sort=updated&direction=desc&per_page=30`,
    owner,
    repo,
    token,
  );

  const merged = pulls
    .filter((pr) => pr.merged_at !== null)
    .slice(0, MAX_PRS_TO_ANALYZE);

  if (merged.length === 0) {
    throw new NoPullRequestsError(owner, repo);
  }

  const parsedPRs = await Promise.all(
    merged.map(async (pr) => {
      const files = await githubFetch<GitHubPRFile[]>(
        `/repos/${owner}/${repo}/pulls/${pr.number}/files`,
        owner,
        repo,
        token,
      );

      const parsed: ParsedPR = {
        number: pr.number,
        title: pr.title,
        author: pr.user.login,
        description: pr.body ?? "",
        mergedAt: pr.merged_at!,
        filesChanged: pr.changed_files,
        additions: pr.additions,
        deletions: pr.deletions,
        files: files.map((f) => ({
          filename: f.filename,
          patch: f.patch ?? "",
        })),
      };

      return parsed;
    }),
  );

  return parsedPRs;
}
