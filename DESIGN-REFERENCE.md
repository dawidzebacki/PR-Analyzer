# Design Reference: passport-photo.online Style Adaptation

## CRITICAL: What's DIFFERENT from typical SaaS landing pages

### 1. TWO fonts, not one
- **PT Serif Bold 700** for ALL headings (h1, h2, h3) — this is a SERIF font
- **Inter** (variable weight) for everything else (body, buttons, nav, labels)
- This creates the distinctive "editorial/professional" feel of the site

### 2. Primary CTA is PURPLE/INDIGO, not green or blue
- Button color: `#4E43E1` (indigo) with white text
- Hover: `#3B2FA0` (darker)
- Border-radius: `8px` (NOT rounded-full/pill)
- Height: `60px`, padding: `0 50px`
- Green is only used as accent (success states, Trustpilot)

### 3. Page background is NOT white
- Main bg: `hsla(197, 54%, 97%, 1)` — very subtle light blue/cyan tint
- White is used for cards, navbar, and "secondary" sections
- Sections alternate between light-blue-bg and white-bg

### 4. Text color is dark navy, not black
- Primary text: `#1D253B` (dark navy/charcoal)
- Pure black `#000` is rarely used
- Muted text: `#8C8FA3` (blue-gray)

### 5. Headings have negative letter-spacing
- h1: `letter-spacing: -0.15rem` (very tight)
- h2: `letter-spacing: -0.1125rem`
- h3: `letter-spacing: -0.08rem`
- This creates the "dense, professional" heading style

## Tailwind Config Mapping

```ts
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4E43E1',  // indigo CTA
          hover: '#3B2FA0',    // darker on hover
          light: '#E8ECFC',    // very light indigo (borders)
        },
        navy: '#1D253B',       // main text, navbar
        accent: {
          green: '#35BA80',    // success, Trustpilot
          blue: '#0070F3',     // links
        },
        background: '#EFF6FA', // page bg (light blue tint)
        surface: '#FFFFFF',    // cards, white sections
        border: '#E8ECFC',     // separators
        'text-primary': '#1D253B',
        'text-muted': '#8C8FA3',
        'text-secondary': '#5C6370',
        error: '#E04E6A',
      },
      fontFamily: {
        serif: ['var(--font-pt-serif)', 'Georgia', 'serif'],     // headings
        sans: ['var(--font-inter)', 'Arial', 'sans-serif'],       // body
      },
      maxWidth: {
        'container': '1110px',
        'navbar': '1440px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        'pill': '36px',
      },
    },
  },
}
```

## Component Style Cheat Sheet

### Navbar
```
Sticky top, bg-surface, h-[100px] lg, h-[66px] mobile
shadow on scroll: shadow-[0_1px_0_0_#E8ECFC]
max-w-navbar mx-auto px-8
Logo left, nav items Inter 600 16px, CTA button appears on scroll
```

### Hero Section
```
Desktop: 2-column (text left 50%, image right 50%)
Mobile: centered text, CTA, image below
h1: font-serif text-[4.5rem]/[5rem] lg, text-[2.5rem]/[2.875rem] mobile
tracking-[-0.15rem] lg, tracking-[-0.08rem] mobile
Subtitle: font-sans font-medium text-2xl lg, text-lg mobile
CTA: bg-primary text-white h-[60px] px-[50px] rounded-lg
```

### Social Proof ("As seen in")
```
Row of gray logos, centered
"As seen in" label: text-sm font-sans text-text-muted
Logos at height 32px, grayscale
Full-width 1px border separator below
```

### How It Works
```
PT Serif bold h2 heading
3 columns (stack on mobile)
Illustration → heading (Inter 600, ~1.25-1.5rem) → description (Inter 400, 0.875-1.125rem)
Section bg: background (light blue)
```

### Cards
```
bg-surface rounded-xl p-6
Optional: border border-border
On light-blue bg section: cards are white
On white bg section: cards have subtle shadow or border
```

### Footer
```
bg-surface (white), border-t border-border
Grid: logo column + 4 link columns + "Get the App" card
"Get the App" card: bg-background rounded-2xl p-6
Links: font-sans text-sm font-medium text-navy
Section headers: font-sans text-sm font-semibold
Bottom bar: legal links in text-muted, language selector with green chevron
```

## Section Order (from screenshots)
1. **Navbar** (sticky)
2. **Hero** (bg: transparent/background)
3. **Spacing**
4. **Social Proof / As Seen In** (bg: transparent/background)
5. **Spacing**
6. **How It Works** (bg: background — light blue)
7. **Spacing**
8. **Rich Text / Content** (bg: surface — white)
9. **Testimonials/Quotes** (bg: surface — white)
10. **Documents section** (bg: background — light blue, white card container)
11. **Rating section** (bg: surface — white)
12. **Footer** (bg: surface — white)

## Adaptation Notes for PR Analyzer
Since we're building a GitHub PR analysis tool (not a photo tool), adapt like this:
- Hero: "Analyze Your GitHub PRs with AI" in PT Serif Bold, URL input instead of "Choose document"
- Social proof: Tech company logos (mockup text: "Vercel", "Stripe", etc.)
- How it works: 3 steps (Paste URL → AI Analyzes → View Results)
- Documents section → Scoring Dimensions section
- Rating section → CTA section
- Keep the same visual rhythm: alternating bg-background and bg-surface sections