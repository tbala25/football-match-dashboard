import type { Event, Lineup, PlayerMatchStats } from '../../types/statsbomb';

// Get position from Starting XI tactics event (filtered by team)
function getPositionFromTactics(events: Event[], playerId: number, teamId: number): string | undefined {
  const tacticsEvent = events.find(
    (e) => e.type.name === 'Starting XI' && e.tactics?.lineup && e.team.id === teamId
  );
  if (!tacticsEvent) return undefined;

  const playerTactics = tacticsEvent.tactics!.lineup.find(
    (p) => p.player.id === playerId
  );
  return playerTactics?.position?.name;
}

// Infer position from any event that has position data for this player
function inferPositionFromEvents(events: Event[], playerId: number): string | undefined {
  // Search all events for position data
  const eventWithPosition = events.find(
    (e) => e.player?.id === playerId && e.position?.name
  );
  if (eventWithPosition?.position?.name) {
    return eventWithPosition.position.name;
  }

  // Also check pass recipient, shot freeze frame, etc.
  for (const e of events) {
    // Check if player appears in any freeze frame
    if (e.shot?.freeze_frame) {
      const ffPlayer = e.shot.freeze_frame.find((p) => p.player?.id === playerId);
      if (ffPlayer?.position?.name) return ffPlayer.position.name;
    }
  }

  return undefined;
}

// Infer position from jersey number as last resort
function inferPositionFromJerseyNumber(jerseyNumber: number): string {
  // Common jersey number conventions
  if (jerseyNumber === 1) return 'Goalkeeper';
  if (jerseyNumber >= 2 && jerseyNumber <= 5) return 'Center Back';
  if (jerseyNumber >= 6 && jerseyNumber <= 8) return 'Center Midfield';
  if (jerseyNumber === 9 || jerseyNumber === 11) return 'Striker';
  if (jerseyNumber === 10) return 'Center Attacking Midfield';
  if (jerseyNumber >= 12 && jerseyNumber <= 23) return 'Center Midfield'; // Typical sub range
  return 'Center Midfield'; // Default fallback
}

export function buildPlayerStats(
  events: Event[],
  lineups: Lineup[],
  teamId: number
): PlayerMatchStats[] {
  const teamLineup = lineups.find((l) => l.team_id === teamId);
  if (!teamLineup) return [];

  const stats = new Map<number, PlayerMatchStats>();

  // Initialize stats from lineup
  for (const player of teamLineup.lineup) {
    const positions = player.positions || [];
    const startPosition = positions.find((p) => p.start_reason === 'Starting XI');
    const subIn = positions.find((p) => p.start_reason === 'Substitution');
    const subOut = positions.find((p) => p.end_reason === 'Substitution');

    // Parse time from "HH:MM:SS.mmm" format
    const parseTime = (timeStr: string | null): number | undefined => {
      if (!timeStr) return undefined;
      const parts = timeStr.split(':');
      if (parts.length >= 2) {
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
      }
      return undefined;
    };

    // Calculate minutes played
    let minutesPlayed = 0;
    for (const pos of positions) {
      const from = parseTime(pos.from) ?? 0;
      const to = parseTime(pos.to) ?? 90;
      minutesPlayed += Math.max(0, to - from);
    }

    // Get position with fallback chain: startPosition > subIn > tactics > event > jerseyNumber
    const tacticsPosition = getPositionFromTactics(events, player.player_id, teamId);
    const eventPosition = inferPositionFromEvents(events, player.player_id);
    const jerseyPosition = inferPositionFromJerseyNumber(player.jersey_number);
    const position = startPosition?.position
      ?? subIn?.position
      ?? tacticsPosition
      ?? eventPosition
      ?? jerseyPosition;

    stats.set(player.player_id, {
      playerId: player.player_id,
      playerName: player.player_name,
      playerNickname: player.player_nickname,
      teamId,
      jerseyNumber: player.jersey_number,
      position,
      minutesPlayed: Math.min(minutesPlayed, 90),
      goals: 0,
      assists: 0,
      shots: 0,
      xg: 0,
      passes: 0,
      passAccuracy: 0,
      touches: 0,
      cards: {
        yellow: player.cards.filter((c) => c.card_type === 'Yellow Card').length,
        red: player.cards.filter((c) => c.card_type === 'Red Card' || c.card_type === 'Second Yellow').length,
      },
      substitutedIn: subIn ? parseTime(subIn.from) : undefined,
      substitutedOut: subOut ? parseTime(subOut.to) : undefined,
    });
  }

  // Process events
  for (const event of events) {
    if (event.team.id !== teamId) continue;
    if (!event.player) continue;

    const playerId = event.player.id;
    const playerStats = stats.get(playerId);
    if (!playerStats) continue;

    // Count touches (any event with a location)
    if (event.location) {
      playerStats.touches++;
    }

    // Process by event type
    switch (event.type.name) {
      case 'Shot':
        playerStats.shots++;
        playerStats.xg += event.shot?.statsbomb_xg ?? 0;
        if (event.shot?.outcome.name === 'Goal') {
          playerStats.goals++;
        }
        break;

      case 'Pass':
        playerStats.passes++;
        if (event.pass?.goal_assist) {
          playerStats.assists++;
        }
        break;
    }
  }

  // Calculate pass accuracy
  for (const [playerId, playerStats] of stats) {
    const passes = events.filter(
      (e) => e.type.name === 'Pass' && e.player?.id === playerId && e.team.id === teamId
    );
    const successfulPasses = passes.filter((p) => !p.pass?.outcome);
    playerStats.passAccuracy = passes.length > 0
      ? Math.round((successfulPasses.length / passes.length) * 100)
      : 0;
  }

  return Array.from(stats.values()).sort((a, b) => {
    // Sort by: starters first, then by position
    const aStarter = a.substitutedIn === undefined;
    const bStarter = b.substitutedIn === undefined;
    if (aStarter !== bStarter) return aStarter ? -1 : 1;
    return a.jerseyNumber - b.jerseyNumber;
  });
}

// Get key events for a player (goals, assists, cards)
export function getPlayerKeyEvents(
  events: Event[],
  lineups: Lineup[],
  playerId: number
): {
  type: 'goal' | 'assist' | 'yellow' | 'red' | 'sub_in' | 'sub_out';
  minute: number;
  period: number;
  detail?: string;
}[] {
  const keyEvents: {
    type: 'goal' | 'assist' | 'yellow' | 'red' | 'sub_in' | 'sub_out';
    minute: number;
    period: number;
    detail?: string;
  }[] = [];

  // Goals and assists from events
  for (const event of events) {
    if (event.player?.id !== playerId) continue;

    // Exclude penalty shootout goals (period 5)
    if (event.type.name === 'Shot' && event.shot?.outcome.name === 'Goal' && event.period !== 5) {
      keyEvents.push({
        type: 'goal',
        minute: event.minute,
        period: event.period,
      });
    }

    if (event.type.name === 'Pass' && event.pass?.goal_assist) {
      keyEvents.push({
        type: 'assist',
        minute: event.minute,
        period: event.period,
      });
    }
  }

  // Cards and substitutions from lineups
  for (const lineup of lineups) {
    const player = lineup.lineup.find((p) => p.player_id === playerId);
    if (!player) continue;

    for (const card of player.cards) {
      const isYellow = card.card_type === 'Yellow Card';
      const isRed = card.card_type === 'Red Card' || card.card_type === 'Second Yellow';

      if (isYellow || isRed) {
        // Time format is "HH:MM:SS.mmm" - calculate full minutes from hours and minutes
        const timeParts = card.time.split(':');
        const minute = timeParts.length >= 2
          ? parseInt(timeParts[0]) * 60 + parseInt(timeParts[1])
          : 0;

        keyEvents.push({
          type: isRed ? 'red' : 'yellow',
          minute,
          period: card.period,
        });
      }
    }

    for (const position of player.positions) {
      if (position.start_reason === 'Substitution') {
        // Time format is "HH:MM:SS.mmm" - calculate full minutes
        const fromParts = position.from.split(':');
        const subInMinute = fromParts.length >= 2
          ? parseInt(fromParts[0]) * 60 + parseInt(fromParts[1])
          : 0;

        keyEvents.push({
          type: 'sub_in',
          minute: subInMinute,
          period: position.from_period,
        });
      }

      if (position.end_reason === 'Substitution' && position.to) {
        // Time format is "HH:MM:SS.mmm" - calculate full minutes
        const toParts = position.to.split(':');
        const subOutMinute = toParts.length >= 2
          ? parseInt(toParts[0]) * 60 + parseInt(toParts[1])
          : 0;

        keyEvents.push({
          type: 'sub_out',
          minute: subOutMinute,
          period: position.to_period!,
        });
      }
    }
  }

  return keyEvents.sort((a, b) => {
    const aMinute = a.minute + (a.period === 2 ? 45 : 0);
    const bMinute = b.minute + (b.period === 2 ? 45 : 0);
    return aMinute - bMinute;
  });
}

// Get match summary stats
export function getMatchSummaryStats(
  events: Event[],
  homeTeamId: number,
  awayTeamId: number
): {
  home: { fouls: number; corners: number; offsides: number };
  away: { fouls: number; corners: number; offsides: number };
} {
  const countEvents = (teamId: number, eventType: string) =>
    events.filter((e) => e.team.id === teamId && e.type.name === eventType).length;

  const countCorners = (teamId: number) =>
    events.filter(
      (e) =>
        e.team.id === teamId &&
        e.type.name === 'Pass' &&
        e.pass?.type?.name === 'Corner'
    ).length;

  return {
    home: {
      fouls: countEvents(homeTeamId, 'Foul Committed'),
      corners: countCorners(homeTeamId),
      offsides: countEvents(homeTeamId, 'Offside'),
    },
    away: {
      fouls: countEvents(awayTeamId, 'Foul Committed'),
      corners: countCorners(awayTeamId),
      offsides: countEvents(awayTeamId, 'Offside'),
    },
  };
}
