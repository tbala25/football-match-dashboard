interface FormResult {
  result: 'W' | 'D' | 'L';
  score?: string;
  opponent?: string;
}

interface TeamFormProps {
  results: FormResult[];
  teamName?: string;
  teamColor?: string;
  showPoints?: boolean;
  className?: string;
}

export function TeamForm({
  results,
  teamName,
  teamColor = '#1e40af',
  showPoints = true,
  className = '',
}: TeamFormProps) {
  const lastFive = results.slice(-5);

  const points = lastFive.reduce((sum, r) => {
    if (r.result === 'W') return sum + 3;
    if (r.result === 'D') return sum + 1;
    return sum;
  }, 0);

  const maxPoints = lastFive.length * 3;

  const getResultConfig = (result: 'W' | 'D' | 'L') => {
    switch (result) {
      case 'W':
        return { bgClass: 'bg-green-500', textColor: 'text-white', label: 'Win' };
      case 'D':
        return { bgClass: 'bg-gray-400', textColor: 'text-white', label: 'Draw' };
      case 'L':
        return { bgClass: 'bg-red-500', textColor: 'text-white', label: 'Loss' };
    }
  };

  return (
    <div className={className}>
      {teamName && (
        <div className="text-sm font-semibold mb-2" style={{ color: teamColor }}>
          {teamName}
        </div>
      )}
      <div className="flex items-center gap-1.5">
        {lastFive.map((result, i) => {
          const config = getResultConfig(result.result);
          return (
            <div
              key={i}
              className={`form-dot ${config.bgClass} ${config.textColor}`}
              title={`${config.label}${result.score ? ` (${result.score})` : ''}${result.opponent ? ` vs ${result.opponent}` : ''}`}
            >
              {result.result}
            </div>
          );
        })}
        {showPoints && (
          <div className="ml-2 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{points}</span>
            <span className="text-xs">/{maxPoints} pts</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function generateFormFromMatches(
  matches: { homeTeam: string; awayTeam: string; homeScore: number; awayScore: number }[],
  teamName: string
): FormResult[] {
  return matches.map(match => {
    const isHome = match.homeTeam === teamName;
    const teamScore = isHome ? match.homeScore : match.awayScore;
    const oppScore = isHome ? match.awayScore : match.homeScore;
    const opponent = isHome ? match.awayTeam : match.homeTeam;

    let result: 'W' | 'D' | 'L';
    if (teamScore > oppScore) result = 'W';
    else if (teamScore < oppScore) result = 'L';
    else result = 'D';

    return { result, score: `${teamScore}-${oppScore}`, opponent };
  });
}

export default TeamForm;
