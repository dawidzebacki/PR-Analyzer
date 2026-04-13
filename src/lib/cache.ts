import { CACHE_TTL_MS } from "@/constants";
import type { RepoAnalysis } from "@/types/scoring";

interface CacheEntry {
  data: RepoAnalysis;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

export function generateKey(repoUrl: string, variant?: string): string {
  const normalized = repoUrl
    .trim()
    .toLowerCase()
    .replace(/\/+$/, "")
    .replace(/\.git$/, "")
    .replace(/^https?:\/\//, "");

  const source = variant ? `${normalized}?${variant}` : normalized;

  let hash = 0;
  for (let i = 0; i < source.length; i++) {
    const char = source.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }

  return `repo_${Math.abs(hash).toString(36)}`;
}

export function get(key: string): RepoAnalysis | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

export function set(key: string, data: RepoAnalysis): void {
  cache.set(key, { data, timestamp: Date.now() });
}
