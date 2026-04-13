# Key Prompts

A small set of prompts that meaningfully shaped the project — the scoring engine itself, plus four moments where the prompt I gave Claude Code drove a significant chunk of the codebase.

The development prompts here are paraphrased from real conversations — exact wording varied across iterations, but the intent and shape are accurate.

---

## 1. Scoring engine system prompt (production)

**Context:** This is the prompt sent to Groq (`llama-3.3-70b-versatile`) on every analysis. It defines the full scoring contract: dimensions, score bands, response shape, and constraints. It went through several iterations before being stable enough to ship — earlier versions were too vague (model returned floats or strings), too verbose (truncated by context), or didn't pin the JSON shape (Groq's JSON mode requires a top-level object, not an array, so a wrapper key was added).

**Prompt** (excerpt — full text in `src/lib/prompts.ts`):

```
You are an expert code reviewer analyzing GitHub pull requests. Score each PR
on three dimensions (0-100):

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
[score bands omitted for brevity]

## Quality (0-100)
Engineering quality of the PR:
- Code focus: Is the PR focused on a single concern, or does it mix unrelated changes?
- Cleanliness: Is the code clean, well-structured, and following conventions?
- Testing: Does the PR include or update tests?
- Description: Is the PR description clear and useful?
- Size: Is the PR appropriately sized (not too large, not trivially small)?
[score bands omitted for brevity]

## Response Format
Respond with a JSON object containing a single key "prs" holding an array.
[example JSON]

IMPORTANT:
- Return ONLY the JSON object, no markdown fences, no extra text.
- Scores must be integers 0-100.
- The "number" field must match the PR number provided.
- The "summary" must be concise (1-2 sentences max).
- Analyze each PR independently based on the diff and metadata provided.
```

**Result:** Stable, parseable output across hundreds of test runs. The explicit `IMPORTANT` block at the end (integers only, number must match, no markdown fences) eliminated the last class of parser failures. The `{ "prs": [...] }` wrapper was the fix for Groq's JSON-mode constraint of "top-level must be object" — earlier `[...]` returns crashed `response_format: json_object` requests.

**Learning:**
- **Anchor scores with bands, not free reign.** "Score 0-100" without bands gives noisy, drifting scores. Five labelled buckets (`80-100`, `60-79`, ...) collapse the variance.
- **Pin the response shape with an example, then forbid everything else.** "Return JSON" is too loose. "Return ONLY the JSON object, no markdown fences, no extra text" + an example is what actually worked.
- **API quirks belong in the prompt's structure, not in post-processing.** Wrapping the array in `{ "prs": [...] }` is uglier than a bare array, but it's the contract Groq's JSON mode wants — fight the API once, parse cleanly forever.

---

## 2. AnalysisScopeDialog — modal with scope + type selection

**Context:** Single-PR mode existed, but for repo-wide analysis users wanted to control the scope (merged / open / closed / all) and filter by type (feat / fix / chore / etc.) instead of always getting "the most recent 5 merged PRs". Needed a dialog that opened from the Hero form, picked scope + type, and submitted to `/api/analyze`.

**Prompt:**

> Add an `AnalysisScopeDialog` UI component in `src/components/ui/`. It opens after the user submits a repo URL on the Hero form. Two sections: (1) **Scope** — radio buttons for merged / open / closed / all; (2) **Type filter** — multi-select chips for feat, fix, chore, refactor, docs, test, style, perf (default: all selected). Confirm button submits, Cancel closes. Use Framer Motion for enter/exit (`AnimatePresence`, scale + fade). Lock body scroll while open. Trap focus, close on Esc and backdrop click. Add Storybook stories for default-open, all-types-deselected, and submitting states. Add EN + PL translations. Use design tokens from CLAUDE.md — no hardcoded hex.

**Result:** Got a working dialog on the first pass with proper a11y (focus trap, Esc, backdrop dismissal), Framer Motion transitions, and Storybook coverage. Two follow-up tweaks: (1) initial focus landed on the Cancel button — moved to Confirm, (2) the type-chip "select all / clear all" buttons were missing — added.

**Learning:**
- **List the boring stuff explicitly or it gets skipped.** "Trap focus, close on Esc and backdrop click, lock body scroll" — none of those are obvious from "build a modal", and all three are invisible until missing.
- **Reference CLAUDE.md design tokens by name.** Once `CLAUDE.md` documented the palette, prompts could just say "use design tokens, no hardcoded hex" and rely on the agent to read it. Saved repeating the palette every time.
- **Storybook stories belong in the same prompt as the component.** Asking for them upfront avoided a follow-up round and ensured the story matched the implementation.

---

## 3. i18n setup — next-intl with App Router

**Context:** Project started English-only. Adding Polish meant integrating `next-intl` with the App Router — locale-prefix routing, server + client component support, middleware, Link/redirect helpers, and a font subset that covers Polish characters. This is the kind of cross-cutting setup where one wrong move (e.g. wrong middleware matcher, missing `latin-ext` font subset) breaks something subtle.

**Prompt:**

> Set up `next-intl` for prefix-based locale routing with English (default) and Polish. Move all pages under `src/app/[locale]/`. Add `src/middleware.ts` that uses `createMiddleware(routing)` and excludes `api`, `_next`, `_vercel`, and any path with a file extension. Create `src/i18n/routing.ts` (locales + defaultLocale), `src/i18n/request.ts` (`getRequestConfig`), and `src/i18n/navigation.ts` (re-exports of locale-aware `Link`, `redirect`, `usePathname`, `useRouter`). Wrap the root layout with `NextIntlClientProvider`. Move all user-facing strings into `src/messages/en.json` and `src/messages/pl.json` — preserve nested namespacing (`hero.title`, `nav.howItWorks`, etc.). Configure both `next/font/google` instances (PT Serif, Inter) with `subsets: ["latin", "latin-ext"]` so Polish characters render. Replace every `next/link` import in user-facing code with the locale-aware `Link` from `@/i18n/navigation`. Don't touch API routes.

**Result:** Worked end-to-end — `/` rendered EN, `/pl` rendered PL, server and client components both got translations correctly. One catch the agent surfaced unprompted: `useTranslations` works in async server components only via the client-component boundary, so deeply async server components needed `getTranslations` from `next-intl/server` instead. Saved that as a project memory.

**Learning:**
- **For cross-cutting setup, list every file you expect to be touched.** "Set up next-intl" → vague, will miss things. "Create routing.ts, request.ts, navigation.ts; add middleware; wrap root layout; configure font subsets; replace next/link imports" → concrete checklist, easier to verify.
- **Mention exclusions explicitly.** The "don't touch API routes" line and the explicit middleware matcher exclusions (`api`, `_next`, `_vercel`, `.*\\..*`) prevented breakage. Without them, the middleware would have rewritten API URLs.
- **Async server components are a recurring foot-gun.** `useTranslations` vs `getTranslations` is the kind of thing worth saving as a long-lived project memory rather than relearning every time.

---

## 4. Design system extraction — adapting passport-photo.online

**Context:** The brief said "use passport-photo.online style". Rather than vibing it, I wanted the actual design tokens (colors, type scale, spacing, border radii) extracted into Tailwind v4 `@theme` variables so the rest of the build could just consume them.

**Prompt:**

> Visit passport-photo.online, read the rendered CSS, and extract the design system into Tailwind v4 `@theme` tokens in `src/app/globals.css`. I want: full color palette with semantic names (primary, primary-hover, navy, accent-green, accent-blue, background, surface, border, text, text-muted, text-secondary, error, error-bg) — keep the original HSL values as comments next to each hex. Type scale for h1/h2/h3/subtitle/body/body-large/small/nav-item with desktop AND mobile sizes (font-size, line-height, letter-spacing, weight). Spacing scale `sp1`–`sp15`. Border radius scale (sm/md/lg/xl/2xl/full). Section background colors (light blue tint vs white). Button styles (primary, secondary, navbar-CTA) with exact heights/paddings. Document everything in CLAUDE.md so future prompts can reference tokens by name. **Verify color contrast against WCAG AA** for the muted-text-on-background pairing — flag anything that fails.

**Result:** Got the tokens dropped into `globals.css` and mirrored in `CLAUDE.md`. The WCAG check caught one issue: the original `text-muted` (`#8C8FA3`) was 2.94:1 against the page background — fails AA (needs ≥4.5:1 for body text). Darkened to `#6B6F85` (4.51:1, just over the line) and noted the deviation in `NOTES.md`.

**Learning:**
- **"Use this style" produces vibes; "extract these tokens with these names" produces a system.** Naming the semantic categories upfront (primary / accent / surface / text-muted) forced consistent token use across every later prompt.
- **Always include an accessibility check in design-extraction prompts.** Visual fidelity is cheap to copy and easy to ship inaccessibly. Asking the agent to flag WCAG failures catches what the eye misses.
- **Mirror the design system into `CLAUDE.md`.** Once tokens were documented there, every later component prompt could just say "use design tokens" — no need to re-list the palette. This is what made the AnalysisScopeDialog prompt above so terse.

---

## 5. Error handling refactor — splitting GitHub vs AI rate limits

**Context:** Initial error handling lumped every failure into one generic "something went wrong" toast. As soon as the scoring engine moved to Groq, the failure modes diverged: GitHub API can 401 (bad token), 403 (rate limit / private repo), 404 (no such repo), 422 (no merged PRs), or hit the unauthenticated 60/h limit; the LLM call can fail JSON parsing, hit Groq quota, or time out. Users were getting a useless "Error: failed" for all of them.

**Prompt:**

> Refactor error handling end-to-end. Define a discriminated union `ApiError` in `src/types/api.ts` with explicit codes: `INVALID_URL`, `REPO_NOT_FOUND`, `RATE_LIMIT_GITHUB`, `RATE_LIMIT_AI`, `PRIVATE_REPO`, `NO_PRS`, `AI_PARSE_ERROR`, `AI_TIMEOUT`, `UNKNOWN`. In `lib/github.ts`, classify GitHub failures by status code (401 → token issue, 403 + `x-ratelimit-remaining: 0` → `RATE_LIMIT_GITHUB`, 403 otherwise → `PRIVATE_REPO`, 404 → `REPO_NOT_FOUND`). In `lib/scoring.ts`, classify Groq failures separately (`RATE_LIMIT_AI` for 429, `AI_PARSE_ERROR` for JSON failures, `AI_TIMEOUT` for >60s). API routes return the right HTTP status (400 / 403 / 404 / 429 / 504) and a JSON body `{ error: ApiError }`. Frontend `ErrorState` component shows a different message + suggested action per code (RATE_LIMIT_GITHUB → "Add a GitHub token to .env.local", PRIVATE_REPO → "Try a public repo", AI_TIMEOUT → "Try again in a moment", etc.). Add EN + PL strings for every code. Add Storybook stories for `ErrorState` covering every code.

**Result:** Each failure mode now has a distinct user-facing message in both languages, the right HTTP status, and a Storybook story. The agent correctly identified that `403 + x-ratelimit-remaining: 0` is the rate-limit signature versus a vanilla 403 (private repo) — easy to get wrong.

**Learning:**
- **Enumerate the error codes upfront — don't let the agent invent them.** Giving the discriminated union explicitly meant the rest of the refactor (API routes, frontend, translations, stories) all converged on the same vocabulary. Without it, you get four overlapping enums in different files.
- **Each error class needs its own Storybook story.** Otherwise some message variants ship untested. Bundling "add stories for every code" into the original prompt avoided a follow-up round.
- **Differentiating GitHub rate limits from LLM rate limits matters for UX.** They have different fixes ("add a token" vs "wait a minute"). Lumping them together would have left users guessing.
