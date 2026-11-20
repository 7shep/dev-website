# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal developer portfolio website for Alex Shepherd. A single page with a monochrome gallery look, framed by a seeded generative-drawing engine. **DESIGN.md is the design source of truth.** Read it before any UI change.

## Tech Stack

- React 19 + TypeScript + Vite
- Custom CSS with semantic tokens (`src/index.css`, `src/collage.css`). Tailwind 3 is installed, but the site's styling lives in those two files.
- Manrope Variable + IBM Plex Mono, self-hosted via @fontsource
- react-icons (Tabler set)
- Vercel-style serverless functions in `api/` (song of the week, sports results)

## Commands

```bash
npm run dev           # Start dev server (Vite)
npm run build         # TypeScript check + production build
npm run preview       # Preview production build locally
npm run test:browser  # Playwright browser tests
```

## Architecture

- `src/App.tsx`: root. Header nav with active-section state, saved theme, and the sections in order.
- `src/components/`:
  - `Entrance.tsx`: once-per-session intro overlay
  - `Hero.tsx` + `HeroArtwork.tsx`: name and live flow-field artwork with pause control
  - `Projects.tsx`: project data. `ProjectCollage.tsx` renders the exhibits and the project `<dialog>`.
  - `GenerativeCover.tsx`: canvas drawing with `flow` / `grid` / `contour` variants
  - `Clubs.tsx`, `TechnicalStack.tsx`, `About.tsx` (+ `SongOfTheWeek.tsx`, `TeamExhibit.tsx`, `SportArt.tsx`), `Contact.tsx`, `Footer.tsx`
- `src/lib/generative.ts`: seeded generators. `src/lib/liveData.ts`: live song and sports data.
- `src/hooks/useReveal.ts`: scroll reveal (`reveal` / `reveal-group` + `visible`)

## Design rules

- Colours come from the tokens on `.portfolio` (`--surface`, `--raised`, `--text`, `--muted`, `--quiet`, `--line`). The one intentional exception is the fixed dark plate behind logos (see DESIGN.md).
- Nothing below 12px. Text contrast is at least 4.5:1 in both themes. Touch targets are at least 44px.
- Don't redesign the hero. The generative art frames the work and never replaces it.
