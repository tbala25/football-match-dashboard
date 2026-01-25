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
          {/* Light background */}
          <rect
            x={padding.left}
            y={padding.top}
            width={pitchWidth}
            height={pitchHeight}
            fill="#f5f5f0"
          />

          {/* Pitch markings */}
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Goal - thick black bar at top */}
            <rect
              x={markings.goal.x}
              y={0}
              width={markings.goal.width}
              height={4}
              fill="#333"
            />

            {/* End line */}
            <line
              x1={0}
              y1={4}
              x2={pitchWidth}
              y2={4}
              stroke="#999"
              strokeWidth={1}
            />

            {/* 18-yard box (penalty area) */}
            <rect
              x={markings.penaltyArea.x}
              y={4}
              width={markings.penaltyArea.width}
              height={markings.penaltyArea.height}
              fill="none"
              stroke="#999"
              strokeWidth={1}
            />

            {/* 6-yard box (goal area) */}
            <rect
              x={markings.goalArea.x}
              y={4}
              width={markings.goalArea.width}
              height={markings.goalArea.height}
              fill="none"
              stroke="#999"
              strokeWidth={1}
            />

            {/* Shots */}
            {shots.map((shot) => {
              const pos = mapper.toViewport(shot.x, shot.y);
              const r = xgToRadius(shot.xg);

              return (
                <g key={shot.id} className="cursor-pointer">
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={r}
                    fill={shot.isGoal ? teamColor : 'transparent'}
                    stroke={teamColor}
                    strokeWidth={2}
                    opacity={0.8}
                  />

                  {/* Goal indicator line */}
                  {shot.isGoal && (
                    <line
                      x1={pos.x}
                      y1={pos.y}
                      x2={markings.goal.x + markings.goal.width / 2}
                      y2={4}
                      stroke={teamColor}
                      strokeWidth={1.5}
                      opacity={0.6}
                    />
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

        {/* xG summary - simple boxed style */}
        <div className="flex justify-center mt-2">
          <div
            className="px-4 py-1 rounded border-2 text-sm font-semibold"
            style={{ borderColor: teamColor, color: teamColor }}
          >
            {stats.xg.toFixed(1)} xG
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamShotMap;
