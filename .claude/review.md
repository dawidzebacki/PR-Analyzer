Review all current changes and run quality checks.

## Step 1: List changes
Run `git diff --stat` to see what files changed.

## Step 2: Code review
For each changed file:
- Read the full file content
- Check for TypeScript errors, unused imports, console.logs
- Verify naming conventions match CLAUDE.md
- Check that Tailwind classes use design tokens (no hardcoded hex colors)
- Verify "use client" is present where needed
- Check error handling in API routes and async code
- Look for accessibility issues (missing aria labels, alt texts)
- Check responsive design (mobile-first, proper breakpoints)

## Step 3: Run checks
```
bun run lint
bunx tsc --noEmit
bun run build
```

## Step 4: Report
Summarize:
- Issues found and fixed
- Issues found that need manual decision
- All checks pass / fail status

Do NOT commit or push anything. Just review and report.