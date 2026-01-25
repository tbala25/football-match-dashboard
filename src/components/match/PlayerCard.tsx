import { useState } from 'react';
import type { PlayerMatchStats } from '../../types/statsbomb';

interface PlayerCardProps {
  player: PlayerMatchStats;
  teamColor?: string;
  expanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function PlayerCard({
  player,
  teamColor = '#1e40af',
  expanded = false,
  onToggle,
  className = '',
}: PlayerCardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    onToggle?.();
  };

  const isStarter = player.substitutedIn === undefined;
  const isSub = player.substitutedIn !== undefined;

  return (
    <div
      className={`bg-white rounded-lg border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md ${className}`}
      onClick={handleToggle}
    >
      <div className="flex items-center gap-3 p-3 cursor-pointer">
        <div className="jersey-badge flex-shrink-0" style={{ backgroundColor: teamColor }}>
          {player.jerseyNumber}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 truncate">{player.playerName}</span>
            {!isStarter && <span className="text-xs text-gray-400">({player.substitutedIn}')</span>}
          </div>
          <div className="text-xs text-gray-500">
            {player.position}
            {player.minutesPlayed > 0 && <span className="ml-2">{player.minutesPlayed} min</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {player.goals > 0 && (
            <StatBadge
              icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>}
              value={player.goals}
              color="text-green-600"
              bgColor="bg-green-100"
            />
          )}

          {player.assists > 0 && (
            <StatBadge
              icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
              value={player.assists}
              color="text-blue-600"
              bgColor="bg-blue-100"
            />
          )}

          {player.cards.yellow > 0 && <div className="w-4 h-5 bg-yellow-400 rounded-sm" />}
          {player.cards.red > 0 && <div className="w-4 h-5 bg-red-500 rounded-sm" />}

          {player.substitutedOut !== undefined && (
            <div className="text-red-400" title={`Subbed off ${player.substitutedOut}'`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" /></svg>
            </div>
          )}

          {isSub && (
            <div className="text-green-500" title={`Subbed on ${player.substitutedIn}'`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" /></svg>
            </div>
          )}

          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="px-3 pb-3 pt-2 border-t border-gray-100 bg-gray-50 animate-fade-in">
          <div className="grid grid-cols-4 gap-3">
            <DetailStat label="Shots" value={player.shots} />
            <DetailStat label="xG" value={player.xg.toFixed(2)} />
            <DetailStat label="Passes" value={player.passes} />
            <DetailStat label="Pass %" value={`${player.passAccuracy}%`} />
            <DetailStat label="Touches" value={player.touches} />
            <DetailStat label="Minutes" value={player.minutesPlayed} />
          </div>
        </div>
      )}
    </div>
  );
}

interface StatBadgeProps {
  icon: React.ReactNode;
  value: number;
  color: string;
  bgColor: string;
}

function StatBadge({ icon, value, color, bgColor }: StatBadgeProps) {
  return (
    <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded ${bgColor} ${color}`}>
      {icon}
      <span className="text-xs font-bold">{value}</span>
    </div>
  );
}

interface DetailStatProps {
  label: string;
  value: string | number;
}

function DetailStat({ label, value }: DetailStatProps) {
  return (
    <div className="text-center">
      <div className="text-sm font-semibold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

export default PlayerCard;
