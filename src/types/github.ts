export interface GitHubPullRequest {
  number: number;
  title: string;
  body: string | null;
  state: string;
  merged_at: string | null;
  created_at: string;
  updated_at: string;
  html_url: string;
  diff_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
  base: {
    repo: {
      full_name: string;
    };
  };
  additions: number;
  deletions: number;
  changed_files: number;
}

export interface GitHubPRFile {
  sha: string;
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
}

export type GitHubPRFiles = GitHubPRFile[];

export interface ParsedPR {
  number: number;
  title: string;
  author: string;
  description: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  files: {
    filename: string;
    patch: string;
  }[];
}
