# Development Notes

Scratchpad for decisions, issues, and observations.
Will be distilled into README sections (Design Decisions, AI Usage, What I'd Do Next) at the end.

---

## Decisions

<!-- Format: what you decided + why, one line each -->
- Used Next.js 16 instead of 15 — create-next-app installed latest, no reason to downgrade
- Missing --color-black in globals.css — added per design system spec
- Tailwind v4 uses CSS-based @theme config, no tailwind.config.ts needed — all design tokens live in globals.css
- Added .gitattributes with eol=lf to fix CRLF warnings on Windows (core.autocrlf=true globally)
- PR#15: Darkened text-muted from #8C8FA3 to #6B6F85 — original passport-photo.online color failed WCAG AA (2.94:1 on bg-background)
- PR#19: Switched scoring LLM from Claude (claude-sonnet-4-20250514) to Gemini (gemini-2.0-flash) — Gemini has a free API tier, Claude required paid credits
- feat/single-pr-analysis: Switched scoring LLM from Gemini to Groq (llama-3.3-70b-versatile) — faster inference, generous free tier
- feat/single-pr-analysis: Reduced MAX_PRS_TO_ANALYZE from 20 to 5 — keeps prompts within model context and analysis snappy now that single-PR mode exists for deep dives
- feat/dashboard-export-share: Share URL only encodes repoUrl (`?repo=`), not scope/typeFilter — RepoAnalysis doesn't persist those; on expired re-analyze user picks scope again via dialog
- feat/dashboard-export-share: PNG badge canvas uses hex literals instead of design tokens — canvas has no Tailwind; values copied from CLAUDE.md token table
- fix/code-review-pass: Renamed `repoScore` → `totalScore` ("Total Score") — we analyze max ~5 PRs, not the whole repo, so "Repository Score" was misleading
- fix/code-review-pass: Equal-height tile pattern uses `h-full` on grid child + `flex flex-col` + `mt-auto` on the element to push to bottom — applied to ScoringDimensions (rings) and ScoreBreakdown (descriptions); easy to regress if `h-full` gets dropped

## Issues & Fixes

<!-- Things that broke, what you tried, what worked -->
- PR#17: LLMScoringResponse type was missing `number` field — tsc caught it, added to types/scoring.ts
- feat/single-pr-analysis: Groq JSON mode requires an object response, not a bare array — wrapped LLM output as `{ "prs": [...] }` and unwrap in parser

## AI Observations

<!-- Interesting prompts, when Claude Code nailed it, when it didn't, iterations needed -->

## Ideas for Later

<!-- Things you'd add in a next sprint -->