import type { Event } from '../../types/statsbomb';

export type PassType = 'through_ball' | 'cross' | 'switch' | 'long_ball' | 'progressive';

export interface PassTypeData {
  type: PassType;
  label: string;
  count: number;
  successful: number;
  successRate: number;
}

export interface PassTypeSummary {
  passTypes: PassTypeData[];
  totalPasses: number;
  totalSuccessful: number;
  overallSuccessRate: number;
}

// Calculate if a pass is progressive (moves ball 10+ yards toward opponent goal)
function isProgressivePass(startX: number, endX: number): boolean {
  // In StatsBomb coords, x increases toward opponent goal (0 = own goal line, 120 = opponent goal line)
  const progressDistance = endX - startX;
  return progressDistance >= 10; // 10+ yards toward goal
}

export function analyzePassTypes(events: Event[], teamId: number): PassTypeSummary {
  const passEvents = events.filter(
    (e) =>
      e.type.name === 'Pass' &&
      e.team.id === teamId &&
      e.pass &&
      e.location &&
      e.period <= 4 // Exclude penalty shootout
  );

  // Initialize counters
  const counts: Record<PassType, { total: number; successful: number }> = {
    through_ball: { total: 0, successful: 0 },
    cross: { total: 0, successful: 0 },
    switch: { total: 0, successful: 0 },
    long_ball: { total: 0, successful: 0 },
    progressive: { total: 0, successful: 0 },
  };

  for (const e of passEvents) {
    const pass = e.pass!;
    const isSuccessful = !pass.outcome; // No outcome = successful pass

    // Through ball
    if (pass.through_ball) {
      counts.through_ball.total++;
      if (isSuccessful) counts.through_ball.successful++;
    }

    // Cross
    if (pass.cross) {
      counts.cross.total++;
      if (isSuccessful) counts.cross.successful++;
    }

    // Switch (side-to-side pass)
    if (pass.switch) {
      counts.switch.total++;
      if (isSuccessful) counts.switch.successful++;
    }

    // Long ball (32+ yards)
    if (pass.length > 32) {
      counts.long_ball.total++;
      if (isSuccessful) counts.long_ball.successful++;
    }

    // Progressive pass (10+ yards toward goal)
    const startX = e.location![0];
    const endX = pass.end_location[0];
    if (isProgressivePass(startX, endX)) {
      counts.progressive.total++;
      if (isSuccessful) counts.progressive.successful++;
    }
  }

  const labels: Record<PassType, string> = {
    through_ball: 'Through Balls',
    cross: 'Crosses',
    switch: 'Switches',
    long_ball: 'Long Balls',
    progressive: 'Progressive',
  };

  const passTypes: PassTypeData[] = (Object.keys(counts) as PassType[]).map((type) => ({
    type,
    label: labels[type],
    count: counts[type].total,
    successful: counts[type].successful,
    successRate: counts[type].total > 0 ? (counts[type].successful / counts[type].total) * 100 : 0,
  }));

  // Calculate overall stats
  const totalPasses = passEvents.length;
  const totalSuccessful = passEvents.filter((e) => !e.pass?.outcome).length;

  return {
    passTypes,
    totalPasses,
    totalSuccessful,
    overallSuccessRate: totalPasses > 0 ? (totalSuccessful / totalPasses) * 100 : 0,
  };
}

// Get top passers of a specific type
export function getTopPassers(
  events: Event[],
  teamId: number,
  passType: PassType,
  limit: number = 3
): { playerId: number; playerName: string; count: number }[] {
  const passEvents = events.filter(
    (e) =>
      e.type.name === 'Pass' &&
      e.team.id === teamId &&
      e.pass &&
      e.location &&
      e.period <= 4
  );

  const playerCounts = new Map<number, { name: string; count: number }>();

  for (const e of passEvents) {
    const pass = e.pass!;
    let matches = false;

    switch (passType) {
      case 'through_ball':
        matches = !!pass.through_ball;
        break;
      case 'cross':
        matches = !!pass.cross;
        break;
      case 'switch':
        matches = !!pass.switch;
        break;
      case 'long_ball':
        matches = pass.length > 32;
        break;
      case 'progressive':
        matches = isProgressivePass(e.location![0], pass.end_location[0]);
        break;
    }

    if (matches && e.player) {
      const existing = playerCounts.get(e.player.id);
      if (existing) {
        existing.count++;
      } else {
        playerCounts.set(e.player.id, { name: e.player.name, count: 1 });
      }
    }
  }

  return Array.from(playerCounts.entries())
    .map(([playerId, data]) => ({ playerId, playerName: data.name, count: data.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
