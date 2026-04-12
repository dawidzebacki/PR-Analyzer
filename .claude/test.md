Run the full test and quality check suite, then report results.

## Step 1: Lint
```
bun run lint
```

## Step 2: Type check
```
bunx tsc --noEmit
```

## Step 3: Build
```
bun run build
```

## Step 4: Storybook build
```
bun run build-storybook
```

## Step 5: Report
Summarize results:
- ✓ / ✗ for each check
- Any warnings worth noting
- If anything failed, show the error and suggest a fix

Do NOT fix anything automatically — just report.
