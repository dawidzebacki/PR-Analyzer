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

## Issues & Fixes

<!-- Things that broke, what you tried, what worked -->

## AI Observations

<!-- Interesting prompts, when Claude Code nailed it, when it didn't, iterations needed -->

## Ideas for Later

<!-- Things you'd add in a next sprint -->