import type { Event, PassNetworkData, PassNetworkNode, PassNetworkLink, Lineup } from '../../types/statsbomb';

interface PlayerPassData {
  playerId: number;
  name: string;
  jerseyNumber?: number;
  locations: { x: number; y: number }[];
  passesTo: Map<number, { total: number; successful: number }>;
  totalPasses: number;
}

export function buildPassNetwork(
  events: Event[],
  lineups: Lineup[],
  teamId: number,
  options: {
    minPasses?: number;
    includeUnsuccessful?: boolean;
    periodFilter?: number;
  } = {}
): PassNetworkData {
  const { minPasses = 3, includeUnsuccessful = false, periodFilter } = options;

  // Get lineup for the team to find jersey numbers
  const teamLineup = lineups.find((l) => l.team_id === teamId);
  const jerseyNumbers = new Map<number, number>();
  if (teamLineup) {
    for (const player of teamLineup.lineup) {
      jerseyNumbers.set(player.player_id, player.jersey_number);
    }
  }

  // Filter passes for the team
  const passes = events.filter((e) => {
    if (e.type.name !== 'Pass') return false;
    if (e.team.id !== teamId) return false;
    if (!e.player) return false;
    if (!e.pass?.recipient) return false;
    if (periodFilter !== undefined && e.period !== periodFilter) return false;
    if (!includeUnsuccessful && e.pass.outcome) return false; // outcome means incomplete
    return true;
  });

  // Build player data
  const playerData = new Map<number, PlayerPassData>();

  for (const pass of passes) {
    const playerId = pass.player!.id;
    const recipientId = pass.pass!.recipient!.id;
    const isSuccessful = !pass.pass!.outcome;

    // Initialize sender if needed
    if (!playerData.has(playerId)) {
      playerData.set(playerId, {
        playerId,
        name: pass.player!.name,
        jerseyNumber: jerseyNumbers.get(playerId),
        locations: [],
        passesTo: new Map(),
        totalPasses: 0,
      });
    }

    // Initialize recipient if needed (for position calculation)
    if (!playerData.has(recipientId)) {
      playerData.set(recipientId, {
        playerId: recipientId,
        name: pass.pass!.recipient!.name,
        jerseyNumber: jerseyNumbers.get(recipientId),
        locations: [],
        passesTo: new Map(),
        totalPasses: 0,
      });
    }

    const senderData = playerData.get(playerId)!;
    const recipientData = playerData.get(recipientId)!;

    // Record pass location
    if (pass.location) {
      senderData.locations.push({ x: pass.location[0], y: pass.location[1] });
    }
    if (pass.pass!.end_location) {
      recipientData.locations.push({
        x: pass.pass!.end_location[0],
        y: pass.pass!.end_location[1],
      });
    }

    // Record pass connection
    if (!senderData.passesTo.has(recipientId)) {
      senderData.passesTo.set(recipientId, { total: 0, successful: 0 });
    }
    const connection = senderData.passesTo.get(recipientId)!;
    connection.total++;
    if (isSuccessful) connection.successful++;
    senderData.totalPasses++;
  }

  // Build nodes (only players with enough passes or receiving passes)
  const nodes: PassNetworkNode[] = [];
  for (const [, data] of playerData) {
    const hasEnoughPasses = data.totalPasses >= minPasses;
    const receivesEnoughPasses = Array.from(playerData.values()).some(
      (pd) => pd.passesTo.has(data.playerId) && (pd.passesTo.get(data.playerId)?.total ?? 0) >= minPasses
    );

    if (hasEnoughPasses || receivesEnoughPasses) {
      const avgX = data.locations.length > 0
        ? data.locations.reduce((sum, loc) => sum + loc.x, 0) / data.locations.length
        : 60;
      const avgY = data.locations.length > 0
        ? data.locations.reduce((sum, loc) => sum + loc.y, 0) / data.locations.length
        : 40;

      nodes.push({
        playerId: data.playerId,
        name: data.name,
        avgX,
        avgY,
        passCount: data.totalPasses,
        jerseyNumber: data.jerseyNumber,
      });
    }
  }

  // Build links (only between players who are both in nodes)
  const nodeIds = new Set(nodes.map((n) => n.playerId));
  const links: PassNetworkLink[] = [];

  for (const [, data] of playerData) {
    if (!nodeIds.has(data.playerId)) continue;

    for (const [targetId, connection] of data.passesTo) {
      if (!nodeIds.has(targetId)) continue;
      if (connection.total < minPasses) continue;

      links.push({
        source: data.playerId,
        target: targetId,
        count: connection.total,
        successRate: connection.total > 0 ? connection.successful / connection.total : 0,
      });
    }
  }

  return { nodes, links };
}

// Get total passes between two teams
export function getPassStats(events: Event[], teamId: number): {
  total: number;
  successful: number;
  accuracy: number;
} {
  const passes = events.filter((e) => e.type.name === 'Pass' && e.team.id === teamId);
  const successful = passes.filter((p) => !p.pass?.outcome);

  return {
    total: passes.length,
    successful: successful.length,
    accuracy: passes.length > 0 ? (successful.length / passes.length) * 100 : 0,
  };
}
