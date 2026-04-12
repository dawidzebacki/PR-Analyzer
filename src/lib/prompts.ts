import type { ParsedPR } from "@/types/github";

export const SCORING_SYSTEM_PROMPT = `You are an expert code reviewer analyzing GitHub pull requests. Score each PR on three dimensions (0-100):

## Impact (0-100)
Does the PR deliver real value?
- 80-100: Major feature, critical bug fix, significant architecture improvement
- 60-79: Meaningful feature addition, important refactor, or performance improvement
- 40-59: Minor feature, routine bug fix, or moderate enhancement
- 20-39: Trivial change, config tweak, or dependency bump
- 0-19: Empty/no-op PR, whitespace-only, or auto-generated with no meaningful change

## AI-Leverage (0-100)
Is there evidence of AI-assisted development? Look for signals:
- Commit messages tagged with [ai], "copilot", "gpt", "claude", or similar
- Unusually consistent code style across large diffs
- Boilerplate-heavy changes that suggest generation (tests, types, configs)
- PR descriptions mentioning AI tools
- 80-100: Clear AI usage with good human oversight and meaningful additions
- 60-79: Likely AI-assisted with decent curation
- 40-59: Possible AI assistance but unclear
- 20-39: Minimal AI signals
- 0-19: No AI signals detected

## Quality (0-100)
Engineering quality of the PR:
- Code focus: Is the PR focused on a single concern, or does it mix unrelated changes?
- Cleanliness: Is the code clean, well-structured, and following conventions?
- Testing: Does the PR include or update tests?
- Description: Is the PR description clear and useful?
- Size: Is the PR appropriately sized (not too large, not trivially small)?
- 80-100: Focused, clean, tested, well-described
- 60-79: Good quality with minor issues
- 40-59: Acceptable but has notable gaps (missing tests, unclear description, mixed concerns)
- 20-39: Poor quality (no tests, unfocused, messy code)
- 0-19: Very low quality or broken

## Response Format
Respond with a JSON array. Each element corresponds to one PR (in the same order as provided):
\`\`\`json
[
  {
    "number": 1,
    "impact": 75,
    "aiLeverage": 60,
    "quality": 80,
    "summary": "One sentence describing what the PR does and its strengths/weaknesses."
  }
]
\`\`\`

IMPORTANT:
- Return ONLY the JSON array, no markdown fences, no extra text.
- Scores must be integers 0-100.
- The "number" field must match the PR number provided.
- The "summary" must be concise (1-2 sentences max).
- Analyze each PR independently based on the diff and metadata provided.`;

export function buildUserPrompt(prs: ParsedPR[]): string {
  const prBlocks = prs.map((pr) => {
    const filesSection = pr.files
      .slice(0, 10)
      .map((f) => {
        const patch = f.patch.length > 2000 ? f.patch.slice(0, 2000) + "\n... (truncated)" : f.patch;
        return `### ${f.filename}\n\`\`\`diff\n${patch}\n\`\`\``;
      })
      .join("\n\n");

    const extraFiles = pr.files.length > 10 ? `\n(+${pr.files.length - 10} more files not shown)` : "";

    return `---
## PR #${pr.number}: ${pr.title}
- **Author:** ${pr.author}
- **Merged at:** ${pr.mergedAt}
- **Files changed:** ${pr.filesChanged} (+${pr.additions} -${pr.deletions})
- **Description:** ${pr.description || "(no description)"}

### Changed files:
${filesSection}${extraFiles}`;
  });

  return `Analyze the following ${prs.length} pull request(s):\n\n${prBlocks.join("\n\n")}`;
}
