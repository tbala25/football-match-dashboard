import { useMemo } from 'react';
import type { ShotData } from '../../types/statsbomb';
import { Pitch } from './Pitch';
import type { CoordinateMapper } from '../../lib/coordinates';

interface ShotMapProps {
  shots: ShotData[];
  homeTeamId: number;
  awayTeamId: number;
  homeColor?: string;
  awayColor?: string;
  className?: string;
  showXGLabels?: boolean;
}

export function ShotMap({
  shots,
  homeTeamId,
  awayTeamId: _awayTeamId,
  homeColor = '#1e40af',
  awayColor = '#dc2626',
  className = '',
  showXGLabels = false,
}: ShotMapProps) {
  // Scale xG to circle radius
  const radiusScale = useMemo(() => {
    return (xg: number) => Math.max(6, Math.min(25, 6 + xg * 40));
  }, []);

  const getOutcomeStyle = (outcome: string, isGoal: boolean) => {
    if (isGoal) {
      return { fill: 'currentColor', stroke: '#22c55e', strokeWidth: 3 };
    }

    switch (outcome) {
      case 'Saved':
      case 'Saved Off Target':
      case 'Saved To Post':
        return { fill: 'currentColor', stroke: '#fff', strokeWidth: 2 };
      case 'Blocked':
        return { fill: 'none', stroke: 'currentColor', strokeWidth: 2 };
      case 'Off T':
      case 'Wayward':
      case 'Post':
        return { fill: 'currentColor', fillOpacity: 0.4, stroke: 'currentColor', strokeWidth: 1 };
      default:
        return { fill: 'currentColor', fillOpacity: 0.6, stroke: 'currentColor', strokeWidth: 1 };
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Pitch>
        {(mapper: CoordinateMapper) => (
          <g className="shots">
            {shots.map((shot) => {
              const isHome = shot.teamId === homeTeamId;
              const color = isHome ? homeColor : awayColor;
              const pos = mapper.toViewport(shot.x, shot.y);
              const radius = radiusScale(shot.xg);
              const style = getOutcomeStyle(shot.outcome, shot.isGoal);

              return (
                <g
                  key={shot.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  style={{ color }}
                >
                  {/* Shot circle */}
                  <circle
                    r={radius}
                    fill={style.fill}
                    fillOpacity={style.fillOpacity}
                    stroke={style.stroke}
                    strokeWidth={style.strokeWidth}
                    className="transition-transform group-hover:scale-110"
                  />

                  {/* Goal marker (star) */}
                  {shot.isGoal && (
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#fff"
                      fontSize={radius}
                      fontWeight="bold"
                    >
                      G
                    </text>
                  )}

                  {/* xG label */}
                  {showXGLabels && !shot.isGoal && (
                    <text
                      y={radius + 10}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize={9}
                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      {shot.xg.toFixed(2)}
                    </text>
                  )}

                  {/* Tooltip on hover */}
                  <title>
                    {`${shot.playerName}\n${shot.minute}' - ${shot.outcome}\nxG: ${shot.xg.toFixed(2)}\n${shot.bodyPart}`}
                  </title>
                </g>
              );
            })}
          </g>
        )}
      </Pitch>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs p-2 rounded">
        <div className="flex items-center gap-4 mb-1">
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: homeColor }}
            />
            <span>Home</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: awayColor }}
            />
            <span>Away</span>
          </div>
        </div>
        <div className="text-[10px] opacity-70">
          Size = xG | Green border = Goal
        </div>
      </div>
    </div>
  );
}

export default ShotMap;
