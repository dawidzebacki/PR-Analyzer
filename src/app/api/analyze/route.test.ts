import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import * as cache from "@/lib/cache";
import * as github from "@/lib/github";
import * as scoring from "@/lib/scoring";
import type { RepoAnalysis } from "@/types/scoring";

vi.mock("@/lib/cache", () => ({
  generateKey: vi.fn(() => "repo_abc123"),
  get: vi.fn(() => null),
  set: vi.fn(),
}));

vi.mock("@/lib/github", async (importOriginal) => {
  const actual = await importOriginal<typeof github>();
  return {
    ...actual,
    parseGitHubUrl: vi.fn(() => ({ owner: "owner", repo: "repo" })),
    fetchPRs: vi.fn(() => Promise.resolve([])),
    fetchSinglePR: vi.fn(() => Promise.resolve([])),
  };
});

vi.mock("@/lib/scoring", () => ({
  scorePullRequests: vi.fn(() => Promise.resolve(mockAnalysis)),
}));

const mockAnalysis: RepoAnalysis = {
  repoUrl: "https://github.com/owner/repo",
  repoName: "owner/repo",
  analyzedAt: "2026-01-01T00:00:00.000Z",
  totalScore: 65,
  scores: { impact: 70, aiLeverage: 50, quality: 70, total: 65 },
  prs: [],
  recommendations: ["Great work!"],
  authorStats: [],
};

function jsonRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/analyze", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cache.generateKey).mockReturnValue("repo_abc123");
    vi.mocked(cache.get).mockReturnValue(null);
    vi.mocked(cache.set).mockImplementation(() => {});
    vi.mocked(github.parseGitHubUrl).mockReturnValue({ owner: "owner", repo: "repo" });
    vi.mocked(github.fetchPRs).mockResolvedValue([]);
    vi.mocked(github.fetchSinglePR).mockResolvedValue([]);
    vi.mocked(scoring.scorePullRequests).mockResolvedValue(mockAnalysis);
  });

  it("returns 200 with analysis for valid repo URL", async () => {
    const res = await POST(jsonRequest({ repoUrl: "https://github.com/owner/repo" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.repoName).toBe("owner/repo");
    expect(body.data.totalScore).toBe(65);
    expect(github.fetchPRs).toHaveBeenCalled();
    expect(github.fetchSinglePR).not.toHaveBeenCalled();
  });

  it("uses fetchSinglePR when URL points to a specific PR", async () => {
    vi.mocked(github.parseGitHubUrl).mockReturnValue({
      owner: "owner",
      repo: "repo",
      prNumber: 42,
    });

    const res = await POST(
      jsonRequest({ repoUrl: "https://github.com/owner/repo/pull/42" }),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(github.fetchSinglePR).toHaveBeenCalledWith(
      "owner",
      "repo",
      42,
      expect.anything(),
    );
    expect(github.fetchPRs).not.toHaveBeenCalled();
  });

  it("passes scope and typeFilter to fetchPRs", async () => {
    await POST(
      jsonRequest({
        repoUrl: "https://github.com/owner/repo",
        scope: "open",
        typeFilter: ["feat", "fix"],
      }),
    );

    expect(github.fetchPRs).toHaveBeenCalledWith(
      "owner",
      "repo",
      { scope: "open", typeFilter: ["feat", "fix"] },
      expect.anything(),
    );
  });

  it("returns cached result on second request", async () => {
    vi.mocked(cache.get).mockReturnValue(mockAnalysis);

    const res = await POST(jsonRequest({ repoUrl: "https://github.com/owner/repo" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.repoName).toBe("owner/repo");
    expect(github.fetchPRs).not.toHaveBeenCalled();
    expect(scoring.scorePullRequests).not.toHaveBeenCalled();
  });

  it("caches result after successful analysis", async () => {
    await POST(jsonRequest({ repoUrl: "https://github.com/owner/repo" }));

    expect(cache.set).toHaveBeenCalledWith("repo_abc123", mockAnalysis);
  });

  it("returns 400 for invalid URL", async () => {
    const res = await POST(jsonRequest({ repoUrl: "not-a-url" }));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.code).toBe("INVALID_URL");
  });

  it("returns 400 for missing body", async () => {
    const res = await POST(jsonRequest({}));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.code).toBe("INVALID_URL");
  });

  it("returns 400 for non-GitHub URL", async () => {
    const res = await POST(jsonRequest({ repoUrl: "https://gitlab.com/owner/repo" }));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.code).toBe("INVALID_URL");
  });

  it("returns 404 for nonexistent repo", async () => {
    vi.mocked(github.fetchPRs).mockRejectedValue(
      new github.RepoNotFoundError("owner", "repo"),
    );

    const res = await POST(jsonRequest({ repoUrl: "https://github.com/owner/repo" }));
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.code).toBe("REPO_NOT_FOUND");
  });

  it("returns 404 for nonexistent PR", async () => {
    vi.mocked(github.parseGitHubUrl).mockReturnValue({
      owner: "owner",
      repo: "repo",
      prNumber: 9999,
    });
    vi.mocked(github.fetchSinglePR).mockRejectedValue(
      new github.PRNotFoundError("owner", "repo", 9999),
    );

    const res = await POST(
      jsonRequest({ repoUrl: "https://github.com/owner/repo/pull/9999" }),
    );
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.code).toBe("PR_NOT_FOUND");
  });

  it("returns 403 for private repo", async () => {
    vi.mocked(github.fetchPRs).mockRejectedValue(
      new github.RepoPrivateError("owner", "repo"),
    );

    const res = await POST(jsonRequest({ repoUrl: "https://github.com/owner/repo" }));
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.code).toBe("ACCESS_DENIED");
  });

  it("returns 403 for GitHub rate limit", async () => {
    vi.mocked(github.fetchPRs).mockRejectedValue(
      new github.RateLimitError(new Date()),
    );

    const res = await POST(jsonRequest({ repoUrl: "https://github.com/owner/repo" }));
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.code).toBe("GITHUB_RATE_LIMIT");
  });

  it("returns 422 when repo has no matching PRs", async () => {
    vi.mocked(github.fetchPRs).mockRejectedValue(
      new github.NoPullRequestsError("owner", "repo"),
    );

    const res = await POST(jsonRequest({ repoUrl: "https://github.com/owner/repo" }));
    const body = await res.json();

    expect(res.status).toBe(422);
    expect(body.success).toBe(false);
    expect(body.code).toBe("NO_MERGED_PRS");
  });

  it("returns 504 on timeout", async () => {
    vi.mocked(scoring.scorePullRequests).mockImplementation(
      () => new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), 10)),
    );

    const res = await POST(jsonRequest({ repoUrl: "https://github.com/owner/repo" }));
    const body = await res.json();

    expect(res.status).toBe(504);
    expect(body.success).toBe(false);
    expect(body.code).toBe("TIMEOUT");
  });

  it("returns 500 for unexpected errors", async () => {
    vi.mocked(github.fetchPRs).mockRejectedValue(new Error("Something broke"));

    const res = await POST(jsonRequest({ repoUrl: "https://github.com/owner/repo" }));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.code).toBe("INTERNAL_ERROR");
  });
});
