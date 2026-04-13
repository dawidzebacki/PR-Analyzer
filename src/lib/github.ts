import {
  GITHUB_API_BASE,
  MAX_PRS_TO_ANALYZE,
  type PRScope,
  type PRTypePrefix,
} from "@/constants";
import type {
  GitHubPullRequest,
  GitHubPRFile,
  ParsedPR,
} from "@/types/github";

export { parseGitHubUrl, isPRUrl } from "./url";
export type { ParsedGitHubUrl } from "./url";

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

export class PRNotFoundError extends GitHubApiError {
  constructor(owner: string, repo: string, number: number) {
    super(`Pull request "${owner}/${repo}#${number}" not found`, 404);
    this.name = "PRNotFoundError";
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
    super(`No matching pull requests found in "${owner}/${repo}"`);
    this.name = "NoPullRequestsError";
  }
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
  options: { owner: string; repo: string; prNumber?: number; token?: string },
): Promise<T> {
  const { owner, repo, prNumber, token } = options;
  const res = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: buildHeaders(token),
  });

  if (!res.ok) {
    if (res.status === 404) {
      if (prNumber !== undefined) {
        throw new PRNotFoundError(owner, repo, prNumber);
      }
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

// --- Filtering ---

function matchesScope(pr: GitHubPullRequest, scope: PRScope): boolean {
  switch (scope) {
    case "all":
      return true;
    case "merged":
      return pr.merged_at !== null;
    case "open":
      return pr.state === "open";
    case "closed":
      // closed includes merged — but "merged" scope is separate, so closed = closed-not-merged
      return pr.state === "closed" && pr.merged_at === null;
  }
}

function matchesType(title: string, typeFilter?: PRTypePrefix[]): boolean {
  if (!typeFilter || typeFilter.length === 0) return true;
  const match = title.toLowerCase().match(/^([a-z]+)(\([^)]+\))?:/);
  if (!match) return false;
  return (typeFilter as string[]).includes(match[1]);
}

function mapGitHubState(state: string): "open" | "closed" {
  return state === "open" ? "open" : "closed";
}

// --- Main fetch (list) ---

export interface FetchPRsOptions {
  scope: PRScope;
  typeFilter?: PRTypePrefix[];
}

export async function fetchPRs(
  owner: string,
  repo: string,
  options: FetchPRsOptions,
  token?: string,
): Promise<ParsedPR[]> {
  // Map our scope to the GitHub API state param (open/closed/all)
  const apiState =
    options.scope === "open"
      ? "open"
      : options.scope === "merged" || options.scope === "closed"
      ? "closed"
      : "all";

  const pulls = await githubFetch<GitHubPullRequest[]>(
    `/repos/${owner}/${repo}/pulls?state=${apiState}&sort=updated&direction=desc&per_page=30`,
    { owner, repo, token },
  );

  const filtered = pulls
    .filter((pr) => matchesScope(pr, options.scope))
    .filter((pr) => matchesType(pr.title, options.typeFilter))
    .slice(0, MAX_PRS_TO_ANALYZE);

  if (filtered.length === 0) {
    throw new NoPullRequestsError(owner, repo);
  }

  return Promise.all(filtered.map((pr) => parsePR(owner, repo, pr, token)));
}

// --- Single PR fetch ---

export async function fetchSinglePR(
  owner: string,
  repo: string,
  prNumber: number,
  token?: string,
): Promise<ParsedPR[]> {
  const pr = await githubFetch<GitHubPullRequest>(
    `/repos/${owner}/${repo}/pulls/${prNumber}`,
    { owner, repo, prNumber, token },
  );

  return [await parsePR(owner, repo, pr, token)];
}

// --- Parse a single PR with its files ---

async function parsePR(
  owner: string,
  repo: string,
  pr: GitHubPullRequest,
  token?: string,
): Promise<ParsedPR> {
  const files = await githubFetch<GitHubPRFile[]>(
    `/repos/${owner}/${repo}/pulls/${pr.number}/files`,
    { owner, repo, prNumber: pr.number, token },
  );

  return {
    number: pr.number,
    title: pr.title,
    author: pr.user.login,
    description: pr.body ?? "",
    mergedAt: pr.merged_at,
    state: mapGitHubState(pr.state),
    filesChanged: pr.changed_files,
    additions: pr.additions,
    deletions: pr.deletions,
    files: files.map((f) => ({
      filename: f.filename,
      patch: f.patch ?? "",
    })),
  };
}
