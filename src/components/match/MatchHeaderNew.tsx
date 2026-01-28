import { useState } from 'react';
import type { Match } from '../../types/statsbomb';
import { getTeamBranding } from '../../lib/teamColors';
import { MatchStatusBadge } from '../ui/MatchStatusBadge';

interface MatchHeaderProps {
  match: Match;
  homeXG?: number;
  awayXG?: number;
  homeShots?: number;
  awayShots?: number;
  homeShotsOnTarget?: number;
  awayShotsOnTarget?: number;
  homePenaltyScore?: number;
  awayPenaltyScore?: number;
  homeColor?: string;
  awayColor?: string;
  className?: string;
}

export function MatchHeaderNew({
  match,
  homeXG,
  awayXG,
  homeShots,
  awayShots,
  homeShotsOnTarget,
  awayShotsOnTarget,
  homePenaltyScore,
  awayPenaltyScore,
  homeColor = '#1e40af',
  awayColor = '#dc2626',
  className = ''
}: MatchHeaderProps) {
  const homeTeamName = match.home_team?.home_team_name ?? match.home_team?.team_name ?? 'Home';
  const awayTeamName = match.away_team?.away_team_name ?? match.away_team?.team_name ?? 'Away';

  // Get team branding including logo URLs
  const homeBranding = getTeamBranding(homeTeamName);
  const awayBranding = getTeamBranding(awayTeamName);

  // Track logo load errors to show fallback
  const [homeLogoError, setHomeLogoError] = useState(false);
  const [awayLogoError, setAwayLogoError] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Calculate xG bar widths
  const totalXG = (homeXG ?? 0) + (awayXG ?? 0);
  const homeXGPercent = totalXG > 0 ? ((homeXG ?? 0) / totalXG) * 100 : 50;

  // Render team logo or fallback
  const renderLogo = (
    logoUrl: string | undefined,
    teamName: string,
    color: string,
    hasError: boolean,
    onError: () => void
  ) => {
    if (logoUrl && !hasError) {
      return (
        <img
          src={logoUrl}
          alt={teamName}
          className="w-full h-full object-contain drop-shadow-md"
          referrerPolicy="no-referrer"
          loading="eager"
          onError={onError}
        />
      );
    }
    return (
      <div
        className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
        style={{ backgroundColor: color }}
      >
        {teamName.substring(0, 3).toUpperCase()}
      </div>
    );
  };

  return (
    <div className={`match-header-pro ${className}`}>
      {/* Competition header bar */}
      <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          {match.competition?.competition_name}
        </span>
        {match.competition_stage?.name && (
          <>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">
              {match.competition_stage.name}
            </span>
          </>
        )}
      </div>

      {/* Main score section with gradient background */}
      <div
        className="relative py-6 px-6"
        style={{
          background: `linear-gradient(135deg, ${homeColor}10 0%, transparent 50%, ${awayColor}10 100%)`
        }}
      >
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Home team */}
          <div className="flex flex-col items-center gap-2 w-32">
            <div className="w-16 h-16 flex items-center justify-center">
              {renderLogo(homeBranding.logoUrl, homeTeamName, homeColor, homeLogoError, () => setHomeLogoError(true))}
            </div>
            <span className="team-name-lg text-center max-w-full">{homeTeamName}</span>
          </div>

          {/* Score & Status */}
          <div className="flex flex-col items-center gap-2 px-4">
            <MatchStatusBadge status="finished" />
            <div className="score-xl flex items-center gap-3">
              <span style={{ color: homeColor }}>{match.home_score}</span>
              <span className="text-gray-300 text-4xl font-light">-</span>
              <span style={{ color: awayColor }}>{match.away_score}</span>
            </div>
            {homePenaltyScore !== undefined && awayPenaltyScore !== undefined && (
              <div className="text-sm text-gray-600 font-medium">
                ({homePenaltyScore} - {awayPenaltyScore} pens)
              </div>
            )}
            <div className="text-sm text-gray-500">
              {formatDate(match.match_date)}
            </div>
          </div>

          {/* Away team */}
          <div className="flex flex-col items-center gap-2 w-32">
            <div className="w-16 h-16 flex items-center justify-center">
              {renderLogo(awayBranding.logoUrl, awayTeamName, awayColor, awayLogoError, () => setAwayLogoError(true))}
            </div>
            <span className="team-name-lg text-center max-w-full">{awayTeamName}</span>
          </div>
        </div>

        {/* xG comparison bar */}
        {homeXG !== undefined && awayXG !== undefined && (
          <div className="mt-4 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-semibold" style={{ color: homeColor }}>
                {homeXG.toFixed(2)} xG
              </span>
              <span className="font-semibold" style={{ color: awayColor }}>
                {awayXG.toFixed(2)} xG
              </span>
            </div>
            <div className="xg-comparison-bar">
              <div className="flex h-full">
                <div
                  className="xg-comparison-fill"
                  style={{
                    width: `${homeXGPercent}%`,
                    backgroundColor: homeColor
                  }}
                />
                <div
                  className="xg-comparison-fill"
                  style={{
                    width: `${100 - homeXGPercent}%`,
                    backgroundColor: awayColor
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Shots stats */}
        {homeShots !== undefined && awayShots !== undefined && (
          <div className="mt-3 max-w-md mx-auto flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span>{homeShots} shots</span>
              {homeShotsOnTarget !== undefined && (
                <span className="text-gray-400">({homeShotsOnTarget} on target)</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {awayShotsOnTarget !== undefined && (
                <span className="text-gray-400">({awayShotsOnTarget} on target)</span>
              )}
              <span>{awayShots} shots</span>
            </div>
          </div>
        )}
      </div>

      {/* Venue & details footer */}
      {(match.stadium?.name || match.referee?.name) && (
        <div className="bg-gray-50 px-4 py-2 border-t flex items-center justify-center gap-4 text-sm text-gray-500">
          {match.stadium?.name && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {match.stadium.name}
            </span>
          )}
          {match.referee?.name && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {match.referee.name}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default MatchHeaderNew;
