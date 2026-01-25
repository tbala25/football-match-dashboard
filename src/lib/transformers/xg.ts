import type { Event, ShotData, XGTimelinePoint } from '../../types/statsbomb';

export function extractShots(events: Event[]): ShotData[] {
  return events
    .filter((e) => e.type.name === 'Shot' && e.shot)
    .map((e) => ({
      id: e.id,
      playerId: e.player!.id,
      playerName: e.player!.name,
      teamId: e.team.id,
      x: e.location![0],
      y: e.location![1],
      xg: e.shot!.statsbomb_xg,
      outcome: e.shot!.outcome.name,
      minute: e.minute,
      period: e.period,
      bodyPart: e.shot!.body_part?.name ?? 'Unknown',
      technique: e.shot!.technique?.name ?? 'Unknown',
      isGoal: e.shot!.outcome.name === 'Goal',
    }));
}

export function buildXGTimeline(
  events: Event[],
  homeTeamId: number,
  awayTeamId: number
): XGTimelinePoint[] {
  const shots = extractShots(events).sort((a, b) => {
    const aMinute = a.minute + (a.period === 2 ? 45 : 0);
    const bMinute = b.minute + (b.period === 2 ? 45 : 0);
    return aMinute - bMinute;
  });

  const timeline: XGTimelinePoint[] = [
    { minute: 0, homeXG: 0, awayXG: 0, homeGoals: 0, awayGoals: 0 },
  ];

  let homeXG = 0;
  let awayXG = 0;
  let homeGoals = 0;
  let awayGoals = 0;

  for (const shot of shots) {
    const minute = shot.minute + (shot.period === 2 ? 45 : 0);
    const isHome = shot.teamId === homeTeamId;

    if (isHome) {
      homeXG += shot.xg;
      if (shot.isGoal) homeGoals++;
    } else {
      awayXG += shot.xg;
      if (shot.isGoal) awayGoals++;
    }

    timeline.push({
      minute,
      homeXG: Math.round(homeXG * 100) / 100,
      awayXG: Math.round(awayXG * 100) / 100,
      homeGoals,
      awayGoals,
      event: {
        team: isHome ? 'home' : 'away',
        player: shot.playerName,
        xg: shot.xg,
        isGoal: shot.isGoal,
      },
    });
  }

  return timeline;
}

export function getXGSummary(
  events: Event[],
  homeTeamId: number,
  awayTeamId: number
): {
  home: { xg: number; shots: number; onTarget: number; goals: number };
  away: { xg: number; shots: number; onTarget: number; goals: number };
} {
  const shots = extractShots(events);

  const homeShots = shots.filter((s) => s.teamId === homeTeamId);
  const awayShots = shots.filter((s) => s.teamId === awayTeamId);

  const onTargetOutcomes = ['Goal', 'Saved', 'Saved Off Target', 'Saved To Post'];

  return {
    home: {
      xg: Math.round(homeShots.reduce((sum, s) => sum + s.xg, 0) * 100) / 100,
      shots: homeShots.length,
      onTarget: homeShots.filter((s) => onTargetOutcomes.includes(s.outcome)).length,
      goals: homeShots.filter((s) => s.isGoal).length,
    },
    away: {
      xg: Math.round(awayShots.reduce((sum, s) => sum + s.xg, 0) * 100) / 100,
      shots: awayShots.length,
      onTarget: awayShots.filter((s) => onTargetOutcomes.includes(s.outcome)).length,
      goals: awayShots.filter((s) => s.isGoal).length,
    },
  };
}

// Get best chances (highest xG shots)
export function getBestChances(events: Event[], limit: number = 5): ShotData[] {
  return extractShots(events)
    .sort((a, b) => b.xg - a.xg)
    .slice(0, limit);
}

// Calculate shot conversion
export function getShotConversion(events: Event[], teamId: number): {
  total: number;
  goals: number;
  conversionRate: number;
  xgDifference: number;
} {
  const shots = extractShots(events).filter((s) => s.teamId === teamId);
  const goals = shots.filter((s) => s.isGoal).length;
  const totalXG = shots.reduce((sum, s) => sum + s.xg, 0);

  return {
    total: shots.length,
    goals,
    conversionRate: shots.length > 0 ? (goals / shots.length) * 100 : 0,
    xgDifference: goals - totalXG,
  };
}
