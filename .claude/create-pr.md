Create a new branch, review code, run checks, and open a pull request.

Topic/description: $ARGUMENTS

## Step 1: Self-review
Before committing anything, review ALL changed files:
- Read through every changed file
- Check for: TypeScript errors, unused imports, console.logs left in, hardcoded values that should use design tokens, missing "use client" directives, missing error handling
- Verify code follows conventions from CLAUDE.md
- Fix any issues found BEFORE proceeding

## Step 2: Run checks
Run these commands and fix ALL errors before committing:
```
bun run lint
bunx tsc --noEmit
bun run build
```
If any check fails — fix the issue and re-run until all pass.

## Step 3: Update NOTES.md
If anything noteworthy happened during this PR, append to the appropriate section in NOTES.md:
- **Decisions**: any design/tech choice that wasn't obvious
- **Issues & Fixes**: anything that broke and how you fixed it
- **AI Observations**: prompts that needed iteration, surprising results, things that worked first try
- **Ideas for Later**: features or improvements you noticed but skipped

Only add notes if there's something genuinely worth recording. Don't force it. One line per note. Include the PR name/number for context.

## Step 4: Commit and push
Only after all checks pass:
1. Verify you are on main with clean working directory (git status)
2. Create a new branch: feat/$ARGUMENTS (replace spaces with hyphens, lowercase)
3. Stage all changes: git add -A
4. Commit with a descriptive message (format: "feat: description [ai]" or "fix: description [ai]" or "chore: description [ai]")
5. Push branch: git push -u origin <branch-name>

## Step 5: Create PR
Create a PR on GitHub (use GitHub MCP) with:
- Title: descriptive, in English
- Body: 1-2 sentences explaining what changed and why
- Base: main