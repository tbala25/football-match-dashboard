import { useQuery } from '@tanstack/react-query';
import type { Competition, Match, Lineup, Event } from '../types/statsbomb';

const STATSBOMB_BASE_URL = 'https://raw.githubusercontent.com/statsbomb/open-data/master/data';

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${STATSBOMB_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
  }
  return response.json();
}

// Fetch all competitions
export async function getCompetitions(): Promise<Competition[]> {
  return fetchJson<Competition[]>('/competitions.json');
}

// Fetch matches for a competition/season
export async function getMatches(competitionId: number, seasonId: number): Promise<Match[]> {
  return fetchJson<Match[]>(`/matches/${competitionId}/${seasonId}.json`);
}

// Fetch lineups for a match
export async function getLineups(matchId: number): Promise<Lineup[]> {
  return fetchJson<Lineup[]>(`/lineups/${matchId}.json`);
}

// Fetch events for a match
export async function getEvents(matchId: number): Promise<Event[]> {
  return fetchJson<Event[]>(`/events/${matchId}.json`);
}

// React Query hooks
export function useCompetitions() {
  return useQuery({
    queryKey: ['competitions'],
    queryFn: getCompetitions,
  });
}

export function useMatches(competitionId: number | undefined, seasonId: number | undefined) {
  return useQuery({
    queryKey: ['matches', competitionId, seasonId],
    queryFn: () => getMatches(competitionId!, seasonId!),
    enabled: !!competitionId && !!seasonId,
  });
}

export function useLineups(matchId: number | undefined) {
  return useQuery({
    queryKey: ['lineups', matchId],
    queryFn: () => getLineups(matchId!),
    enabled: !!matchId,
  });
}

export function useEvents(matchId: number | undefined) {
  return useQuery({
    queryKey: ['events', matchId],
    queryFn: () => getEvents(matchId!),
    enabled: !!matchId,
  });
}

// Combined match data hook
export function useMatchData(matchId: number | undefined) {
  const lineups = useLineups(matchId);
  const events = useEvents(matchId);

  return {
    lineups: lineups.data,
    events: events.data,
    isLoading: lineups.isLoading || events.isLoading,
    isError: lineups.isError || events.isError,
    error: lineups.error || events.error,
  };
}

// Group competitions by country and competition name
export function groupCompetitions(competitions: Competition[]): Map<string, Map<string, Competition[]>> {
  const grouped = new Map<string, Map<string, Competition[]>>();

  for (const comp of competitions) {
    if (!grouped.has(comp.country_name)) {
      grouped.set(comp.country_name, new Map());
    }
    const countryMap = grouped.get(comp.country_name)!;

    if (!countryMap.has(comp.competition_name)) {
      countryMap.set(comp.competition_name, []);
    }
    countryMap.get(comp.competition_name)!.push(comp);
  }

  return grouped;
}
