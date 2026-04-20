# PR Analyzer

Score any public GitHub repository's pull requests on three dimensions — **Impact**, **AI-Leverage**, and **Quality** — using LLM-based analysis. Paste a repo URL, get a dashboard with per-PR scores, dimension breakdowns, top contributors, and concrete recommendations.

**Live demo:** https://dawid-zebacki-pr-analyzer.vercel.app/

---

## Quick Start

```bash
git clone https://github.com/dawidzebacki/PR-Analyzer.git
cd PR-Analyzer
cp .env.example .env.local   # add GITHUB_TOKEN and GROQ_API_KEY
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Required env vars:**
- `GITHUB_TOKEN` — GitHub personal access token (raises rate limit from 60 → 5000 req/h, `public_repo` scope only)
- `GROQ_API_KEY` — Groq API key for LLM scoring ([console.groq.com/keys](https://console.groq.com/keys))

**Optional:**
- `NEXT_PUBLIC_SITE_URL` — canonical URL for SEO/Open Graph (falls back to `VERCEL_URL` on Vercel)

---

## Tech Stack

**Framework / runtime:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Bun
**UI:** Tailwind CSS 4 (CSS-based `@theme` config) · Framer Motion · Lucide icons · Recharts
**Data / forms:** TanStack Query v5 · React Hook Form · Zod v4
**i18n:** next-intl (prefix routing, EN + PL)
**LLM:** Groq (`llama-3.3-70b-versatile`, JSON mode)
**Tooling:** Storybook 10 (`@storybook/nextjs-vite`) · Vitest · Playwright · ESLint 9
**Deploy:** Vercel

**Why these choices:** Next.js 16 + App Server Components keeps the initial bundle small and lets API routes live in the same project — ideal for a GitHub-API-fronting tool. Tailwind v4's `@theme` directive removes the `tailwind.config.ts` boilerplate and keeps design tokens colocated with global CSS. Bun replaced npm/pnpm purely for install/dev-server speed.

**LLM journey:** Started on Anthropic Claude Sonnet (best-in-class reasoning, but required paid credits up-front for a take-home demo). Switched to **Gemini 2.0 Flash** for its free tier (PR#19), then to **Groq** running Llama 3.3 70B (`feat/single-pr-analysis`) — Groq's inference is dramatically faster (sub-second per PR), has a generous free tier, and supports JSON mode natively. End-to-end repo analysis dropped from ~30s to ~5s.

---

## AI Usage

This project was built almost entirely with **Claude Code** (VS Code extension and CLI), with a deliberate workflow:

- **Claude Code as primary IDE assistant** — every feature, refactor, and bugfix went through prompt-driven iteration. Commits authored with AI assistance are tagged `[ai]`.
- **MCP GitHub server** for branch creation, PR open/merge, and review fetch — replaces shelling out to `gh` and lets the agent reason about repo state directly.
- **Custom slash commands** in `.claude/commands/` codify recurring workflows: `/review` (lint + tsc + build before commit), `/create-pr` (self-review, push, open PR with template), `/new-component`, `/new-hook`, `/new-api-route`, `/new-translation`, `/test`.
- **Persistent memory** in `~/.claude/.../memory/` captures stable preferences (e.g. "always run /review before commit", "use `mcp__github__*` not `gh` CLI", "Zod v4 API") so the agent stays consistent across sessions.
- **Groq's Llama 3.3 70B** powers the production scoring engine — Claude is the developer-side tool, Groq is the runtime-side tool. Different latency/cost trade-offs justify different models.
- **CLAUDE.md** at repo root encodes design tokens, conventions, and scoring weights — the agent reads it on every conversation, eliminating "remind me of the color palette" rounds.

The split — Claude for development, Groq for inference — let me iterate on UX with a strong reasoning model while shipping a runtime that's cheap and fast.

---

## Scoring Model

Each PR gets three independent scores in `[0, 100]`. The total is a weighted sum:

| Dimension       | Weight | What it measures                                                            |
| --------------- | ------ | --------------------------------------------------------------------------- |
| **Impact**      | 0.35   | Real value delivered — meaningful changes vs. trivial fixes                 |
| **AI-Leverage** | 0.25   | Evidence of skillful AI-assisted development                                |
| **Quality**     | 0.40   | Engineering hygiene — focus, cleanliness, tests, description quality        |

```
total = impact * 0.35 + aiLeverage * 0.25 + quality * 0.40
```

**Weight rationale:** Quality dominates (0.40) because code ultimately has to be good — a high-impact PR that breaks the build is worth less than a clean one. Impact is close behind (0.35) because PRs should deliver business value. AI-Leverage (0.25) is a bonus for skillful AI use without being decisive — it rewards good practice without penalizing repos that don't use AI.

**State-aware prompts:** scoring works on **merged AND open PRs**. The prompt branch adapts: open PRs are scored on intent and current state (no merge guarantee), merged PRs are scored on shipped impact. This lets you analyze active development, not just history.

---

## Features

- **Repo analysis** — paste any public GitHub URL, pick a scope (merged / open / closed / all) and type filter (feat / fix / chore / etc.) via a dialog, get a full dashboard.
- **Single PR analysis** — paste a PR URL for a deep-dive on one change.
- **Max 5 PRs per analysis** — keeps prompts within context, response quality high, and Groq usage cheap.
- **Dashboard** — total score, dimension breakdown radar, per-PR cards with rationale, top contributors, recommendations.
- **Share & export** — shareable URL (`?repo=...`) and downloadable PNG score badge.
- **Bilingual UI** — English + Polish, locale prefix routing, full translation parity.
- **Component library** — every UI primitive and section has a Storybook story.

---

## Design Decisions

Distilled from `NOTES.md`:

- **Groq over Anthropic / Gemini** — Groq's free tier + sub-second inference + native JSON mode beat Claude (paid only) and Gemini (slower, less reliable JSON enforcement). Demo-friendly, production-shippable.
- **Max 5 PRs (was 20)** — lower MAX keeps the prompt under model context, the response quality higher, and cost predictable. Single-PR mode covers deep-dive cases that the old `MAX=20` was trying to serve.
- **Scope dialog instead of "always merged"** — early versions only scored merged PRs, which under-served repos with active open work or maintainer-style repos. The dialog makes the scope an explicit user choice.
- **Single PR mode** — added so a developer can validate "is this PR good?" before requesting review, separately from scoring a whole repo.
- **Cache key includes scope variant** — `repoUrl + scope + typeFilter` so two analyses with different scopes don't clobber each other in the in-memory `Map`.
- **Share URL only encodes `?repo=`** — scope/typeFilter aren't persisted; on cache miss the user re-picks via the dialog. Simpler URL, no stale-scope foot-guns.
- **PNG badge canvas uses hex literals** — canvas has no Tailwind; values were copied from the `CLAUDE.md` token table to keep them in sync.
- **passport-photo.online style adaptation** — adopted the indigo/purple CTA, PT Serif headings, Inter body, light blue tinted backgrounds. Darkened `text-muted` from `#8C8FA3` → `#6B6F85` because the original failed WCAG AA contrast (2.94:1) on the `#EFF6FA` background.
- **Tailwind v4 `@theme` only, no `tailwind.config.ts`** — all design tokens live in `globals.css`, so the source of truth is one file.
- **`.gitattributes` with `eol=lf`** — fixes CRLF warnings on Windows when `core.autocrlf=true` is global.

---

## Internationalization

Built on `next-intl` with prefix routing:

- `/` → English (default)
- `/pl` → Polish

**Adding a new language:**

1. Add the locale code to `src/i18n/routing.ts` (`locales` array).
2. Create `src/messages/<locale>.json` mirroring `en.json`.
3. Add the language label to `LocaleSwitcher`.
4. Confirm font subsets in `src/app/[locale]/layout.tsx` cover the script (e.g. `latin-ext` for Polish).

`en.json` is the source of truth — every key added there must be added to `pl.json` (or any future locale) in the same commit.

---

## Storybook

```bash
bun run storybook   # http://localhost:6006
```

**Coverage:**
- Every UI primitive in `src/components/ui/*` has a `.stories.ts` (Button, Input, Card, Badge, Container, Section, ScoreRing, Toast, AnimatedNumber, AnalysisScopeDialog).
- Every landing section (Hero, HowItWorks, SocialProof, ScoringDimensions, DashboardPreview, CTASection, HeroForm).
- Every dashboard component (TotalScore, ScoreBreakdown, PRList, PRCard, AuthorStats, AuthorCard, Recommendations, RepoHeader, ShareBar, AnalysisLoading, DashboardSkeleton, PRListControls).
- Shared components (Navbar, Footer, LocaleSwitcher, ErrorState).

Stories use Component Story Format 3 (`satisfies Meta<typeof Component>`) and cover default, all variants, and interactive states (loading / disabled / error).

---

## What I'd Do Next

- **GitHub OAuth** — analyze private repos without users pasting personal tokens.
- **Persistent storage** — swap the in-memory cache for Postgres (Neon or Supabase) so analyses survive restarts and can be revisited.
- **Webhooks** — auto-score PRs when opened/updated, post score as a PR comment.
- **Historical trends** — track score-over-time per repo, show whether a team's PR quality is trending up or down.
- **Team / org analytics** — roll up per-author scores into team dashboards.
- **CI/CD integration** — GitHub Action that fails a PR if score drops below a threshold.
- **More languages** — DE, ES, FR are low-cost to add (translation only).
- **Cross-repo comparison** — pick two repos, compare score distributions side-by-side.
- **Custom scoring weights** — let teams tune the Impact/AI-Leverage/Quality weights for their context.

---

## Live Demo

[https://dawid-zebacki-pr-analyzer.vercel.app/](https://dawidzebacki-pr-analyzer.vercel.app/)

---

## Comments on the Task

- Built end-to-end with Claude Code (VS Code extension + CLI) over a series of small, focused PRs — branch-per-feature, [ai]-tagged commits, self-review via custom `/review` and `/create-pr` slash commands. The project is, in itself, a working sample of the AI-assisted workflow it scores other people's PRs against.
- The LLM choice changed twice during development (Claude → Gemini → Groq). Each swap was driven by a concrete constraint (free-tier access, then inference latency). Keeping the scoring layer behind a small `lib/scoring.ts` interface made each swap a single-file change.
- Took the design system from passport-photo.online as the brief specified and adapted to fit a developer-tool aesthetic. The biggest deviation: darker `text-muted` for WCAG AA compliance — visual fidelity matters less than accessible contrast.
- Scope and PR-count limits (5 PRs max) are deliberate — both for cost and for response quality. Single-PR mode covers the deep-dive case that a higher limit would otherwise be chasing.
