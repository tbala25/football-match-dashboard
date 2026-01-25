import type { Match } from '../../types/statsbomb';

interface MatchHeaderProps {
  match: Match;
  homeColor?: string;
  awayColor?: string;
  className?: string;
}

export function MatchHeaderNew({
  match,
  homeColor = '#EF0107',
  awayColor = '#6CABDD',
  className = ''
}: MatchHeaderProps) {
  const homeTeamName = match.home_team?.home_team_name ?? match.home_team?.team_name ?? 'Home';
  const awayTeamName = match.away_team?.away_team_name ?? match.away_team?.team_name ?? 'Away';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={`${className}`}>
      {/* Team name bars */}
      <div className="flex">
        <div
          className="flex-1 py-2 px-4 text-white font-bold text-lg text-center"
          style={{ backgroundColor: homeColor }}
        >
          {homeTeamName}
        </div>
        <div
          className="flex-1 py-2 px-4 text-white font-bold text-lg text-center"
          style={{ backgroundColor: awayColor }}
        >
          {awayTeamName}
        </div>
      </div>

      {/* Score section */}
      <div className="bg-white py-4 px-6 flex items-center justify-center gap-8">
        {/* Home team logo placeholder */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs"
          style={{ backgroundColor: homeColor }}
        >
          {homeTeamName.substring(0, 3).toUpperCase()}
        </div>

        {/* Score */}
        <div className="text-center">
          <div className="text-5xl font-bold tracking-tight">
            {match.home_score} - {match.away_score}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {match.competition?.competition_name}
          </div>
          <div className="text-sm text-gray-400">
            {formatDate(match.match_date)}
          </div>
        </div>

        {/* Away team logo placeholder */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs"
          style={{ backgroundColor: awayColor }}
        >
          {awayTeamName.substring(0, 3).toUpperCase()}
        </div>
      </div>
    </div>
  );
}

export default MatchHeaderNew;
