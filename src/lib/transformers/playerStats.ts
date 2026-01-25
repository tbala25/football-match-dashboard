import type { Event, Lineup, PlayerMatchStats } from '../../types/statsbomb';

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

    stats.set(player.player_id, {
      playerId: player.player_id,
      playerName: player.player_name,
      teamId,
      jerseyNumber: player.jersey_number,
      position: startPosition?.position ?? subIn?.position ?? 'Unknown',
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

    if (event.type.name === 'Shot' && event.shot?.outcome.name === 'Goal') {
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
        const timeParts = card.time.split(':');
        const minute = timeParts.length >= 2 ? parseInt(timeParts[1]) : 0;

        keyEvents.push({
          type: isRed ? 'red' : 'yellow',
          minute,
          period: card.period,
        });
      }
    }

    for (const position of player.positions) {
      if (position.start_reason === 'Substitution') {
        const fromParts = position.from.split(':');
        const minute = fromParts.length >= 2 ? parseInt(fromParts[1]) : 0;

        keyEvents.push({
          type: 'sub_in',
          minute,
          period: position.from_period,
        });
      }

      if (position.end_reason === 'Substitution' && position.to) {
        const toParts = position.to.split(':');
        const minute = toParts.length >= 2 ? parseInt(toParts[1]) : 0;

        keyEvents.push({
          type: 'sub_out',
          minute,
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
