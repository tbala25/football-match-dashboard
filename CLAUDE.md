# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based football match dashboard that visualizes data from StatsBomb Open Data. Features include:
- Pass network visualizations
- Shot maps with xG (expected goals)
- Touch heatmaps
- Match timelines with possession and xG tracking
- Team lineups with player events (goals, assists, cards, substitutions)

## Development Commands

```bash
npm install    # Install dependencies
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
npm run lint   # Run ESLint
```

## Architecture

- **Frontend Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Visualizations:** D3.js (pitch rendering, pass networks), custom SVG/Canvas components
- **State Management:** TanStack Query (server state), Zustand (UI state)
- **Routing:** React Router v6

## Key Directories

```
src/
├── components/
│   ├── pitch/       # Pitch, PassNetwork, ShotMap, Heatmap
│   ├── match/       # MatchHeader, Lineup, Timeline
│   ├── browser/     # CompetitionList, MatchList
│   └── ui/          # Tabs, Loading, ErrorMessage
├── lib/
│   ├── api.ts           # StatsBomb data fetching with React Query hooks
│   ├── coordinates.ts   # Pitch coordinate mapping (120x80 -> viewport)
│   └── transformers/    # Data transformation for each visualization
├── pages/           # Route pages (Home, Season, Match)
└── types/
    └── statsbomb.ts # TypeScript types for StatsBomb data
```

## Data Source

Data is fetched directly from StatsBomb Open Data GitHub repository:
- `https://raw.githubusercontent.com/statsbomb/open-data/master/data/`
- Endpoints: `/competitions.json`, `/matches/{comp_id}/{season_id}.json`, `/events/{match_id}.json`, `/lineups/{match_id}.json`

## Coordinate System

StatsBomb uses a 120x80 yard pitch coordinate system with origin at bottom-left. The `coordinates.ts` module provides utilities for mapping to viewport coordinates.
