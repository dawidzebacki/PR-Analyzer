Create a new React component in the appropriate directory per CLAUDE.md.

Component name/description: $ARGUMENTS

Rules:
1. Read CLAUDE.md — sections "Code Conventions" and "Design System"
2. Read DESIGN-REFERENCE.md for visual style guidance
3. Place file in the correct directory (ui/, landing/, dashboard/, shared/)
4. TypeScript with explicit props interface
5. Add "use client" if the component uses hooks or event handlers
6. Named export (not default)
7. Style with Tailwind using design tokens (indigo primary, PT Serif headings, Inter body)
8. Add Framer Motion animations where appropriate (fade in, hover)
9. Mobile-first responsive design