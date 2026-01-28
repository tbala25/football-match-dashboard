import { useState, useMemo } from 'react';
import type { CarryData, DribbleData } from '../../lib/transformers/carries';
import { getCarryStats, getDribbleStats, getTopCarriers } from '../../lib/transformers/carries';
import { Pitch } from './Pitch';
import type { CoordinateMapper } from '../../lib/coordinates';

interface CarryMapProps {
  homeCarries: CarryData[];
  awayCarries: CarryData[];
  homeDribbles: DribbleData[];
  awayDribbles: DribbleData[];
  homeTeamName: string;
  awayTeamName: string;
  homeColor?: string;
  awayColor?: string;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

// Generate curved Bezier path for carries
function getCarryPath(start: Point, end: Point, curvature: number = 0.12): string {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.hypot(dx, dy);

  // Control point offset perpendicular to the line
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  const angle = Math.atan2(dy, dx) + Math.PI / 2;

  const cpX = midX + Math.cos(angle) * dist * curvature;
  const cpY = midY + Math.sin(angle) * dist * curvature;

  return `M ${start.x} ${start.y} Q ${cpX} ${cpY} ${end.x} ${end.y}`;
}

// SVG definitions for filters and gradients
function SvgDefs({ teamColor, id }: { teamColor: string; id: string }) {
  return (
    <defs>
      {/* Gradient for progressive carries */}
      <linearGradient id={`carry-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={teamColor} stopOpacity={0.3} />
        <stop offset="100%" stopColor={teamColor} stopOpacity={1} />
      </linearGradient>

      {/* Arrow marker */}
      <marker
        id={`arrow-${id}`}
        markerWidth="8"
        markerHeight="8"
        refX="7"
        refY="4"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M0,0 L0,8 L8,4 z" fill={teamColor} opacity={0.9} />
      </marker>

      {/* Glow filter for progressive carries */}
      <filter id={`carry-glow-${id}`} x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feFlood floodColor={teamColor} floodOpacity="0.4" />
        <feComposite in2="blur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Drop shadow for dribbles */}
      <filter id={`dribble-shadow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
      </filter>
    </defs>
  );
}

function TeamCarryMap({
  carries,
  dribbles,
  teamName,
  teamColor,
  showProgressiveOnly,
  showDribbles,
  isAway,
}: {
  carries: CarryData[];
  dribbles: DribbleData[];
  teamName: string;
  teamColor: string;
  showProgressiveOnly: boolean;
  showDribbles: boolean;
  isAway: boolean;
}) {
  const id = isAway ? 'away' : 'home';

  const filteredCarries = useMemo(() => {
    return showProgressiveOnly ? carries.filter((c) => c.isProgressive) : carries;
  }, [carries, showProgressiveOnly]);

  const carryStats = useMemo(() => getCarryStats(carries), [carries]);
  const dribbleStats = useMemo(() => getDribbleStats(dribbles), [dribbles]);

  // Scale line thickness based on distance (1.5 to 3.5px)
  const getLineWidth = (distance: number) => {
    const minWidth = 1.5;
    const maxWidth = 3.5;
    const maxDistance = 40;
    return minWidth + (Math.min(distance, maxDistance) / maxDistance) * (maxWidth - minWidth);
  };

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 text-center" style={{ color: teamColor }}>
        {teamName}
      </h4>
      <Pitch>
        {(mapper: CoordinateMapper) => (
          <g className="carries-and-dribbles">
            <SvgDefs teamColor={teamColor} id={id} />

            {/* Carry paths */}
            {filteredCarries.map((carry) => {
              const startX = isAway ? 120 - carry.startX : carry.startX;
              const startY = carry.startY;
              const endX = isAway ? 120 - carry.endX : carry.endX;
              const endY = carry.endY;

              const startPos = mapper.toViewport(startX, startY);
              const endPos = mapper.toViewport(endX, endY);
              const lineWidth = getLineWidth(carry.distance);
              const opacity = carry.isProgressive ? 0.85 : 0.45;
              const curvature = carry.isProgressive ? 0.15 : 0.08;

              return (
                <g key={carry.id} className="cursor-pointer">
                  {/* Main carry path */}
                  <path
                    d={getCarryPath(startPos, endPos, curvature)}
                    fill="none"
                    stroke={carry.isProgressive ? `url(#carry-gradient-${id})` : teamColor}
                    strokeWidth={lineWidth}
                    strokeOpacity={opacity}
                    strokeLinecap="round"
                    markerEnd={`url(#arrow-${id})`}
                    filter={carry.isProgressive ? `url(#carry-glow-${id})` : undefined}
                    className="transition-opacity duration-150"
                  />
                  <title>
                    {`${carry.playerName}\n${carry.minute}' - Carry\n${carry.distance.toFixed(1)} yards${carry.isProgressive ? ' (Progressive)' : ''}`}
                  </title>
                </g>
              );
            })}

            {/* Dribble markers */}
            {showDribbles &&
              dribbles.map((dribble) => {
                const x = isAway ? 120 - dribble.x : dribble.x;
                const pos = mapper.toViewport(x, dribble.y);
                const radius = 5;

                return (
                  <g key={dribble.id} className="cursor-pointer">
                    {dribble.nutmeg ? (
                      // Nutmeg sparkle effect
                      <g>
                        {/* Rotating sparkle dots */}
                        <g className="marker-pulse">
                          {[0, 60, 120, 180, 240, 300].map((angle) => (
                            <circle
                              key={angle}
                              cx={pos.x + Math.cos((angle * Math.PI) / 180) * 10}
                              cy={pos.y + Math.sin((angle * Math.PI) / 180) * 10}
                              r={1.5}
                              fill="#fbbf24"
                              opacity={0.6}
                            />
                          ))}
                        </g>
                        {/* Star */}
                        <text
                          x={pos.x}
                          y={pos.y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={16}
                          fill="#f59e0b"
                          style={{ filter: 'drop-shadow(0 0 3px #f59e0b)' }}
                        >
                          ★
                        </text>
                      </g>
                    ) : dribble.successful ? (
                      // Successful dribble with ripple effect
                      <g filter={`url(#dribble-shadow-${id})`}>
                        {/* Animated ripple rings */}
                        <circle cx={pos.x} cy={pos.y} r={radius} fill="none" stroke={teamColor} strokeWidth={1} opacity={0.6}>
                          <animate attributeName="r" from={radius.toString()} to={(radius * 2.5).toString()} dur="1.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={pos.x} cy={pos.y} r={radius} fill="none" stroke={teamColor} strokeWidth={1} opacity={0.6}>
                          <animate attributeName="r" from={radius.toString()} to={(radius * 2.5).toString()} dur="1.5s" begin="0.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
                        </circle>
                        {/* Core marker */}
                        <circle cx={pos.x} cy={pos.y} r={radius} fill={teamColor} />
                      </g>
                    ) : (
                      // Failed dribble
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={radius}
                        fill="none"
                        stroke={teamColor}
                        strokeWidth={2}
                        opacity={0.4}
                        filter={`url(#dribble-shadow-${id})`}
                      />
                    )}
                    <title>
                      {`${dribble.playerName}\n${dribble.minute}' - Dribble\n${dribble.successful ? 'Successful' : 'Failed'}${dribble.nutmeg ? ' (Nutmeg!)' : ''}`}
                    </title>
                  </g>
                );
              })}
          </g>
        )}
      </Pitch>

      {/* Stats summary */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold" style={{ color: teamColor }}>
            {carryStats.totalCarries}
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wide">Carries</div>
          <div className="text-[10px] text-gray-400">
            {carryStats.progressiveCarries} progressive
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold" style={{ color: teamColor }}>
            {dribbleStats.successRate.toFixed(0)}%
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wide">Dribble Success</div>
          <div className="text-[10px] text-gray-400">
            {dribbleStats.successful}/{dribbleStats.totalDribbles}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopCarriersLeaderboard({
  homeCarries,
  awayCarries,
  homeTeamName,
  awayTeamName,
  homeColor,
  awayColor,
}: {
  homeCarries: CarryData[];
  awayCarries: CarryData[];
  homeTeamName: string;
  awayTeamName: string;
  homeColor: string;
  awayColor: string;
}) {
  const homeTop = useMemo(() => getTopCarriers(homeCarries, 3), [homeCarries]);
  const awayTop = useMemo(() => getTopCarriers(awayCarries, 3), [awayCarries]);

  const homeMaxDist = Math.max(...homeTop.map((c) => c.totalDistance), 1);
  const awayMaxDist = Math.max(...awayTop.map((c) => c.totalDistance), 1);

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {/* Home leaderboard */}
      <div className="leaderboard">
        <div className="leaderboard-header flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <span style={{ color: homeColor }}>{homeTeamName}</span>
        </div>
        {homeTop.map((player, i) => (
          <div key={player.playerId} className="leaderboard-row">
            <div className="rank-badge" style={{ backgroundColor: i < 3 ? homeColor : '#9ca3af' }}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 truncate">{player.playerName}</div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${(player.totalDistance / homeMaxDist) * 100}%`,
                    backgroundColor: homeColor,
                  }}
                />
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-sm" style={{ color: homeColor }}>
                {player.totalDistance}y
              </div>
              <div className="text-[10px] text-gray-400">{player.count} carries</div>
            </div>
          </div>
        ))}
      </div>

      {/* Away leaderboard */}
      <div className="leaderboard">
        <div className="leaderboard-header flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <span style={{ color: awayColor }}>{awayTeamName}</span>
        </div>
        {awayTop.map((player, i) => (
          <div key={player.playerId} className="leaderboard-row">
            <div className="rank-badge" style={{ backgroundColor: i < 3 ? awayColor : '#9ca3af' }}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 truncate">{player.playerName}</div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${(player.totalDistance / awayMaxDist) * 100}%`,
                    backgroundColor: awayColor,
                  }}
                />
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-sm" style={{ color: awayColor }}>
                {player.totalDistance}y
              </div>
              <div className="text-[10px] text-gray-400">{player.count} carries</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CarryMap({
  homeCarries,
  awayCarries,
  homeDribbles,
  awayDribbles,
  homeTeamName,
  awayTeamName,
  homeColor = '#1e40af',
  awayColor = '#dc2626',
  className = '',
}: CarryMapProps) {
  const [showProgressiveOnly, setShowProgressiveOnly] = useState(false);
  const [showDribbles, setShowDribbles] = useState(true);

  const homeProgCount = homeCarries.filter((c) => c.isProgressive).length;
  const awayProgCount = awayCarries.filter((c) => c.isProgressive).length;
  const totalProgCount = homeProgCount + awayProgCount;

  return (
    <div className={`pro-card p-5 ${className}`}>
      <h3 className="section-title text-center mb-4">Ball Carries & Dribbles</h3>

      {/* Segmented toggle controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-5">
        {/* Carries toggle group */}
        <div className="toggle-group">
          <button
            className={`toggle-segment ${!showProgressiveOnly ? 'active' : ''}`}
            onClick={() => setShowProgressiveOnly(false)}
          >
            All Carries
          </button>
          <button
            className={`toggle-segment ${showProgressiveOnly ? 'active' : ''}`}
            onClick={() => setShowProgressiveOnly(true)}
          >
            Progressive
            <span className="toggle-badge">{totalProgCount}</span>
          </button>
        </div>

        {/* Dribbles toggle group */}
        <div className="toggle-group">
          <button
            className={`toggle-segment ${showDribbles ? 'active' : ''}`}
            onClick={() => setShowDribbles(true)}
          >
            Show Dribbles
          </button>
          <button
            className={`toggle-segment ${!showDribbles ? 'active' : ''}`}
            onClick={() => setShowDribbles(false)}
          >
            Hide
          </button>
        </div>
      </div>

      {/* Two-column pitch layout */}
      <div className="grid grid-cols-2 gap-4">
        <TeamCarryMap
          carries={homeCarries}
          dribbles={homeDribbles}
          teamName={homeTeamName}
          teamColor={homeColor}
          showProgressiveOnly={showProgressiveOnly}
          showDribbles={showDribbles}
          isAway={false}
        />
        <TeamCarryMap
          carries={awayCarries}
          dribbles={awayDribbles}
          teamName={awayTeamName}
          teamColor={awayColor}
          showProgressiveOnly={showProgressiveOnly}
          showDribbles={showDribbles}
          isAway={true}
        />
      </div>

      {/* Top carriers leaderboard */}
      <TopCarriersLeaderboard
        homeCarries={homeCarries}
        awayCarries={awayCarries}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
        homeColor={homeColor}
        awayColor={awayColor}
      />

      {/* Legend */}
      <div className="glass-legend p-3 mt-4">
        <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <svg width="24" height="10" viewBox="0 0 24 10">
              <path d="M2,5 Q12,2 20,5" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
              <polygon points="18,2 24,5 18,8" fill="#6b7280" />
            </svg>
            <span>Carry</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="5" fill="#6b7280" />
            </svg>
            <span>Dribble (success)</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="4" fill="none" stroke="#6b7280" strokeWidth="2" />
            </svg>
            <span>Dribble (fail)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-500 text-base">★</span>
            <span>Nutmeg</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarryMap;
