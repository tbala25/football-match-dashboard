import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMatches, useCompetitions } from '../../lib/api';
import type { Match } from '../../types/statsbomb';

interface MatchListProps {
  className?: string;
}

export function MatchList({ className = '' }: MatchListProps) {
  const { competitionId, seasonId } = useParams<{
    competitionId: string;
    seasonId: string;
  }>();

  const compId = competitionId ? parseInt(competitionId) : undefined;
  const seasId = seasonId ? parseInt(seasonId) : undefined;

  const { data: matches, isLoading, error } = useMatches(compId, seasId);
  const { data: competitions } = useCompetitions();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'home' | 'away'>('date');

  // Find competition info
  const competition = useMemo(() => {
    if (!competitions) return null;
    return competitions.find(
      (c) => c.competition_id === compId && c.season_id === seasId
    );
  }, [competitions, compId, seasId]);

  // Filter and sort matches
  const filteredMatches = useMemo(() => {
    if (!matches) return [];

    let filtered = matches;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = matches.filter(
        (m) =>
          m.home_team.team_name.toLowerCase().includes(term) ||
          m.away_team.team_name.toLowerCase().includes(term)
      );
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.match_date).getTime() - new Date(a.match_date).getTime();
        case 'home':
          return a.home_team.team_name.localeCompare(b.home_team.team_name);
        case 'away':
          return a.away_team.team_name.localeCompare(b.away_team.team_name);
        default:
          return 0;
      }
    });
  }, [matches, searchTerm, sortBy]);

  // Group matches by date or matchweek
  const groupedMatches = useMemo(() => {
    const groups = new Map<string, Match[]>();

    for (const match of filteredMatches) {
      const key = match.match_week
        ? `Matchweek ${match.match_week}`
        : new Date(match.match_date).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          });

      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(match);
    }

    return groups;
  }, [filteredMatches]);

  if (isLoading) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 p-4 bg-red-50 rounded ${className}`}>
        Failed to load matches: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Competitions
        </Link>
        {competition && (
          <h1 className="text-2xl font-bold">
            {competition.competition_name} - {competition.season_name}
          </h1>
        )}
        <p className="text-gray-500">
          {matches?.length ?? 0} matches available
        </p>
      </div>

      {/* Search and sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="date">Sort by Date</option>
          <option value="home">Sort by Home Team</option>
          <option value="away">Sort by Away Team</option>
        </select>
      </div>

      {/* Match list */}
      <div className="space-y-6">
        {Array.from(groupedMatches.entries()).map(([group, groupMatches]) => (
          <div key={group}>
            <h2 className="text-sm font-semibold text-gray-500 mb-2">{group}</h2>
            <div className="space-y-2">
              {groupMatches.map((match) => (
                <MatchCard key={match.match_id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredMatches.length === 0 && (
        <div className="text-gray-500 text-center py-8">
          {searchTerm
            ? `No matches found for "${searchTerm}"`
            : 'No matches available for this competition'}
        </div>
      )}
    </div>
  );
}

interface MatchCardProps {
  match: Match;
}

function MatchCard({ match }: MatchCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link
      to={`/match/${match.match_id}`}
      state={{ match }}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
    >
      <div className="flex items-center justify-between">
        {/* Date and venue */}
        <div className="text-sm text-gray-500 w-24">
          <div>{formatDate(match.match_date)}</div>
          {match.kick_off && (
            <div className="text-xs">{match.kick_off.slice(0, 5)}</div>
          )}
        </div>

        {/* Teams and score */}
        <div className="flex-1 flex items-center justify-center gap-4">
          <div className="flex-1 text-right">
            <span className="font-medium">{match.home_team.team_name}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded font-bold">
            <span className="text-team-home">{match.home_score}</span>
            <span className="text-gray-400">-</span>
            <span className="text-team-away">{match.away_score}</span>
          </div>
          <div className="flex-1 text-left">
            <span className="font-medium">{match.away_team.team_name}</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="w-8 text-gray-400">
          <svg className="w-5 h-5 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Stage info */}
      {match.competition_stage && match.competition_stage.name !== 'Regular Season' && (
        <div className="mt-2 text-center">
          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
            {match.competition_stage.name}
          </span>
        </div>
      )}
    </Link>
  );
}

export default MatchList;
