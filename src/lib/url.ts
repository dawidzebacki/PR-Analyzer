// Pure URL parsing — safe to import from both client and server code.

export interface ParsedGitHubUrl {
  owner: string;
  repo: string;
  prNumber?: number;
}

export function parseGitHubUrl(url: string): ParsedGitHubUrl {
  const cleaned = url.trim().replace(/\/+$/, "").replace(/\.git$/, "");

  const prMatch = cleaned.match(
    /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/,
  );
  if (prMatch) {
    return {
      owner: prMatch[1],
      repo: prMatch[2],
      prNumber: Number(prMatch[3]),
    };
  }

  const repoMatch = cleaned.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (repoMatch) {
    return { owner: repoMatch[1], repo: repoMatch[2] };
  }

  const shortMatch = cleaned.match(/^([^/]+)\/([^/]+)$/);
  if (shortMatch) {
    return { owner: shortMatch[1], repo: shortMatch[2] };
  }

  throw new Error(`Invalid GitHub URL: "${url}"`);
}

export function isPRUrl(url: string): boolean {
  try {
    return parseGitHubUrl(url).prNumber !== undefined;
  } catch {
    return false;
  }
}
