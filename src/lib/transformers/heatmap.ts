import type { Event, HeatmapData, HeatmapCell } from '../../types/statsbomb';
import { STATSBOMB_PITCH, getZone } from '../coordinates';

export interface HeatmapOptions {
  gridCols?: number;
  gridRows?: number;
  eventTypes?: string[];
  periodFilter?: number;
  normalize?: boolean;
}

export function buildHeatmap(
  events: Event[],
  teamId: number,
  options: HeatmapOptions = {}
): HeatmapData {
  const {
    gridCols = 12,
    gridRows = 8,
    eventTypes,
    periodFilter,
    normalize = true,
  } = options;

  // Initialize grid
  const grid: number[][] = Array(gridRows)
    .fill(0)
    .map(() => Array(gridCols).fill(0));

  // Filter events
  const filteredEvents = events.filter((e) => {
    if (e.team.id !== teamId) return false;
    if (!e.location) return false;
    if (periodFilter !== undefined && e.period !== periodFilter) return false;
    if (eventTypes && !eventTypes.includes(e.type.name)) return false;
    return true;
  });

  // Count events in each cell
  for (const event of filteredEvents) {
    const { col, row } = getZone(event.location![0], event.location![1], gridCols, gridRows);
    grid[row][col]++;
  }

  // Find max value
  let maxValue = 0;
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      maxValue = Math.max(maxValue, grid[row][col]);
    }
  }

  // Build cells
  const cells: HeatmapCell[] = [];
  const cellWidth = STATSBOMB_PITCH.width / gridCols;
  const cellHeight = STATSBOMB_PITCH.height / gridRows;

  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const value = normalize && maxValue > 0
        ? grid[row][col] / maxValue
        : grid[row][col];

      cells.push({
        x: col * cellWidth,
        y: row * cellHeight,
        value,
      });
    }
  }

  return {
    cells,
    maxValue,
    gridWidth: cellWidth,
    gridHeight: cellHeight,
  };
}

// Build touch heatmap (all events with locations)
export function buildTouchHeatmap(events: Event[], teamId: number, options: Omit<HeatmapOptions, 'eventTypes'> = {}): HeatmapData {
  return buildHeatmap(events, teamId, options);
}

// Build pass heatmap (pass start locations)
export function buildPassHeatmap(events: Event[], teamId: number, options: Omit<HeatmapOptions, 'eventTypes'> = {}): HeatmapData {
  return buildHeatmap(events, teamId, { ...options, eventTypes: ['Pass'] });
}

// Build shot heatmap
export function buildShotHeatmap(events: Event[], teamId: number, options: Omit<HeatmapOptions, 'eventTypes'> = {}): HeatmapData {
  return buildHeatmap(events, teamId, { ...options, eventTypes: ['Shot'] });
}

// Calculate field tilt (possession in final third)
export function calculateFieldTilt(events: Event[], homeTeamId: number, awayTeamId: number): {
  home: number;
  away: number;
} {
  const attackingThirdStart = (STATSBOMB_PITCH.width * 2) / 3;

  let homeInFinalThird = 0;
  let awayInFinalThird = 0;
  let totalActions = 0;

  for (const event of events) {
    if (!event.location) continue;
    if (event.team.id !== homeTeamId && event.team.id !== awayTeamId) continue;

    totalActions++;

    // For home team, attacking third is x >= 80
    // For away team, attacking third is x <= 40 (their perspective)
    if (event.team.id === homeTeamId && event.location[0] >= attackingThirdStart) {
      homeInFinalThird++;
    } else if (event.team.id === awayTeamId && event.location[0] <= STATSBOMB_PITCH.width - attackingThirdStart) {
      awayInFinalThird++;
    }
  }

  const total = homeInFinalThird + awayInFinalThird;
  if (total === 0) return { home: 50, away: 50 };

  return {
    home: (homeInFinalThird / total) * 100,
    away: (awayInFinalThird / total) * 100,
  };
}

// Build time-segmented heatmaps for field tilt over time
export function buildFieldTiltTimeline(
  events: Event[],
  homeTeamId: number,
  awayTeamId: number,
  segmentMinutes: number = 5
): { minute: number; home: number; away: number }[] {
  const segments: { minute: number; home: number; away: number }[] = [];
  const maxMinute = Math.max(...events.map((e) => e.minute + (e.period === 2 ? 45 : 0)));

  for (let startMinute = 0; startMinute <= maxMinute; startMinute += segmentMinutes) {
    const endMinute = startMinute + segmentMinutes;

    const segmentEvents = events.filter((e) => {
      const actualMinute = e.minute + (e.period === 2 ? 45 : 0);
      return actualMinute >= startMinute && actualMinute < endMinute;
    });

    const tilt = calculateFieldTilt(segmentEvents, homeTeamId, awayTeamId);
    segments.push({
      minute: startMinute,
      ...tilt,
    });
  }

  return segments;
}
