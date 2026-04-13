import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  parseGitHubUrl,
  isPRUrl,
  fetchPRs,
  fetchSinglePR,
  RepoNotFoundError,
  PRNotFoundError,
  RepoPrivateError,
  RateLimitError,
  NoPullRequestsError,
  GitHubApiError,
} from "./github";
import { MAX_PRS_TO_ANALYZE } from "@/constants";

// --- parseGitHubUrl ---

describe("parseGitHubUrl", () => {
  it("parses full HTTPS URL", () => {
    expect(parseGitHubUrl("https://github.com/owner/repo")).toEqual({
      owner: "owner",
      repo: "repo",
    });
  });

  it("parses URL with .git suffix", () => {
    expect(parseGitHubUrl("https://github.com/owner/repo.git")).toEqual({
      owner: "owner",
      repo: "repo",
    });
  });

  it("parses URL with trailing slash", () => {
    expect(parseGitHubUrl("https://github.com/owner/repo/")).toEqual({
      owner: "owner",
      repo: "repo",
    });
  });

  it("parses owner/repo shorthand", () => {
    expect(parseGitHubUrl("owner/repo")).toEqual({
      owner: "owner",
      repo: "repo",
    });
  });

  it("handles leading/trailing whitespace", () => {
    expect(parseGitHubUrl("  https://github.com/owner/repo  ")).toEqual({
      owner: "owner",
      repo: "repo",
    });
  });

  it("parses URL with www prefix", () => {
    expect(parseGitHubUrl("https://www.github.com/owner/repo")).toEqual({
      owner: "owner",
      repo: "repo",
    });
  });

  it("extracts PR number from pull URL", () => {
    expect(parseGitHubUrl("https://github.com/owner/repo/pull/42")).toEqual({
      owner: "owner",
      repo: "repo",
      prNumber: 42,
    });
  });

  it("extracts PR number with trailing slash or suffix", () => {
    expect(parseGitHubUrl("https://github.com/owner/repo/pull/7/files")).toEqual({
      owner: "owner",
      repo: "repo",
      prNumber: 7,
    });
  });

  it("throws on invalid URL", () => {
    expect(() => parseGitHubUrl("not-a-url")).toThrow("Invalid GitHub URL");
  });

  it("throws on empty string", () => {
    expect(() => parseGitHubUrl("")).toThrow("Invalid GitHub URL");
  });
});

describe("isPRUrl", () => {
  it("returns true for PR URL", () => {
    expect(isPRUrl("https://github.com/owner/repo/pull/1")).toBe(true);
  });

  it("returns false for repo URL", () => {
    expect(isPRUrl("https://github.com/owner/repo")).toBe(false);
  });

  it("returns false for invalid input", () => {
    expect(isPRUrl("not-a-url")).toBe(false);
  });
});

// --- shared fixtures ---

function mockPR(n: number, opts: { merged?: boolean; state?: string; title?: string } = {}) {
  const merged = opts.merged ?? true;
  return {
    number: n,
    title: opts.title ?? `PR #${n}`,
    body: `Description for PR #${n}`,
    state: opts.state ?? "closed",
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

// --- fetchPRs ---

describe("fetchPRs", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns merged PRs with file diffs when scope=merged", async () => {
    const pulls = [mockPR(1, { merged: true }), mockPR(2, { merged: false }), mockPR(3, { merged: true })];
    const files = [mockFile("src/index.ts"), mockFile("src/utils.ts")];

    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = input instanceof Request ? input.url : String(input);
      if (url.includes("/pulls?")) return Promise.resolve(mockFetchResponse(pulls));
      if (url.includes("/files")) return Promise.resolve(mockFetchResponse(files));
      return Promise.resolve(mockFetchResponse({}, 404));
    });

    const result = await fetchPRs("owner", "repo", { scope: "merged" });

    expect(result).toHaveLength(2);
    expect(result[0].number).toBe(1);
    expect(result[0].title).toBe("PR #1");
    expect(result[0].author).toBe("author");
    expect(result[0].mergedAt).toBe("2026-01-01T00:00:00Z");
    expect(result[0].state).toBe("closed");
    expect(result[0].files).toHaveLength(2);
    expect(result[1].number).toBe(3);
  });

  it("returns open PRs when scope=open", async () => {
    const pulls = [
      mockPR(1, { merged: false, state: "open" }),
      mockPR(2, { merged: true, state: "closed" }),
    ];
    const files = [mockFile("file.ts")];

    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = input instanceof Request ? input.url : String(input);
      if (url.includes("/pulls?")) return Promise.resolve(mockFetchResponse(pulls));
      if (url.includes("/files")) return Promise.resolve(mockFetchResponse(files));
      return Promise.resolve(mockFetchResponse({}, 404));
    });

    const result = await fetchPRs("owner", "repo", { scope: "open" });

    expect(result).toHaveLength(1);
    expect(result[0].number).toBe(1);
    expect(result[0].mergedAt).toBeNull();
    expect(result[0].state).toBe("open");
  });

  it("filters by typeFilter prefix", async () => {
    const pulls = [
      mockPR(1, { title: "feat: add thing" }),
      mockPR(2, { title: "fix: bug" }),
      mockPR(3, { title: "chore: deps" }),
    ];
    const files = [mockFile("file.ts")];

    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = input instanceof Request ? input.url : String(input);
      if (url.includes("/pulls?")) return Promise.resolve(mockFetchResponse(pulls));
      if (url.includes("/files")) return Promise.resolve(mockFetchResponse(files));
      return Promise.resolve(mockFetchResponse({}, 404));
    });

    const result = await fetchPRs("owner", "repo", {
      scope: "merged",
      typeFilter: ["feat", "fix"],
    });

    expect(result).toHaveLength(2);
    expect(result.map((r) => r.number)).toEqual([1, 2]);
  });

  it("matches typeFilter with conventional commit scope", async () => {
    const pulls = [mockPR(1, { title: "feat(api): endpoint" })];
    const files = [mockFile("file.ts")];

    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = input instanceof Request ? input.url : String(input);
      if (url.includes("/pulls?")) return Promise.resolve(mockFetchResponse(pulls));
      if (url.includes("/files")) return Promise.resolve(mockFetchResponse(files));
      return Promise.resolve(mockFetchResponse({}, 404));
    });

    const result = await fetchPRs("owner", "repo", { scope: "merged", typeFilter: ["feat"] });
    expect(result).toHaveLength(1);
  });

  it(`limits to MAX_PRS_TO_ANALYZE (${MAX_PRS_TO_ANALYZE})`, async () => {
    const pulls = Array.from({ length: 30 }, (_, i) => mockPR(i + 1, { merged: true }));
    const files = [mockFile("file.ts")];

    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = input instanceof Request ? input.url : String(input);
      if (url.includes("/pulls?")) return Promise.resolve(mockFetchResponse(pulls));
      if (url.includes("/files")) return Promise.resolve(mockFetchResponse(files));
      return Promise.resolve(mockFetchResponse({}, 404));
    });

    const result = await fetchPRs("owner", "repo", { scope: "merged" });
    expect(result).toHaveLength(MAX_PRS_TO_ANALYZE);
  });

  it("throws RepoNotFoundError on 404", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockFetchResponse({}, 404));

    await expect(fetchPRs("owner", "repo", { scope: "merged" })).rejects.toThrow(
      RepoNotFoundError,
    );
  });

  it("throws RepoPrivateError on 403 without rate limit", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockFetchResponse({}, 403, { "x-ratelimit-remaining": "10" }),
    );

    await expect(fetchPRs("owner", "repo", { scope: "merged" })).rejects.toThrow(
      RepoPrivateError,
    );
  });

  it("throws RateLimitError on 403 with x-ratelimit-remaining: 0", async () => {
    const resetTime = Math.floor(Date.now() / 1000) + 3600;
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockFetchResponse({}, 403, {
        "x-ratelimit-remaining": "0",
        "x-ratelimit-reset": String(resetTime),
      }),
    );

    await expect(fetchPRs("owner", "repo", { scope: "merged" })).rejects.toThrow(
      RateLimitError,
    );
  });

  it("throws NoPullRequestsError when no matching PRs exist", async () => {
    const pulls = [mockPR(1, { merged: false }), mockPR(2, { merged: false })];

    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockFetchResponse(pulls));

    await expect(fetchPRs("owner", "repo", { scope: "merged" })).rejects.toThrow(
      NoPullRequestsError,
    );
  });

  it("throws GitHubApiError on other HTTP errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockFetchResponse({}, 500));

    await expect(fetchPRs("owner", "repo", { scope: "merged" })).rejects.toThrow(
      GitHubApiError,
    );
  });

  it("passes Authorization header when token provided", async () => {
    const pulls = [mockPR(1, { merged: true })];
    const files = [mockFile("file.ts")];
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = input instanceof Request ? input.url : String(input);
      if (url.includes("/pulls?")) return Promise.resolve(mockFetchResponse(pulls));
      if (url.includes("/files")) return Promise.resolve(mockFetchResponse(files));
      return Promise.resolve(mockFetchResponse({}, 404));
    });

    await fetchPRs("owner", "repo", { scope: "merged" }, "ghp_test123");

    const firstCall = fetchSpy.mock.calls[0];
    const headers = (firstCall[1] as RequestInit | undefined)?.headers as Record<string, string>;
    expect(headers?.Authorization).toBe("Bearer ghp_test123");
  });
});

// --- fetchSinglePR ---

describe("fetchSinglePR", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a single PR with files", async () => {
    const pr = mockPR(42, { merged: true });
    const files = [mockFile("src/a.ts"), mockFile("src/b.ts")];

    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = input instanceof Request ? input.url : String(input);
      if (url.endsWith("/pulls/42")) return Promise.resolve(mockFetchResponse(pr));
      if (url.includes("/files")) return Promise.resolve(mockFetchResponse(files));
      return Promise.resolve(mockFetchResponse({}, 404));
    });

    const result = await fetchSinglePR("owner", "repo", 42);

    expect(result).toHaveLength(1);
    expect(result[0].number).toBe(42);
    expect(result[0].files).toHaveLength(2);
  });

  it("throws PRNotFoundError on 404", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockFetchResponse({}, 404));

    await expect(fetchSinglePR("owner", "repo", 999)).rejects.toThrow(PRNotFoundError);
  });
});
