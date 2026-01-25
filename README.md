# Football Match Dashboard

A React-based interactive dashboard for visualizing football match data from StatsBomb Open Data. Features advanced visualizations including pass networks, shot maps, touch heatmaps, and match timelines.

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-teal)

## Features

### Match Visualizations
- **Pass Networks** - Interactive D3.js visualization showing player positions and passing connections
- **Shot Maps** - Team-separated rotated view with goal at top, showing xG values and shot outcomes
- **Touch Heatmaps** - Density visualization of player touches across the pitch
- **Territory Maps** - Spatial control analysis for each team

### Match Analysis
- **xG Timeline** - Cumulative expected goals chart over match duration
- **Possession Timeline** - Rolling possession percentage throughout the match
- **Match Statistics** - Comprehensive stats comparison (shots, passes, fouls, etc.)

### Team Information
- **Dynamic Team Colors** - 150+ teams with official colors and Wikipedia SVG logos
- **Three-Section Lineups** - Starting XI, Substituted On, and Did Not Play sections
- **Player Events** - Goals, assists, cards, and substitution indicators

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Visualizations**: D3.js + Custom SVG components
- **State Management**: TanStack Query (server state) + Zustand (UI state)
- **Routing**: React Router v6

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/tbala25/football-match-dashboard.git
cd football-match-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── pitch/          # Pitch visualizations
│   │   ├── Pitch.tsx           # Base pitch component
│   │   ├── PassNetwork.tsx     # Pass network visualization
│   │   ├── TeamShotMap.tsx     # Rotated team shot map
│   │   ├── Heatmap.tsx         # Touch heatmap
│   │   └── TerritoryMap.tsx    # Territorial control
│   ├── match/          # Match components
│   │   ├── MatchHeader.tsx     # Score and team display
│   │   ├── LineupTable.tsx     # Three-section lineup
│   │   ├── Timeline.tsx        # xG timeline chart
│   │   └── MatchStats.tsx      # Stats comparison
│   └── ui/             # Reusable UI components
├── lib/
│   ├── api.ts              # StatsBomb data fetching
│   ├── coordinates.ts      # Pitch coordinate mapping
│   ├── teamColors.ts       # Team colors & logos database
│   └── transformers/       # Data transformation utilities
├── pages/
│   ├── HomePage.tsx        # Competition browser
│   ├── SeasonPage.tsx      # Match list
│   └── MatchPageNew.tsx    # Main match view
└── types/
    └── statsbomb.ts        # TypeScript type definitions
```

## Data Source

This project uses [StatsBomb Open Data](https://github.com/statsbomb/open-data), which provides free football data for:
- FIFA World Cup matches
- Select league matches
- Women's football competitions

Data is fetched directly from the StatsBomb GitHub repository.

## Coordinate System

StatsBomb uses a 120x80 yard pitch coordinate system:
- Origin at bottom-left corner
- X-axis: 0-120 (left to right)
- Y-axis: 0-80 (bottom to top)

The `coordinates.ts` module provides utilities for mapping these coordinates to viewport dimensions, including rotated views for shot maps.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Screenshots

### Match View
The main match view features a three-column layout:
- Left sidebar: Home team pass network + lineup
- Center: Possession timeline, territory map, stats, shot maps
- Right sidebar: Away team pass network + lineup

### Shot Maps
Side-by-side rotated shot maps with:
- Goal positioned at top
- Shot size indicates xG value
- Filled circles for goals
- Team-specific colors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is for educational purposes. StatsBomb Open Data is subject to their [license terms](https://github.com/statsbomb/open-data/blob/master/LICENSE.pdf).

## Acknowledgments

- [StatsBomb](https://statsbomb.com/) for providing open football data
- Team colors sourced from official team websites and Wikipedia
- Team logos from Wikipedia Commons (SVG format)
