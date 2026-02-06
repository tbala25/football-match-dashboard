import { useMemo, useRef } from 'react';
import * as d3 from 'd3';
import type { PassNetworkData } from '../../types/statsbomb';
import { Pitch } from './Pitch';
import type { CoordinateMapper } from '../../lib/coordinates';

interface PassNetworkProps {
  data: PassNetworkData;
  teamColor?: string;
  className?: string;
  showLabels?: boolean;
  minLinkWidth?: number;
  maxLinkWidth?: number;
}

export function PassNetwork({
  data,
  teamColor = '#1e40af',
  className = '',
  showLabels = true,
  minLinkWidth = 1,
  maxLinkWidth = 8,
}: PassNetworkProps) {
  const svgRef = useRef<SVGGElement>(null);

  // Calculate link width scale
  const linkWidthScale = useMemo(() => {
    const maxCount = Math.max(...data.links.map((l) => l.count), 1);
    return d3.scaleLinear().domain([0, maxCount]).range([minLinkWidth, maxLinkWidth]);
  }, [data.links, minLinkWidth, maxLinkWidth]);

  // Calculate node size scale
  const nodeSizeScale = useMemo(() => {
    const maxPasses = Math.max(...data.nodes.map((n) => n.passCount), 1);
    return d3.scaleLinear().domain([0, maxPasses]).range([15, 30]);
  }, [data.nodes]);

  return (
    <div className={`relative ${className}`}>
      <Pitch>
        {(mapper: CoordinateMapper) => (
          <g ref={svgRef}>
            {/* Links (passes between players) */}
            <g className="links">
              {data.links.map((link, i) => {
                const source = data.nodes.find((n) => n.playerId === link.source);
                const target = data.nodes.find((n) => n.playerId === link.target);
                if (!source || !target) return null;

                const sourcePos = mapper.toViewport(source.avgX, source.avgY);
                const targetPos = mapper.toViewport(target.avgX, target.avgY);

                return (
                  <line
                    key={`link-${i}`}
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke={teamColor}
                    strokeWidth={linkWidthScale(link.count)}
                    strokeOpacity={0.3 + link.successRate * 0.5}
                    strokeLinecap="round"
                  />
                );
              })}
            </g>

            {/* Nodes (players) */}
            <g className="nodes">
              {data.nodes.map((node) => {
                const pos = mapper.toViewport(node.avgX, node.avgY);
                const radius = nodeSizeScale(node.passCount);

                return (
                  <g key={node.playerId} transform={`translate(${pos.x}, ${pos.y})`}>
                    {/* Player circle */}
                    <circle
                      r={radius}
                      fill={teamColor}
                      stroke="#fff"
                      strokeWidth={2}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />

                    {/* Jersey number */}
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#fff"
                      fontSize={radius * 0.8}
                      fontWeight="bold"
                    >
                      {node.jerseyNumber ?? '?'}
                    </text>

                    {/* Player name label */}
                    {showLabels && (
                      <text
                        y={radius + 12}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={10}
                        fontWeight="500"
                        className="pointer-events-none"
                        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                      >
                        {getShortName(node.name)}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </g>
        )}
      </Pitch>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs p-2 rounded">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: teamColor }}
          />
          <span>Player position (avg)</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-1 rounded"
            style={{ backgroundColor: teamColor }}
          />
          <span>Passes (thicker = more)</span>
        </div>
      </div>
    </div>
  );
}

function getShortName(fullName: string): string {
  const parts = fullName.split(' ');
  if (parts.length === 1) return parts[0];
  // Return first initial + last name
  return `${parts[0][0]}. ${parts[parts.length - 1]}`;
}

export default PassNetwork;
