import { useMemo } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useMatchData } from '../lib/api';
import { MatchHeaderNew } from '../components/match/MatchHeaderNew';
import { LineupTable } from '../components/match/LineupTable';
import { PossessionTimeline } from '../components/match/PossessionTimeline';
import { MatchStats } from '../components/match/MatchStats';
import { VerticalPassNetwork } from '../components/pitch/VerticalPassNetwork';
import { TerritoryMap } from '../components/pitch/TerritoryMap';
import { CenteredShotMap } from '../components/pitch/CenteredShotMap';
import { Loading, ErrorMessage } from '../components/ui';
import { buildPassNetwork, extractShots, getXGSummary } from '../lib/transformers';
import { getTeamColors } from '../lib/teamColors';
import type { Match } from '../types/statsbomb';

export function MatchPageNew() {
  const { matchId } = useParams<{ matchId: string }>();
  const location = useLocation();

  const matchFromState = location.state?.match as Match | undefined;
  const match = matchFromState;

  const { lineups, events, isLoading, isError, error } = useMatchData(
    matchId ? parseInt(matchId) : undefined
  );

  const homeTeamId = match?.home_team?.home_team_id ?? match?.home_team?.team_id;
  const awayTeamId = match?.away_team?.away_team_id ?? match?.away_team?.team_id;
  const homeTeamName = match?.home_team?.home_team_name ?? match?.home_team?.team_name ?? 'Home';
  const awayTeamName = match?.away_team?.away_team_name ?? match?.away_team?.team_name ?? 'Away';

  // Get dynamic team colors based on team name
  const homeColors = useMemo(() => getTeamColors(homeTeamName), [homeTeamName]);
  const awayColors = useMemo(() => getTeamColors(awayTeamName), [awayTeamName]);
  const homeColor = homeColors.primary;
  const awayColor = awayColors.primary;

  // Build visualization data
  const homePassNetwork = useMemo(() => {
    if (!events || !lineups || !homeTeamId) return null;
    return buildPassNetwork(events, lineups, homeTeamId);
  }, [events, lineups, homeTeamId]);

  const awayPassNetwork = useMemo(() => {
    if (!events || !lineups || !awayTeamId) return null;
    return buildPassNetwork(events, lineups, awayTeamId);
  }, [events, lineups, awayTeamId]);

  const shots = useMemo(() => {
    if (!events) return [];
    return extractShots(events);
  }, [events]);

  const xgSummary = useMemo(() => {
    if (!events || !homeTeamId || !awayTeamId) return null;
    return getXGSummary(events, homeTeamId, awayTeamId);
  }, [events, homeTeamId, awayTeamId]);

  if (!match) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorMessage
          title="Match Not Found"
          message="Please navigate to this match from the competition list."
        />
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Go to Competitions
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Loading message="Loading match data..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorMessage
          title="Failed to Load Match"
          message={(error as Error)?.message ?? 'Unknown error'}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 bg-gray-50 min-h-screen">
      {/* Back navigation */}
      <Link
        to={`/competition/${match.competition.competition_id}/season/${match.season.season_id}`}
        className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Matches
      </Link>

      {/* Match header */}
      <MatchHeaderNew
        match={match}
        homeColor={homeColor}
        awayColor={awayColor}
        className="mb-4"
      />

      {/* Main three-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left column - Home team pass network + lineup */}
        <div className="lg:col-span-1">
          {homePassNetwork && (
            <VerticalPassNetwork
              data={homePassNetwork}
              teamColor={homeColor}
              teamName={homeTeamName}
              isAway={false}
            />
          )}
          {lineups && events && homeTeamId && (
            <LineupTable
              lineups={lineups}
              events={events}
              teamId={homeTeamId}
              className="mt-4"
            />
          )}
        </div>

        {/* Center column - Possession timeline, territory map, stats, shot map */}
        <div className="lg:col-span-2 space-y-4">
          {/* Possession timeline */}
          {events && homeTeamId && awayTeamId && (
            <PossessionTimeline
              events={events}
              homeTeamId={homeTeamId}
              awayTeamId={awayTeamId}
              homeColor={homeColor}
              awayColor={awayColor}
            />
          )}

          {/* Territory map */}
          {events && homeTeamId && awayTeamId && (
            <TerritoryMap
              events={events}
              homeTeamId={homeTeamId}
              awayTeamId={awayTeamId}
              homeColor={homeColor}
              awayColor={awayColor}
            />
          )}

          {/* Match stats */}
          {events && homeTeamId && awayTeamId && (
            <MatchStats
              events={events}
              homeTeamId={homeTeamId}
              awayTeamId={awayTeamId}
              homeColor={homeColor}
              awayColor={awayColor}
            />
          )}

          {/* Shot map */}
          {shots.length > 0 && homeTeamId && awayTeamId && (
            <CenteredShotMap
              shots={shots}
              homeTeamId={homeTeamId}
              awayTeamId={awayTeamId}
              homeXG={xgSummary?.home.xg ?? 0}
              awayXG={xgSummary?.away.xg ?? 0}
              homeColor={homeColor}
              awayColor={awayColor}
            />
          )}
        </div>

        {/* Right column - Away team pass network + lineup */}
        <div className="lg:col-span-1">
          {awayPassNetwork && (
            <VerticalPassNetwork
              data={awayPassNetwork}
              teamColor={awayColor}
              teamName={awayTeamName}
              isAway={true}
            />
          )}
          {lineups && events && awayTeamId && (
            <LineupTable
              lineups={lineups}
              events={events}
              teamId={awayTeamId}
              className="mt-4"
            />
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 py-4 border-t text-xs text-gray-400 flex flex-wrap gap-4 justify-center">
        <span>⚽ - Goal</span>
        <span>A - Assist</span>
        <span>
          <span className="inline-block w-2 h-3 bg-yellow-400 rounded-sm mr-1" />
          - Yellow card
        </span>
        <span>
          <span className="inline-block w-2 h-3 bg-red-600 rounded-sm mr-1" />
          - Red card
        </span>
        <span>▲ - Substituted on</span>
        <span>▼ - Substituted off</span>
      </div>
    </div>
  );
}

export default MatchPageNew;
