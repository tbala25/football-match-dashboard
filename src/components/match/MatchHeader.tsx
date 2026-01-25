import type { Match } from '../../types/statsbomb';

interface MatchHeaderProps {
  match: Match;
  homeXG?: number;
  awayXG?: number;
  className?: string;
}

export function MatchHeader({ match, homeXG, awayXG, className = '' }: MatchHeaderProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // StatsBomb uses prefixed field names
  const homeTeamName = match.home_team?.home_team_name ?? match.home_team?.team_name ?? 'Home Team';
  const awayTeamName = match.away_team?.away_team_name ?? match.away_team?.team_name ?? 'Away Team';

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Competition and date */}
      <div className="text-center mb-4">
        <div className="text-sm text-gray-500 mb-1">
          {match.competition.competition_name} - {match.season.season_name}
        </div>
        <div className="text-sm text-gray-400">
          {formatDate(match.match_date)} | {match.stadium?.name ?? 'Unknown Venue'}
        </div>
      </div>

      {/* Score */}
      <div className="flex items-center justify-center gap-8">
        {/* Home team */}
        <div className="flex-1 text-right">
          <div className="text-xl font-bold text-gray-900">
            {homeTeamName}
          </div>
          {match.home_team?.managers?.[0] && (
            <div className="text-xs text-gray-400 mt-1">
              {match.home_team.managers[0].name}
            </div>
          )}
        </div>

        {/* Score display */}
        <div className="flex items-center gap-4">
          <div className="text-5xl font-bold text-team-home">
            {match.home_score}
          </div>
          <div className="text-2xl text-gray-300">-</div>
          <div className="text-5xl font-bold text-team-away">
            {match.away_score}
          </div>
        </div>

        {/* Away team */}
        <div className="flex-1 text-left">
          <div className="text-xl font-bold text-gray-900">
            {awayTeamName}
          </div>
          {match.away_team?.managers?.[0] && (
            <div className="text-xs text-gray-400 mt-1">
              {match.away_team.managers[0].name}
            </div>
          )}
        </div>
      </div>

      {/* xG display */}
      {(homeXG !== undefined || awayXG !== undefined) && (
        <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t">
          <div className="text-right flex-1">
            <span className="text-sm text-gray-500">xG: </span>
            <span className="font-semibold text-team-home">
              {homeXG?.toFixed(2) ?? '-'}
            </span>
          </div>
          <div className="w-24" />
          <div className="text-left flex-1">
            <span className="text-sm text-gray-500">xG: </span>
            <span className="font-semibold text-team-away">
              {awayXG?.toFixed(2) ?? '-'}
            </span>
          </div>
        </div>
      )}

      {/* Match info badges */}
      <div className="flex justify-center gap-2 mt-4">
        {match.competition_stage && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
            {match.competition_stage.name}
          </span>
        )}
        {match.match_week && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
            Matchweek {match.match_week}
          </span>
        )}
        {match.referee && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
            Ref: {match.referee.name}
          </span>
        )}
      </div>
    </div>
  );
}

export default MatchHeader;
