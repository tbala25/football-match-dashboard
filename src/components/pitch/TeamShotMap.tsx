import { useMemo } from 'react';
import type { ShotData } from '../../types/statsbomb';
import {
  createRotatedCoordinateMapper,
  HALF_PITCH,
  STATSBOMB_PITCH,
} from '../../lib/coordinates';

interface TeamShotMapProps {
  shots: ShotData[];
  teamColor: string;
  teamName: string;
  isAwayTeam?: boolean;
  className?: string;
}

export function TeamShotMap({
  shots,
  teamColor,
  teamName,
  isAwayTeam = false,
  className = '',
}: TeamShotMapProps) {
  // Viewport dimensions
  const width = 200;
  const height = 260;
  const padding = { top: 20, right: 15, bottom: 40, left: 15 };
  const pitchWidth = width - padding.left - padding.right;
  const pitchHeight = height - padding.top - padding.bottom;

  // Create coordinate mapper
  const mapper = useMemo(
    () =>
      createRotatedCoordinateMapper({
        width: pitchWidth,
        height: pitchHeight,
        isAwayTeam,
      }),
    [pitchWidth, pitchHeight, isAwayTeam]
  );

  // Calculate stats
  const stats = useMemo(() => {
    const goals = shots.filter((s) => s.isGoal).length;
    const totalXG = shots.reduce((sum, s) => sum + s.xg, 0);
    return {
      shots: shots.length,
      goals,
      xg: totalXG,
    };
  }, [shots]);

  // Scale xG to circle radius
  const xgToRadius = (xg: number) => Math.max(5, Math.min(18, 5 + xg * 25));

  // Convert half-pitch coordinates to rotated viewport
  const getPitchMarkings = () => {
    // Penalty area
    const paTopLeft = mapper.toViewport(HALF_PITCH.penaltyAreaX, HALF_PITCH.penaltyAreaYMin);
    const paTopRight = mapper.toViewport(HALF_PITCH.penaltyAreaX, HALF_PITCH.penaltyAreaYMax);
    const paBottomLeft = mapper.toViewport(120, HALF_PITCH.penaltyAreaYMin);
    const paBottomRight = mapper.toViewport(120, HALF_PITCH.penaltyAreaYMax);

    // Goal area
    const gaTopLeft = mapper.toViewport(HALF_PITCH.goalAreaX, HALF_PITCH.goalAreaYMin);
    const gaTopRight = mapper.toViewport(HALF_PITCH.goalAreaX, HALF_PITCH.goalAreaYMax);
    const gaBottomLeft = mapper.toViewport(120, HALF_PITCH.goalAreaYMin);
    const gaBottomRight = mapper.toViewport(120, HALF_PITCH.goalAreaYMax);

    // Goal
    const goalLeft = mapper.toViewport(120, HALF_PITCH.goalYMin);
    const goalRight = mapper.toViewport(120, HALF_PITCH.goalYMax);

    // Penalty spot
    const penaltySpot = mapper.toViewport(HALF_PITCH.penaltySpotX, 40);

    return {
      penaltyArea: {
        x: Math.min(paTopLeft.x, paBottomLeft.x),
        y: Math.min(paTopLeft.y, paTopRight.y),
        width: Math.abs(paTopRight.x - paTopLeft.x),
        height: Math.abs(paBottomLeft.y - paTopLeft.y),
      },
      goalArea: {
        x: Math.min(gaTopLeft.x, gaBottomLeft.x),
        y: Math.min(gaTopLeft.y, gaTopRight.y),
        width: Math.abs(gaTopRight.x - gaTopLeft.x),
        height: Math.abs(gaBottomLeft.y - gaTopLeft.y),
      },
      goal: {
        x: Math.min(goalLeft.x, goalRight.x),
        y: Math.min(goalLeft.y, goalRight.y),
        width: Math.abs(goalRight.x - goalLeft.x),
        height: 4,
      },
      penaltySpot,
    };
  };

  const markings = useMemo(getPitchMarkings, [mapper]);

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Team name header */}
      <div
        className="px-3 py-2 text-white text-sm font-semibold text-center"
        style={{ backgroundColor: teamColor }}
      >
        {teamName}
      </div>

      {/* Shot map */}
      <div className="p-2">
        <svg width={width} height={height} className="mx-auto">
          {/* Pitch background */}
          <rect
            x={padding.left}
            y={padding.top}
            width={pitchWidth}
            height={pitchHeight}
            fill="#3d8c40"
            rx={4}
          />

          {/* Pitch pattern (subtle stripes) */}
          <defs>
            <pattern
              id={`pitch-stripes-${teamName.replace(/\s/g, '-')}`}
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(90)"
            >
              <rect width="10" height="20" fill="rgba(255,255,255,0.03)" />
            </pattern>
          </defs>
          <rect
            x={padding.left}
            y={padding.top}
            width={pitchWidth}
            height={pitchHeight}
            fill={`url(#pitch-stripes-${teamName.replace(/\s/g, '-')})`}
            rx={4}
          />

          {/* Pitch markings */}
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Penalty area */}
            <rect
              x={markings.penaltyArea.x}
              y={markings.penaltyArea.y}
              width={markings.penaltyArea.width}
              height={markings.penaltyArea.height}
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={1.5}
            />

            {/* Goal area */}
            <rect
              x={markings.goalArea.x}
              y={markings.goalArea.y}
              width={markings.goalArea.width}
              height={markings.goalArea.height}
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={1.5}
            />

            {/* Goal */}
            <rect
              x={markings.goal.x}
              y={markings.goal.y - 3}
              width={markings.goal.width}
              height={6}
              fill="#fff"
              stroke="#333"
              strokeWidth={1}
              rx={1}
            />

            {/* Penalty spot */}
            <circle
              cx={markings.penaltySpot.x}
              cy={markings.penaltySpot.y}
              r={2}
              fill="rgba(255,255,255,0.6)"
            />

            {/* Shots */}
            {shots.map((shot) => {
              const pos = mapper.toViewport(shot.x, shot.y);
              const r = xgToRadius(shot.xg);

              return (
                <g key={shot.id} className="cursor-pointer">
                  {/* Drop shadow */}
                  <circle
                    cx={pos.x + 1}
                    cy={pos.y + 1}
                    r={r}
                    fill="rgba(0,0,0,0.2)"
                  />

                  {/* Shot circle with gradient */}
                  <defs>
                    <radialGradient id={`shot-grad-${shot.id}`}>
                      <stop
                        offset="0%"
                        stopColor={shot.isGoal ? '#fff' : teamColor}
                        stopOpacity={shot.isGoal ? 0.9 : 0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor={teamColor}
                        stopOpacity={shot.isGoal ? 1 : 0.8}
                      />
                    </radialGradient>
                  </defs>

                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={r}
                    fill={shot.isGoal ? `url(#shot-grad-${shot.id})` : 'transparent'}
                    stroke={teamColor}
                    strokeWidth={shot.isGoal ? 3 : 2}
                    opacity={shot.isGoal ? 1 : 0.7}
                    className="transition-transform hover:scale-110"
                    style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                  />

                  {/* Goal marker */}
                  {shot.isGoal && (
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fontSize={r * 0.9}
                      fill="#fff"
                      fontWeight="bold"
                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      G
                    </text>
                  )}

                  {/* Tooltip */}
                  <title>
                    {`${shot.playerName}\n${shot.minute}' - ${shot.outcome}\nxG: ${shot.xg.toFixed(2)}`}
                  </title>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Stats summary */}
        <div className="flex justify-around mt-2 text-xs">
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: teamColor }}>
              {stats.xg.toFixed(2)}
            </div>
            <div className="text-gray-500">xG</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: teamColor }}>
              {stats.shots}
            </div>
            <div className="text-gray-500">Shots</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: teamColor }}>
              {stats.goals}
            </div>
            <div className="text-gray-500">Goals</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamShotMap;
