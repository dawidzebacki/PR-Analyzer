import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  parseRepoUrl,
  fetchMergedPRs,
  RepoNotFoundError,
  RepoPrivateError,
  RateLimitError,
  NoPullRequestsError,
  GitHubApiError,
} from "./github";

// --- parseRepoUrl ---

describe("parseRepoUrl", () => {
  it("parses full HTTPS URL", () => {
    expect(parseRepoUrl("https://github.com/owner/repo")).toEqual({
      owner: "owner",
      repo: "repo",
    });
  });

  it("parses URL with .git suffix", () => {
    expect(parseRepoUrl("https://github.com/owner/repo.git")).toEqual({
      owner: "owner",
      repo: "repo",
    });
  });

  it("parses URL with trailing slash", () => {
    expect(parseRepoUrl("https://github.com/owner/repo/")).toEqual({
      owner: "owner",
      repo: "repo",
    });
  });

  it("parses URL with trailing slash and .git", () => {
    expect(parseRepoUrl("https://github.com/owner/repo.git/")).toEqual({
      owner: "owner",
      repo: "repo",
    });
  });

  it("parses owner/repo shorthand", () => {
    expect(parseRepoUrl("owner/repo")).toEqual({
      owner: "owner",
      repo: "repo",
    });
  });

  it("handles leading/trailing whitespace", () => {
    expect(parseRepoUrl("  https://github.com/owner/repo  ")).toEqual({
      owner: "owner",
      repo: "repo",
    });
  });

  it("parses URL with www prefix", () => {
    expect(parseRepoUrl("https://www.github.com/owner/repo")).toEqual({
      owner: "owner",
      repo: "repo",
    });
  });

  it("throws on invalid URL", () => {
    expect(() => parseRepoUrl("not-a-url")).toThrow("Invalid GitHub repository URL");
  });

  it("throws on empty string", () => {
    expect(() => parseRepoUrl("")).toThrow("Invalid GitHub repository URL");
  });
});

// --- fetchMergedPRs ---

function mockPR(n: number, merged: boolean) {
  return {
    number: n,
    title: `PR #${n}`,
    body: `Description for PR #${n}`,
    state: "closed",
    merged_at: merged ? `2026-01-${String(n).padStart(2, "0")}T00:00:00Z` : null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    html_url: `https://github.com/owner/repo/pull/${n}`,
    diff_url: `https://github.com/owner/repo/pull/${n}.diff`,
    user: { login: "author", avatar_url: "https://avatar.url" },
    base: { repo: { full_name: "owner/repo" } },
    additions: 10,
    deletions: 5,
    changed_files: 2,
  };
}

function mockFile(filename: string) {
  return {
    sha: "abc123",
    filename,
    status: "modified",
    additions: 5,
    deletions: 2,
    changes: 7,
    patch: "@@ -1,3 +1,4 @@\n+added line",
  };
}

function mockFetchResponse(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    headers: new Headers(headers),
    json: () => Promise.resolve(body),
  } as Response;
}

describe("fetchMergedPRs", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns merged PRs with file diffs", async () => {
    const pulls = [mockPR(1, true), mockPR(2, false), mockPR(3, true)];
    const files = [mockFile("src/index.ts"), mockFile("src/utils.ts")];

    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = input instanceof Request ? input.url : String(input);
      if (url.includes("/pulls?")) return Promise.resolve(mockFetchResponse(pulls));
      if (url.includes("/files")) return Promise.resolve(mockFetchResponse(files));
      return Promise.resolve(mockFetchResponse({}, 404));
    });

    const result = await fetchMergedPRs("owner", "repo");

    expect(result).toHaveLength(2);
    expect(result[0].number).toBe(1);
    expect(result[0].title).toBe("PR #1");
    expect(result[0].author).toBe("author");
    expect(result[0].description).toBe("Description for PR #1");
    expect(result[0].mergedAt).toBe("2026-01-01T00:00:00Z");
    expect(result[0].filesChanged).toBe(2);
    expect(result[0].additions).toBe(10);
    expect(result[0].deletions).toBe(5);
    expect(result[0].files).toHaveLength(2);
    expect(result[0].files[0].filename).toBe("src/index.ts");
    expect(result[0].files[0].patch).toContain("+added line");
    expect(result[1].number).toBe(3);
  });

  it("limits to MAX_PRS_TO_ANALYZE (20)", async () => {
    const pulls = Array.from({ length: 30 }, (_, i) => mockPR(i + 1, true));
    const files = [mockFile("file.ts")];

    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = input instanceof Request ? input.url : String(input);
      if (url.includes("/pulls?")) return Promise.resolve(mockFetchResponse(pulls));
      if (url.includes("/files")) return Promise.resolve(mockFetchResponse(files));
      return Promise.resolve(mockFetchResponse({}, 404));
    });

    const result = await fetchMergedPRs("owner", "repo");
    expect(result).toHaveLength(20);
  });

  it("throws RepoNotFoundError on 404", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockFetchResponse({}, 404));

    await expect(fetchMergedPRs("owner", "repo")).rejects.toThrow(RepoNotFoundError);
  });

  it("throws RepoPrivateError on 403 without rate limit", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockFetchResponse({}, 403, { "x-ratelimit-remaining": "10" }),
    );

    await expect(fetchMergedPRs("owner", "repo")).rejects.toThrow(RepoPrivateError);
  });

  it("throws RateLimitError on 403 with x-ratelimit-remaining: 0", async () => {
    const resetTime = Math.floor(Date.now() / 1000) + 3600;
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockFetchResponse({}, 403, {
        "x-ratelimit-remaining": "0",
        "x-ratelimit-reset": String(resetTime),
      }),
    );

    await expect(fetchMergedPRs("owner", "repo")).rejects.toThrow(RateLimitError);
    try {
      await fetchMergedPRs("owner", "repo");
    } catch (e) {
      expect((e as RateLimitError).resetAt).toBeInstanceOf(Date);
    }
  });

  it("throws NoPullRequestsError when no merged PRs exist", async () => {
    const pulls = [mockPR(1, false), mockPR(2, false)];

    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockFetchResponse(pulls));

    await expect(fetchMergedPRs("owner", "repo")).rejects.toThrow(NoPullRequestsError);
  });

  it("throws GitHubApiError on other HTTP errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockFetchResponse({}, 500));

    await expect(fetchMergedPRs("owner", "repo")).rejects.toThrow(GitHubApiError);
  });

  it("passes Authorization header when token provided", async () => {
    const pulls = [mockPR(1, true)];
    const files = [mockFile("file.ts")];
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = input instanceof Request ? input.url : String(input);
      if (url.includes("/pulls?")) return Promise.resolve(mockFetchResponse(pulls));
      if (url.includes("/files")) return Promise.resolve(mockFetchResponse(files));
      return Promise.resolve(mockFetchResponse({}, 404));
    });

    await fetchMergedPRs("owner", "repo", "ghp_test123");

    const firstCall = fetchSpy.mock.calls[0];
    const headers = (firstCall[1] as RequestInit | undefined)?.headers as Record<string, string>;
    expect(headers?.Authorization).toBe("Bearer ghp_test123");
  });
});
