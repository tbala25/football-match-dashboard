import type { Event, PossessionPeriod } from '../../types/statsbomb';

export function buildPossessionTimeline(events: Event[]): PossessionPeriod[] {
  if (events.length === 0) return [];

  const periods: PossessionPeriod[] = [];
  let currentPossession: number | null = null;
  let currentTeamId: number | null = null;
  let currentTeamName: string | null = null;
  let currentPeriod: number | null = null;
  let startMinute = 0;
  let startSecond = 0;

  for (const event of events) {
    if (currentPossession !== event.possession) {
      // End previous possession
      if (currentPossession !== null && currentTeamId !== null) {
        periods.push({
          startMinute,
          startSecond,
          endMinute: event.minute,
          endSecond: event.second,
          teamId: currentTeamId,
          teamName: currentTeamName!,
          period: currentPeriod!,
        });
      }

      // Start new possession
      currentPossession = event.possession;
      currentTeamId = event.possession_team.id;
      currentTeamName = event.possession_team.name;
      currentPeriod = event.period;
      startMinute = event.minute;
      startSecond = event.second;
    }
  }

  // Add final possession
  if (currentPossession !== null && currentTeamId !== null && events.length > 0) {
    const lastEvent = events[events.length - 1];
    periods.push({
      startMinute,
      startSecond,
      endMinute: lastEvent.minute,
      endSecond: lastEvent.second,
      teamId: currentTeamId,
      teamName: currentTeamName!,
      period: currentPeriod!,
    });
  }

  return periods;
}

export function calculatePossessionPercentage(
  events: Event[],
  homeTeamId: number,
  awayTeamId: number
): { home: number; away: number } {
  const possessions = buildPossessionTimeline(events);

  let homeDuration = 0;
  let awayDuration = 0;

  for (const possession of possessions) {
    const duration =
      (possession.endMinute - possession.startMinute) * 60 +
      (possession.endSecond - possession.startSecond);

    if (possession.teamId === homeTeamId) {
      homeDuration += duration;
    } else if (possession.teamId === awayTeamId) {
      awayDuration += duration;
    }
  }

  const total = homeDuration + awayDuration;
  if (total === 0) return { home: 50, away: 50 };

  return {
    home: Math.round((homeDuration / total) * 100),
    away: Math.round((awayDuration / total) * 100),
  };
}

// Get possession by period
export function getPossessionByPeriod(
  events: Event[],
  homeTeamId: number,
  awayTeamId: number
): { period: number; home: number; away: number }[] {
  const periods = [1, 2]; // Main periods
  const results: { period: number; home: number; away: number }[] = [];

  for (const period of periods) {
    const periodEvents = events.filter((e) => e.period === period);
    if (periodEvents.length > 0) {
      const possession = calculatePossessionPercentage(periodEvents, homeTeamId, awayTeamId);
      results.push({ period, ...possession });
    }
  }

  return results;
}

// Get rolling possession over time
export function getRollingPossession(
  events: Event[],
  homeTeamId: number,
  awayTeamId: number,
  windowMinutes: number = 5
): { minute: number; home: number; away: number }[] {
  const timeline: { minute: number; home: number; away: number }[] = [];
  const maxMinute = Math.max(...events.map((e) => e.minute + (e.period === 2 ? 45 : 0)));

  for (let minute = windowMinutes; minute <= maxMinute; minute++) {
    const windowStart = minute - windowMinutes;
    const windowEvents = events.filter((e) => {
      const actualMinute = e.minute + (e.period === 2 ? 45 : 0);
      return actualMinute >= windowStart && actualMinute < minute;
    });

    if (windowEvents.length > 0) {
      const possession = calculatePossessionPercentage(windowEvents, homeTeamId, awayTeamId);
      timeline.push({ minute, ...possession });
    }
  }

  return timeline;
}
