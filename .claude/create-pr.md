Create a new branch and pull request.

Topic/description: $ARGUMENTS

Steps:
1. Check you are on main with a clean working directory (git status)
2. Create a new branch: feat/$ARGUMENTS (replace spaces with hyphens, lowercase)
3. Stage all changes: git add -A
4. Commit with a descriptive message (format: "feat: description" or "fix: description" or "chore: description")
5. Push branch: git push -u origin <branch-name>
6. Create a PR on GitHub (use GitHub MCP) with:
   - Title: descriptive, in English
   - Body: 1-2 sentences explaining what changed and why
   - Base: main