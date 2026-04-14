# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal developer portfolio website for Alex Shepherd. Single-page static site with a space/cosmic theme.

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v3 with a fully custom dark color system (Material You-style tokens)
- Material Symbols Outlined + Space Grotesk + Inter via Google Fonts CDN

## Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # TypeScript check + production build
npm run preview  # Preview production build locally
```

## Architecture

- `src/App.tsx` — root, renders all sections in order
- `src/components/` — one file per section:
  - `Hero.tsx` — full-screen landing with orbit rings, central sun, three planet nav nodes
  - `TechnicalStack.tsx` — three-column skills grid (Frontend / Backend / Tools)
  - `Projects.tsx` — project card grid
  - `Footer.tsx` — bottom bar
  - `ProgressIndicator.tsx` — fixed right-side scroll dots
- `src/index.css` — Tailwind directives + custom CSS classes (`star-field`, `orbit-path`, `material-symbols-outlined`)
- `tailwind.config.js` — full custom color palette (surface-*, primary, secondary, tertiary tokens) and font families

## Design tokens

Colors follow a Material You dark scheme. Key tokens: `primary` (#cc97ff purple), `secondary` (#00fbfb cyan), `tertiary` (#ff51fa pink), `background`/`surface-*` (near-black). All defined in `tailwind.config.js`.
