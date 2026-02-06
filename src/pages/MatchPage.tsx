import { useMemo } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useMatchData } from '../lib/api';
import { MatchHeader, Lineup, Timeline } from '../components/match';
import { PassNetwork, ShotMap, Heatmap } from '../components/pitch';
import { Tabs } from '../components/ui';
import { Loading, ErrorMessage } from '../components/ui';
import { buildPassNetwork, buildTouchHeatmap, extractShots, getXGSummary } from '../lib/transformers';
import { getTeamColors } from '../lib/teamColors';
import type { Match } from '../types/statsbomb';

export function MatchPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const location = useLocation();

  // Try to get match from location state, otherwise we'll need to find it
  const matchFromState = location.state?.match as Match | undefined;

  const { lineups, events, isLoading, isError, error } = useMatchData(
    matchId ? parseInt(matchId) : undefined
  );

  // If we don't have match from state, we need competition info to find it
  // For simplicity, we'll use the match from location state
  const match = matchFromState;

  // StatsBomb uses prefixed field names (home_team_id, home_team_name, etc.)
  const homeTeamId = match?.home_team?.home_team_id ?? match?.home_team?.team_id;
  const awayTeamId = match?.away_team?.away_team_id ?? match?.away_team?.team_id;
  const homeTeamName = match?.home_team?.home_team_name ?? match?.home_team?.team_name ?? 'Home';
  const awayTeamName = match?.away_team?.away_team_name ?? match?.away_team?.team_name ?? 'Away';

  // Get dynamic team colors
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

  const homeHeatmap = useMemo(() => {
    if (!events || !homeTeamId) return null;
    return buildTouchHeatmap(events, homeTeamId);
  }, [events, homeTeamId]);

  const awayHeatmap = useMemo(() => {
    if (!events || !awayTeamId) return null;
    return buildTouchHeatmap(events, awayTeamId);
  }, [events, awayTeamId]);

  if (!match) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Loading message="Loading match data..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ErrorMessage
          title="Failed to Load Match"
          message={(error as Error)?.message ?? 'Unknown error'}
        />
      </div>
    );
  }

  const visualizationTabs = [
    {
      id: 'shots',
      label: 'Shot Map',
      content: (
        <ShotMap
          shots={shots}
          homeTeamId={homeTeamId!}
          awayTeamId={awayTeamId!}
          homeColor={homeColor}
          awayColor={awayColor}
          showXGLabels
        />
      ),
    },
    {
      id: 'home-passes',
      label: `${homeTeamName} Passes`,
      content: homePassNetwork ? (
        <PassNetwork data={homePassNetwork} teamColor={homeColor} />
      ) : (
        <div className="text-gray-500">No pass data available</div>
      ),
    },
    {
      id: 'away-passes',
      label: `${awayTeamName} Passes`,
      content: awayPassNetwork ? (
        <PassNetwork data={awayPassNetwork} teamColor={awayColor} />
      ) : (
        <div className="text-gray-500">No pass data available</div>
      ),
    },
    {
      id: 'home-heatmap',
      label: `${homeTeamName} Touches`,
      content: homeHeatmap ? (
        <Heatmap data={homeHeatmap} teamColor={homeColor} />
      ) : (
        <div className="text-gray-500">No touch data available</div>
      ),
    },
    {
      id: 'away-heatmap',
      label: `${awayTeamName} Touches`,
      content: awayHeatmap ? (
        <Heatmap data={awayHeatmap} teamColor={awayColor} />
      ) : (
        <div className="text-gray-500">No touch data available</div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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
      <MatchHeader
        match={match}
        homeXG={xgSummary?.home.xg}
        awayXG={xgSummary?.away.xg}
        className="mb-6"
      />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Visualizations */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <Tabs tabs={visualizationTabs} defaultTab="shots" />
          </div>
        </div>

        {/* Right column - Timeline and stats */}
        <div className="space-y-6">
          {events && (
            <Timeline
              events={events}
              homeTeamId={homeTeamId!}
              awayTeamId={awayTeamId!}
              homeTeamName={homeTeamName}
              awayTeamName={awayTeamName}
              homeColor={homeColor}
              awayColor={awayColor}
            />
          )}
        </div>
      </div>

      {/* Lineups */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Lineups</h2>
        {lineups && events && (
          <Lineup
            lineups={lineups}
            events={events}
            homeTeamId={homeTeamId!}
            awayTeamId={awayTeamId!}
          />
        )}
      </div>
    </div>
  );
}

export default MatchPage;
