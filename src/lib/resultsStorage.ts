// Client-side cache for analysis results, keyed by result id.
// Survives page reload within the same tab but not cross-browser — for truly
// shareable links we'd need a persistent server store (see CLAUDE.md).

import type { RepoAnalysis } from "@/types/scoring";

const PREFIX = "pr-analyzer:result:";

export function storeResult(id: string, data: RepoAnalysis): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PREFIX + id, JSON.stringify(data));
  } catch {
    // Quota exceeded or storage disabled — silently skip.
  }
}

export function readResult(id: string): RepoAnalysis | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PREFIX + id);
    return raw ? (JSON.parse(raw) as RepoAnalysis) : null;
  } catch {
    return null;
  }
}
