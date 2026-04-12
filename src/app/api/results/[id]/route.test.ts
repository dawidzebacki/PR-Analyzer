import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import * as cache from "@/lib/cache";
import type { RepoAnalysis } from "@/types/scoring";

vi.mock("@/lib/cache", () => ({
  get: vi.fn(() => null),
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

function makeRequest(id: string): [Request, { params: Promise<{ id: string }> }] {
  return [
    new Request(`http://localhost:3000/api/results/${id}`),
    { params: Promise.resolve({ id }) },
  ];
}

describe("GET /api/results/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cache.get).mockReturnValue(null);
  });

  it("returns 200 with cached result", async () => {
    vi.mocked(cache.get).mockReturnValue(mockAnalysis);

    const res = await GET(...makeRequest("repo_abc123"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.repoName).toBe("owner/repo");
    expect(cache.get).toHaveBeenCalledWith("repo_abc123");
  });

  it("returns 404 for unknown cache key", async () => {
    const res = await GET(...makeRequest("nonexistent"));
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.code).toBe("NOT_FOUND");
  });

  it("returns 404 for expired cache entry", async () => {
    // cache.get already returns null for expired entries
    vi.mocked(cache.get).mockReturnValue(null);

    const res = await GET(...makeRequest("repo_expired"));
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error).toContain("not found or expired");
  });
});
