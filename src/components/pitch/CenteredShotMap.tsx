import { useMemo } from 'react';
import type { ShotData } from '../../types/statsbomb';
import { STATSBOMB_PITCH } from '../../lib/coordinates';

interface CenteredShotMapProps {
  shots: ShotData[];
  homeTeamId: number;
  awayTeamId: number;
  homeXG: number;
  awayXG: number;
  homeColor?: string;
  awayColor?: string;
  className?: string;
}

export function CenteredShotMap({
  shots,
  homeTeamId,
  awayTeamId: _awayTeamId,
  homeXG,
  awayXG,
  homeColor = '#EF0107',
  awayColor = '#6CABDD',
  className = '',
}: CenteredShotMapProps) {
  // Pitch dimensions (half pitch view, rotated)
  const width = 300;
  const height = 180;
  const padding = 20;

  // Only show shots in attacking third (close to goal)
  const relevantShots = useMemo(() => {
    return shots.filter(s => s.x > 80); // Attacking third
  }, [shots]);

  // Scale for half pitch (x: 80-120, y: 0-80)
  const scaleX = (x: number) => {
    // Map 80-120 to width
    return padding + ((x - 80) / 40) * (width - padding * 2);
  };

  const scaleY = (y: number) => {
    return padding + (y / STATSBOMB_PITCH.height) * (height - padding * 2);
  };

  // xG to radius
  const xgToRadius = (xg: number) => Math.max(4, Math.min(20, 4 + xg * 30));

  return (
    <div className={`bg-white p-4 ${className}`}>
      <div className="relative">
        <svg width={width} height={height} className="mx-auto">
          {/* Pitch background */}
          <rect
            x={padding}
            y={padding}
            width={width - padding * 2}
            height={height - padding * 2}
            fill="#f0f0f0"
            stroke="#ddd"
            strokeWidth={1}
          />

          {/* Penalty area */}
          <rect
            x={width - padding - 54}
            y={padding + (height - padding * 2 - 132) / 2}
            width={54}
            height={132}
            fill="none"
            stroke="#ddd"
            strokeWidth={1}
          />

          {/* Goal area */}
          <rect
            x={width - padding - 18}
            y={padding + (height - padding * 2 - 60) / 2}
            width={18}
            height={60}
            fill="none"
            stroke="#ddd"
            strokeWidth={1}
          />

          {/* Goal */}
          <rect
            x={width - padding}
            y={padding + (height - padding * 2 - 24) / 2}
            width={6}
            height={24}
            fill="#333"
          />

          {/* Shots */}
          {relevantShots.map((shot) => {
            const isHome = shot.teamId === homeTeamId;
            const color = isHome ? homeColor : awayColor;
            const cx = scaleX(shot.x);
            const cy = scaleY(shot.y);
            const r = xgToRadius(shot.xg);

            return (
              <g key={shot.id}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={shot.isGoal ? color : 'transparent'}
                  stroke={color}
                  strokeWidth={2}
                  opacity={shot.isGoal ? 0.9 : 0.6}
                />
                {shot.isGoal && (
                  <text
                    x={cx}
                    y={cy + 3}
                    textAnchor="middle"
                    fontSize={r * 0.8}
                    fill="#fff"
                    fontWeight="bold"
                  >
                    G
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* xG labels */}
        <div className="flex justify-center gap-12 mt-4">
          <div className="text-center">
            <span
              className="inline-block px-4 py-1 rounded text-white font-bold"
              style={{ backgroundColor: homeColor }}
            >
              {homeXG.toFixed(1)} xG
            </span>
          </div>
          <div className="text-center">
            <span
              className="inline-block px-4 py-1 rounded text-white font-bold"
              style={{ backgroundColor: awayColor }}
            >
              {awayXG.toFixed(1)} xG
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CenteredShotMap;
