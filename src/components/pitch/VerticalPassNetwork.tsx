import { useMemo } from 'react';
import type { PassNetworkData } from '../../types/statsbomb';
import { STATSBOMB_PITCH } from '../../lib/coordinates';

interface VerticalPassNetworkProps {
  data: PassNetworkData;
  teamColor?: string;
  teamName?: string;
  isAway?: boolean;
  className?: string;
}

export function VerticalPassNetwork({
  data,
  teamColor = '#EF0107',
  teamName = 'Team',
  isAway = false,
  className = '',
}: VerticalPassNetworkProps) {
  // Vertical pitch dimensions (80 wide x 120 tall, scaled down)
  const pitchWidth = 240;
  const pitchHeight = 360;
  const padding = 40;

  const scaleX = pitchWidth / STATSBOMB_PITCH.height; // Note: flipped for vertical
  const scaleY = pitchHeight / STATSBOMB_PITCH.width;

  // Transform coordinates for vertical pitch
  // For home team: attacking up (y increases = up on screen)
  // For away team: attacking up (but data is flipped)
  const transformCoord = (x: number, y: number) => {
    if (isAway) {
      // Away team: flip x and y, then position
      return {
        x: padding + (STATSBOMB_PITCH.height - y) * scaleX,
        y: padding + x * scaleY,
      };
    } else {
      // Home team: x becomes vertical y (inverted), y becomes horizontal x
      return {
        x: padding + y * scaleX,
        y: padding + (STATSBOMB_PITCH.width - x) * scaleY,
      };
    }
  };

  // Calculate link width scale
  const linkWidthScale = useMemo(() => {
    const maxCount = Math.max(...data.links.map((l) => l.count), 1);
    return (count: number) => 1 + (count / maxCount) * 6;
  }, [data.links]);

  // Calculate node size scale
  const nodeSizeScale = useMemo(() => {
    const maxPasses = Math.max(...data.nodes.map((n) => n.passCount), 1);
    return (passes: number) => 12 + (passes / maxPasses) * 18;
  }, [data.nodes]);

  // Lighten color for passes
  const passColor = teamColor + '60';

  return (
    <div className={`bg-white ${className}`}>
      {/* Attack direction label */}
      <div className="relative">
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-gray-400 tracking-widest"
          style={{ transformOrigin: 'center', left: '-20px' }}
        >
          Attack →
        </div>

        <svg
          width={pitchWidth + padding * 2}
          height={pitchHeight + padding * 2}
          viewBox={`0 0 ${pitchWidth + padding * 2} ${pitchHeight + padding * 2}`}
          className="mx-auto"
        >
          {/* Pitch background */}
          <rect
            x={padding}
            y={padding}
            width={pitchWidth}
            height={pitchHeight}
            fill="#f8f8f8"
            stroke="#ddd"
            strokeWidth={1}
          />

          {/* Pitch markings - vertical orientation */}
          <g stroke="#ddd" strokeWidth={1} fill="none">
            {/* Center line */}
            <line
              x1={padding}
              y1={padding + pitchHeight / 2}
              x2={padding + pitchWidth}
              y2={padding + pitchHeight / 2}
            />
            {/* Center circle */}
            <circle
              cx={padding + pitchWidth / 2}
              cy={padding + pitchHeight / 2}
              r={30}
            />
            {/* Top penalty area (attacking) */}
            <rect
              x={padding + (pitchWidth - 132) / 2}
              y={padding}
              width={132}
              height={54}
            />
            {/* Top goal area */}
            <rect
              x={padding + (pitchWidth - 60) / 2}
              y={padding}
              width={60}
              height={18}
            />
            {/* Bottom penalty area (defending) */}
            <rect
              x={padding + (pitchWidth - 132) / 2}
              y={padding + pitchHeight - 54}
              width={132}
              height={54}
            />
            {/* Bottom goal area */}
            <rect
              x={padding + (pitchWidth - 60) / 2}
              y={padding + pitchHeight - 18}
              width={60}
              height={18}
            />
          </g>

          {/* Pass links */}
          <g>
            {data.links.map((link, i) => {
              const source = data.nodes.find((n) => n.playerId === link.source);
              const target = data.nodes.find((n) => n.playerId === link.target);
              if (!source || !target) return null;

              const sourcePos = transformCoord(source.avgX, source.avgY);
              const targetPos = transformCoord(target.avgX, target.avgY);

              return (
                <line
                  key={`link-${i}`}
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke={passColor}
                  strokeWidth={linkWidthScale(link.count)}
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          {/* Player nodes */}
          <g>
            {data.nodes.map((node) => {
              const pos = transformCoord(node.avgX, node.avgY);
              const radius = nodeSizeScale(node.passCount);
              const shortName = getShortName(node.name);

              return (
                <g key={node.playerId}>
                  {/* Player circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius}
                    fill={teamColor}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                  {/* Player name */}
                  <text
                    x={pos.x}
                    y={pos.y + radius + 12}
                    textAnchor="middle"
                    fontSize={9}
                    fill="#333"
                    fontWeight={500}
                  >
                    {shortName}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Caption */}
      <div className="text-xs text-gray-400 text-center mt-2">
        Passes from minutes 1' to 90'
      </div>
    </div>
  );
}

function getShortName(fullName: string): string {
  const parts = fullName.split(' ');
  if (parts.length === 1) return parts[0];
  return `${parts[0][0]}. ${parts[parts.length - 1]}`;
}

export default VerticalPassNetwork;
