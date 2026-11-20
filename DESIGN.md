# Alex Shepherd portfolio

## Direction
A monochrome gallery for one person's work. Graphite surfaces, silver type, and one seeded generative-drawing engine that frames everything: the hero, each project, and the About exhibits. The art frames the work; it never replaces it.

The page reads as one catalogue: hero No. 00, projects No. 01–04, About exhibits No. 05–07. Clubs carry no numbers.

Design variance: 8/10. Motion: 4/10. Density: 3/10.
Custom CSS (src/index.css, src/collage.css) on React 19 / Vite / Tailwind 3.

## Palette and type
Semantic CSS variables on `.portfolio` in src/index.css are the source of truth. `data-theme` on `.portfolio` and on `<html>` switches them.

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| `--surface` | #0e0e0e | #efeee9 | page |
| `--raised` | #161616 | #e5e4de | frames, panels |
| `--text` | #ecebe6 | #1a1a1a | primary text |
| `--muted` | #9b9a95 | #5c5b56 | secondary text |
| `--quiet` | #8a8984 | #62615c | metadata, placard numbers (≥4.5:1 on surface) |
| `--line` | #2a2a2a | #cfcec8 | rules, borders |

Theme: starts from the system preference, and the header toggle overrides it. The choice is saved in localStorage `theme`. The `<html>` background and `meta[name=theme-color]` follow it.

Manrope Variable for display and body; IBM Plex Mono for metadata. Both self-hosted. **Nothing renders below 12px.**

## Composition
- **Hero (fixed, do not redesign):** the name in two planes over a live flow-field drawing seeded by "Alex Shepherd". `Shepherd` uses difference blending in dark mode. The pause control (44×44 circle) sits in the hero placard.
- **Entrance:** at most once per session (sessionStorage `intro-seen`), ≤1.5s, counts 2006 → the current year, and ends on "Alex Shepherd, building since 2006". Any key, click or scroll dismisses it. It is skipped under reduced motion.
- **Selected work:** four exhibits: wide, an offset pair, wide. Each real screenshot is inset (about 8%) inside a generative mat, and each project has its own variant: QWeb `grid`, MCP-Linter `code` (a code listing with lint squiggles), Universal `flow`, Prospect Predictor `contour` (the `cover` field in Projects.tsx). Square or logo images use `imageFit: "contain"`.
  - Screenshots are grayscale until hover or focus, and full colour on touch devices.
  - The card button opens a `<dialog>` with the screenshot, idea, role and stack. Visit/Source links sit on the card, outside the button.
  - ↗ is used only for links that leave the site.
- **Clubs:** two cards with role, summary, highlights and tags.
- **Skills:** three grouped lists.
- **About:** the statement, bio, resume download, and "Outside the browser": live song of the week (Spotify, `api/song-of-the-week.ts`) and Blue Jays / Steelers results (`api/sports.ts`). Each has a generative fallback when data is missing.
- **Contact:** an email link (alshe0644@gmail.com), resume download, LinkedIn and GitHub. The footer repeats GitHub and LinkedIn.
- **Header:** wordmark, four nav links, and two round 44px controls (`.icon-control`): GitHub (Tabler `TbBrandGithubFilled`), hidden at ≤420px, and the theme toggle.

## Generative engine
src/lib/generative.ts: `flowField` (hero, Universal, song fallback), `gridLines`, `contourLines`, `codeLines`, all deterministic from a string seed. GenerativeCover takes `variant`. SportArt draws the seam and gridiron studies. Canvases take their ink from CSS `color`, so they follow the theme.

## Interaction and accessibility
- Native links, buttons and `<dialog>`, which closes with Esc, a backdrop click or the X button. Visible focus and a skip link.
- Header nav marks the section in view with `aria-current="location"`, shown as an underline.
- Touch targets are at least 44px: nav, theme toggle, pause, card links, footer and contact links.
- Reduced motion disables the entrance, reveals and transforms. The hero art pauses offscreen, when the tab is hidden, and on request.
- No scroll hijacking, custom cursor or external model dependency.
- Sharp corners of 2px or less on rectangles; circles only for the header icon controls and the pause control.
- Logos use `imageFit: "contain"` on a fixed `#0e0e0e` plate in both themes, because white logo type needs a dark ground.
- Check at 320px, 390px, 768px and desktop, in both themes.

## Verification
- `npm run build`
- `npm run test:browser` (Playwright, local Chrome)
- Impeccable: `impeccable detect --json http://localhost:5173 --viewport 390x844` (and 1440x900)
