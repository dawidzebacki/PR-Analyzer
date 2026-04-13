# PR Analyzer

## About
Tool for analyzing GitHub pull requests. Scores PRs on Impact, AI-Leverage, and Quality.
Landing page style based on passport-photo.online (indigo/purple CTA, PT Serif headings, Inter body, light blue-tinted backgrounds).

## Stack
- **Framework:** Next.js 16 (App Router, `src/` directory)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4 + custom design tokens
- **Animations:** Framer Motion
- **Data fetching:** TanStack Query v5
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Storybook:** Storybook 10 (`@storybook/nextjs-vite`)
- **Icons:** Lucide React
- **i18n:** next-intl (prefix-based routing, en + pl)
- **LLM:** Groq API (`llama-3.3-70b-versatile`, JSON mode)
- **Runtime/Package manager:** Bun
- **Deploy:** Vercel

## Directory Structure
```
src/
├── app/
│   ├── [locale]/           # Locale-prefixed pages (en, pl)
│   │   ├── layout.tsx      # Root layout with NextIntlClientProvider
│   │   ├── page.tsx        # Landing page
│   │   └── results/[id]/
│   │       └── page.tsx    # Dashboard page
│   ├── api/                # API routes (outside [locale])
│   │   ├── analyze/        # POST — start repo analysis
│   │   └── results/[id]/   # GET — fetch results
│   └── globals.css
├── components/
│   ├── ui/                 # Reusable UI primitives (Button, Input, Card, Badge, etc.)
│   ├── landing/            # Landing page sections (Hero, HowItWorks, SocialProof, etc.)
│   ├── dashboard/          # Dashboard components (ScoreCard, PRList, RadarChart, etc.)
│   └── shared/             # Navbar, Footer, LocaleSwitcher, Container, LoadingState, ErrorState
├── hooks/                  # Custom React hooks (useAnalyze, useResults, etc.)
├── i18n/
│   ├── routing.ts          # Locale definitions (en, pl), defaultLocale
│   ├── request.ts          # Server-side getRequestConfig
│   └── navigation.ts       # Locale-aware Link, redirect, usePathname, useRouter
├── lib/                    # Business logic
│   ├── github.ts           # GitHub API client
│   ├── scoring.ts          # LLM scoring engine
│   ├── cache.ts            # In-memory cache
│   ├── prompts.ts          # LLM prompts
│   └── utils.ts            # Helpers
├── messages/
│   ├── en.json             # English translations (source of truth)
│   └── pl.json             # Polish translations
├── middleware.ts            # next-intl locale detection middleware
├── types/                  # TypeScript interfaces
│   ├── github.ts
│   ├── scoring.ts
│   └── api.ts
├── constants/              # Constants (colors, weights, limits)
│   └── index.ts
└── schemas/                # Zod schemas (validation)
    └── index.ts
```

## Workflow
- Before every commit: run `.claude/review.md` (review all changed files + run lint/tsc/build), report results, wait for user approval
- To create PR: run `.claude/create-pr.md` (self-review, checks, commit, push, open PR)

## Code Conventions

### Naming
- Components: PascalCase, named exports (exception: Next.js pages use default)
- Hooks: camelCase, prefix `use`
- Types/Interfaces: PascalCase, NO `I` prefix — just `PullRequest`, `ScoreResult`
- Component files: PascalCase.tsx (e.g., `ScoreCard.tsx`)
- Lib/hooks files: camelCase.ts (e.g., `useAnalyze.ts`)

### TypeScript
- Strict mode, no `any` (use `unknown` + type narrowing)
- Interfaces for objects, type aliases for unions and utility types
- Zod schemas for runtime validation, infer types from them

### React Components
- Functional components only
- Explicit `"use client"` on EVERY component using hooks/interactivity
- Props interface above component, not inline
- Destructure props in function parameter

### Styling (Tailwind)
- Mobile-first (no prefix = mobile, `md:` = tablet, `lg:` = desktop)
- Custom colors from design tokens, NEVER hardcoded hex values in JSX
- Spacing: use Tailwind scale (p-4, gap-6, etc.), not arbitrary values
- NEVER use `@apply` in CSS — only utility classes in JSX

### i18n (next-intl)
- NEVER hardcode user-facing strings — always use translation keys
- Use `useTranslations('namespace')` in components (works in both server and client components)
- Translation keys: nested by section, e.g. `hero.title`, `nav.howItWorks`
- Keep `en.json` as source of truth, `pl.json` as translation
- Use `Link` from `@/i18n/navigation` for locale-aware links (not `next/link`)
- Add both EN and PL translations when adding new user-facing text
- Font subsets include `latin-ext` for Polish characters
- In async server components, use `getTranslations` from `next-intl/server` (not `useTranslations`)

### Storybook
- Stories colocated with components as `ComponentName.stories.ts`
- Every UI primitive (`src/components/ui/*`) MUST have stories
- Landing/dashboard sections: stories encouraged
- Use Component Story Format (CSF3) with `satisfies Meta<typeof Component>`
- Import from `@storybook/nextjs-vite` (not `@storybook/react`)
- Cover: default state, all variants, interactive states (loading, disabled, error)

### Error Handling
- API routes: always try/catch, return proper HTTP status + JSON error
- Frontend: Error boundaries + error states in components
- Never swallow errors (empty catch)

### Git
- Commit messages: `type: description` (feat, fix, chore, docs, refactor, style)
- Tag `[ai]` in AI-generated commits
- NEVER squash commits
- NEVER force push to main

## Design System (extracted from passport-photo.online)

### Fonts
- **Headings:** PT Serif, Bold 700 (Google Fonts, preloaded, font-display: block)
- **Body/UI:** Inter, variable weight 100-900 (Google Fonts, preloaded, font-display: block)
- Configure both with next/font/google

### Colors (Tailwind config)
These are extracted from the actual passport-photo.online CSS variables:

```
primary:        #4E43E1   (hsla(244,72%,57%) — indigo/purple, main CTA buttons)
primary-hover:  #3B2FA0   (hsl(244,53%,44%) — darker purple on hover)
navy:           #1D253B   (hsla(224,34%,17%) — main text color, navbar text, footer)
black:          #000000   (hsla(0,0%,0%) — some headings use pure black)
accent-green:   #35BA80   (hsla(154,56%,47%) — Trustpilot, success states, valid)
accent-blue:    #0070F3   (hsla(217,100%,49%) — links)
background:     #EFF6FA   (hsla(197,54%,97%) — page background, light blue tint)
surface:        #FFFFFF   (white — cards, navbar, footer, secondary sections)
border:         #E8ECFC   (hsla(228,93%,95%) — light blue borders, separators)
text:           #1D253B   (same as navy — main body text)
text-muted:     #6B6F85   (hsla(229,11%,47%) — secondary text, descriptions — WCAG AA compliant)
text-secondary: #5C6370   (hsla(225,9%,43%) — inactive tabs, less prominent text)
error:          #E04E6A   (hsla(353,81%,63%) — error states)
error-bg:       #FDE8E8   (hsla(2,100%,95%) — error background)
```

### Typography Scale (from CSS)
Headings use PT Serif Bold, body uses Inter:

```
h1:
  desktop: font-size 4.5rem (72px), line-height 5rem (80px), letter-spacing -0.15rem, PT Serif 700
  mobile:  font-size 2.5rem (40px), line-height 2.875rem (46px), letter-spacing -0.08rem

h2:
  desktop: font-size 3rem (48px), line-height 3.375rem (54px), letter-spacing -0.1125rem, PT Serif 700
  mobile:  font-size 2rem (32px), line-height 2.375rem (38px), letter-spacing -0.0625rem

h3:
  desktop: font-size 2.5rem (40px), line-height 2.875rem (46px), letter-spacing -0.08rem, PT Serif 700
  mobile:  font-size 1.5rem (24px), line-height 1.875rem (30px), letter-spacing -0.0625rem

subtitle-medium:
  desktop: font-size 1.5rem (24px), line-height 1.875rem (30px), Inter 500, letter-spacing -0.047rem
  mobile:  font-size 1.125rem (18px), line-height 1.75rem (28px), Inter 400 or 500

body:
  font-size 1rem (16px), line-height 1.5rem (24px), Inter 400, letter-spacing -0.009rem

body-large:
  font-size 1.125rem (18px), line-height 1.75rem (28px), Inter 400

small:
  font-size 0.875rem (14px), line-height 1.25rem (20px), Inter 400

nav-item:
  desktop: font-size 16px, Inter 600, line-height 22px
  mobile:  font-size 18px, Inter 600

section-heading-small (subheadings like "As seen in"):
  font-size 0.875rem, Inter 400-500
```

### Layout
```
Container max-width:   1110px (main content)
Navbar max-width:      1440px
Horizontal padding:    18px (mobile/desktop base)
                       32px (navbar desktop padding)
Section spacing:       Varies, typically 80-120px vertical between sections
Navbar height:         100px (desktop), 66px (mobile)
```

### Border Radius
```
r-sm:   4px   (small elements, checkboxes)
r-md:   6px   (inputs, small cards)
r-lg:   8px   (buttons, cards, main elements)
r-xl:   12px  (larger cards, containers)
r-2xl:  16px  (document list container)
r-full: 36px  (pills, badges)
```

### Buttons (from CSS)
```
Primary:
  bg: primary (#4E43E1), color: white
  height: 60px, padding: 0 50px
  font: Inter 500, 1rem/1.5rem, letter-spacing: -0.019rem
  border-radius: 8px (NOT rounded-full)
  hover: primary-hover (#3B2FA0)
  disabled: bg #D8DBE5, color: #7B8494

Secondary:
  bg: transparent, color: navy (#1D253B), border: 1px solid navy
  hover: text color primary, border color primary

Small/CTA in navbar:
  padding: 8px 20px, auto height
```

### Spacing Scale
```
sp1: 5px    sp6: 30px    sp11: 55px
sp2: 10px   sp7: 35px    sp12: 64px
sp3: 15px   sp8: 40px    sp13: 65px
sp4: 20px   sp9: 45px    sp14: 70px
sp5: 25px   sp65: 32px   sp15: 75px
```

### Section Backgrounds
Sections alternate between two backgrounds:
- **Primary section bg:** hsla(197,54%,97%) — light blue tint (#EFF6FA)
- **Secondary section bg:** white (#FFFFFF)

### Navbar
- Sticky on scroll, white bg with subtle bottom shadow: `0 1px 0 0 hsla(228,93%,95%,1)`
- Logo left, menu items center/right
- CTA button appears in navbar on scroll (opacity transition)
- Mobile: hamburger menu, slide-in from right

### Footer
- White background with top border separator (hsla(228,93%,95%))
- Grid layout: Logo + 4 columns of links + app download card
- Bottom bar: legal links, language selector
- Link text: Inter 500, 0.875rem, color navy
- Category headers: Inter 600, 0.875rem
- "Get the App" card has bg: hsla(197,54%,97%) (same light blue)

### Key Visual Patterns from Screenshots
1. **Hero:** Left text + right image on desktop; centered text + CTA + image below on mobile
2. **Social proof:** "As seen in" row of gray media logos with horizontal separator below
3. **How it works:** 3 columns with illustrations, PT Serif headings, Inter descriptions
4. **Section separators:** Often full-width 1px lines in border color
5. **Cards:** White bg, rounded-xl (12px), subtle shadow, on light blue section bg
6. **Document cards:** Light blue bg (hsla(197,54%,97%)), rounded-xl, hover: slightly darker blue bg
7. **Rating section:** Two-column layout, PT Serif heading left, stars right

### Animations (Framer Motion)
- Fade in up: initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
- Stagger children: staggerChildren: 0.1
- Scroll trigger: whileInView with viewport={{ once: true }}
- Duration: 0.5s default, 0.3s for micro-interactions
- Easing: easeOut

## Scoring Model

### Dimensions (0-100 each)
| Dimension | Description | Weight |
|-----------|-------------|--------|
| Impact | Does the PR deliver real value? Meaningful changes vs trivial fixes | 0.35 |
| AI-Leverage | Is there evidence of AI-assisted development? Higher = better | 0.25 |
| Quality | Engineering quality: focus, cleanliness, tests, descriptions | 0.40 |

### Total Score
```
total = impact * 0.35 + aiLeverage * 0.25 + quality * 0.40
```

### Weight Rationale
- Quality (0.40) — highest because code ultimately needs to be good
- Impact (0.35) — important that PRs have business meaning
- AI-Leverage (0.25) — bonus for skillful AI usage, but not dominant

## Limits and Edge Cases
- Max 20 merged PRs per analysis (most recent)
- GitHub API: 60 req/h without token, 5000 with token
- Cache: in-memory Map, TTL 1 hour
- Analysis timeout: max 60s
- No merged PRs → clear message, suggest a different repo
- Private repo → access denied message
- Rate limit → message + suggest token
- Invalid URL → Zod validation on client side
