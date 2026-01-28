import type { Event } from '../../types/statsbomb';

export type DefensiveActionType = 'tackle' | 'interception' | 'recovery' | 'clearance' | 'block';

export interface DefensiveAction {
  id: string;
  type: DefensiveActionType;
  playerId: number;
  playerName: string;
  teamId: number;
  x: number;
  y: number;
  minute: number;
  period: number;
  outcome?: string;
}

export interface DefensiveSummary {
  tackles: number;
  interceptions: number;
  recoveries: number;
  clearances: number;
  blocks: number;
  total: number;
}

export function extractDefensiveActions(events: Event[], teamId: number): DefensiveAction[] {
  const actions: DefensiveAction[] = [];

  for (const e of events) {
    // Skip events from other teams, without location, or from penalty shootout
    if (e.team.id !== teamId || !e.location || e.period > 4) continue;

    const baseAction = {
      id: e.id,
      playerId: e.player?.id ?? 0,
      playerName: e.player?.name ?? 'Unknown',
      teamId: e.team.id,
      x: e.location[0],
      y: e.location[1],
      minute: e.minute,
      period: e.period,
    };

    // Duel with tackle outcome (won or lost)
    if (e.type.name === 'Duel' && e.duel?.type?.name === 'Tackle') {
      const outcome = e.duel?.outcome?.name;
      // Include all tackle attempts, outcome indicates result
      actions.push({
        ...baseAction,
        type: 'tackle',
        outcome: outcome,
      });
    }

    // Interception
    if (e.type.name === 'Interception') {
      actions.push({
        ...baseAction,
        type: 'interception',
        outcome: e.interception?.outcome?.name,
      });
    }

    // Ball Recovery
    if (e.type.name === 'Ball Recovery') {
      actions.push({
        ...baseAction,
        type: 'recovery',
      });
    }

    // Clearance
    if (e.type.name === 'Clearance') {
      actions.push({
        ...baseAction,
        type: 'clearance',
      });
    }

    // Block
    if (e.type.name === 'Block') {
      actions.push({
        ...baseAction,
        type: 'block',
      });
    }
  }

  return actions;
}

export function getDefensiveStats(actions: DefensiveAction[]): DefensiveSummary {
  const summary: DefensiveSummary = {
    tackles: 0,
    interceptions: 0,
    recoveries: 0,
    clearances: 0,
    blocks: 0,
    total: 0,
  };

  for (const action of actions) {
    switch (action.type) {
      case 'tackle':
        summary.tackles++;
        break;
      case 'interception':
        summary.interceptions++;
        break;
      case 'recovery':
        summary.recoveries++;
        break;
      case 'clearance':
        summary.clearances++;
        break;
      case 'block':
        summary.blocks++;
        break;
    }
  }

  summary.total = actions.length;
  return summary;
}

// Get top defenders by action count
export function getTopDefenders(
  actions: DefensiveAction[],
  limit: number = 5
): { playerId: number; playerName: string; count: number }[] {
  const playerCounts = new Map<number, { name: string; count: number }>();

  for (const action of actions) {
    const existing = playerCounts.get(action.playerId);
    if (existing) {
      existing.count++;
    } else {
      playerCounts.set(action.playerId, { name: action.playerName, count: 1 });
    }
  }

  return Array.from(playerCounts.entries())
    .map(([playerId, data]) => ({ playerId, playerName: data.name, count: data.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
