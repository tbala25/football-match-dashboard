import { useMemo } from 'react';

interface Player {
  id: number;
  name: string;
  jerseyNumber: number;
  position: string;
}

interface FormationDisplayProps {
  formation: string;
  players: Player[];
  teamColor?: string;
  teamName?: string;
  isAway?: boolean;
  className?: string;
}

const FORMATION_POSITIONS: Record<string, { x: number; y: number }[]> = {
  '4-4-2': [
    { x: 5, y: 50 },
    { x: 20, y: 15 }, { x: 20, y: 38 }, { x: 20, y: 62 }, { x: 20, y: 85 },
    { x: 45, y: 15 }, { x: 45, y: 38 }, { x: 45, y: 62 }, { x: 45, y: 85 },
    { x: 75, y: 35 }, { x: 75, y: 65 },
  ],
  '4-3-3': [
    { x: 5, y: 50 },
    { x: 20, y: 15 }, { x: 20, y: 38 }, { x: 20, y: 62 }, { x: 20, y: 85 },
    { x: 45, y: 25 }, { x: 45, y: 50 }, { x: 45, y: 75 },
    { x: 75, y: 20 }, { x: 75, y: 50 }, { x: 75, y: 80 },
  ],
  '3-5-2': [
    { x: 5, y: 50 },
    { x: 20, y: 25 }, { x: 20, y: 50 }, { x: 20, y: 75 },
    { x: 40, y: 10 }, { x: 40, y: 35 }, { x: 40, y: 50 }, { x: 40, y: 65 }, { x: 40, y: 90 },
    { x: 75, y: 35 }, { x: 75, y: 65 },
  ],
  '4-2-3-1': [
    { x: 5, y: 50 },
    { x: 20, y: 15 }, { x: 20, y: 38 }, { x: 20, y: 62 }, { x: 20, y: 85 },
    { x: 38, y: 35 }, { x: 38, y: 65 },
    { x: 55, y: 20 }, { x: 55, y: 50 }, { x: 55, y: 80 },
    { x: 78, y: 50 },
  ],
  '3-4-3': [
    { x: 5, y: 50 },
    { x: 20, y: 25 }, { x: 20, y: 50 }, { x: 20, y: 75 },
    { x: 45, y: 15 }, { x: 45, y: 40 }, { x: 45, y: 60 }, { x: 45, y: 85 },
    { x: 75, y: 20 }, { x: 75, y: 50 }, { x: 75, y: 80 },
  ],
  '5-3-2': [
    { x: 5, y: 50 },
    { x: 18, y: 10 }, { x: 20, y: 30 }, { x: 20, y: 50 }, { x: 20, y: 70 }, { x: 18, y: 90 },
    { x: 45, y: 25 }, { x: 45, y: 50 }, { x: 45, y: 75 },
    { x: 75, y: 35 }, { x: 75, y: 65 },
  ],
  '4-1-4-1': [
    { x: 5, y: 50 },
    { x: 20, y: 15 }, { x: 20, y: 38 }, { x: 20, y: 62 }, { x: 20, y: 85 },
    { x: 35, y: 50 },
    { x: 55, y: 15 }, { x: 55, y: 38 }, { x: 55, y: 62 }, { x: 55, y: 85 },
    { x: 78, y: 50 },
  ],
};

export function FormationDisplay({
  formation,
  players,
  teamColor = '#1e40af',
  teamName,
  isAway = false,
  className = '',
}: FormationDisplayProps) {
  const positions = useMemo(() => {
    const formationKey = Object.keys(FORMATION_POSITIONS).find(
      key => key === formation
    ) || '4-4-2';

    const basePositions = FORMATION_POSITIONS[formationKey];

    if (isAway) {
      return basePositions.map(pos => ({
        x: 100 - pos.x,
        y: pos.y,
      }));
    }

    return basePositions;
  }, [formation, isAway]);

  const positionedPlayers = useMemo(() => {
    const starters = players.slice(0, 11);
    return starters.map((player, i) => ({
      ...player,
      position: positions[i] || { x: 50, y: 50 },
    }));
  }, [players, positions]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
        <span className="font-bold">{formation}</span>
        {teamName && <span className="ml-1 opacity-80">• {teamName}</span>}
      </div>

      <svg
        viewBox="0 0 100 100"
        className="w-full h-64 bg-pitch-green rounded-lg overflow-hidden"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
      >
        <g stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" fill="none">
          <rect x="2" y="2" width="96" height="96" />
          {isAway ? (
            <>
              <rect x="70" y="20" width="28" height="60" />
              <rect x="86" y="35" width="12" height="30" />
              <circle cx="80" cy="50" r="0.8" fill="rgba(255,255,255,0.4)" />
              <rect x="98" y="40" width="0.5" height="20" fill="rgba(255,255,255,0.6)" />
            </>
          ) : (
            <>
              <rect x="2" y="20" width="28" height="60" />
              <rect x="2" y="35" width="12" height="30" />
              <circle cx="20" cy="50" r="0.8" fill="rgba(255,255,255,0.4)" />
              <rect x="1.5" y="40" width="0.5" height="20" fill="rgba(255,255,255,0.6)" />
            </>
          )}
          <circle cx={isAway ? 2 : 98} cy="50" r="12" />
        </g>

        {positionedPlayers.map((player, i) => (
          <g key={player.id || i} className="cursor-pointer">
            <ellipse
              cx={player.position.x}
              cy={player.position.y + 2}
              rx="3.5"
              ry="1.5"
              fill="rgba(0,0,0,0.2)"
            />
            <circle
              cx={player.position.x}
              cy={player.position.y}
              r="4"
              fill={teamColor}
              stroke="white"
              strokeWidth="0.8"
              className="drop-shadow-md"
            />
            <text
              x={player.position.x}
              y={player.position.y + 1.2}
              textAnchor="middle"
              fontSize="3.5"
              fontWeight="bold"
              fill="white"
            >
              {player.jerseyNumber}
            </text>
            <text
              x={player.position.x}
              y={player.position.y + 8}
              textAnchor="middle"
              fontSize="2.5"
              fill="white"
              className="drop-shadow"
            >
              {player.name.split(' ').pop()?.substring(0, 10)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default FormationDisplay;
