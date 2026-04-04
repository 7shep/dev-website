# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal developer portfolio website. Single-page site with a space/solar system theme built with React Three Fiber. Three sections — Skills, Projects, and About Me — represented as planets (Earth, Mars, Saturn). Clicking a planet zooms the camera in and reveals that section's content as a DOM overlay.

## Tech Stack

- React 19 + TypeScript + Vite
- React Three Fiber + @react-three/drei (3D solar system)
- Motion (Framer Motion) for DOM transitions
- Tailwind CSS v4

## Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # TypeScript check + production build
npm run preview  # Preview production build locally
```

## Architecture

- **Navigation state machine** (`src/hooks/usePlanetNavigation.ts`): Three states — `solar-system` → `zooming` → `section`. Provided via React context.
- **3D layer** (`src/components/SolarSystem/`): R3F Canvas with Sun, Planets, orbit rings, starfield, and a CameraController that lerps between overview and planet zoom positions.
- **DOM layer** (`src/components/Sections/`): SectionOverlay renders on top of the canvas with backdrop blur. Uses Motion's AnimatePresence for enter/exit.
- **Planet ↔ Section mapping**: Defined in `src/data/planets.ts`. Each planet config links to a section ID.
- **Planet discovery**: CameraController finds planets by traversing the scene for `userData.planetId`.

## Deployment

Configured for Vercel (auto-detects Vite). Three.js is code-split into a separate chunk.
