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

// Arrow marker definition
function ArrowMarker({ id, color }: { id: string; color: string }) {
  return (
    <marker
      id={id}
      markerWidth="6"
      markerHeight="6"
      refX="5"
      refY="3"
      orient="auto"
      markerUnits="strokeWidth"
    >
      <path d="M0,0 L0,6 L6,3 z" fill={color} />
    </marker>
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
  const markerId = `arrow-${isAway ? 'away' : 'home'}`;

  const filteredCarries = useMemo(() => {
    return showProgressiveOnly ? carries.filter((c) => c.isProgressive) : carries;
  }, [carries, showProgressiveOnly]);

  const carryStats = useMemo(() => getCarryStats(carries), [carries]);
  const dribbleStats = useMemo(() => getDribbleStats(dribbles), [dribbles]);

  // Scale line thickness based on distance (1.5 to 3px)
  const getLineWidth = (distance: number) => {
    const minWidth = 1.5;
    const maxWidth = 3;
    const maxDistance = 40; // Normalize to 40 yards max
    return minWidth + ((Math.min(distance, maxDistance) / maxDistance) * (maxWidth - minWidth));
  };

  return (
    <div>
      <h4
        className="text-sm font-semibold mb-2 text-center"
        style={{ color: teamColor }}
      >
        {teamName}
      </h4>
      <Pitch>
        {(mapper: CoordinateMapper) => (
          <g className="carries-and-dribbles">
            {/* Arrow marker definition */}
            <defs>
              <ArrowMarker id={markerId} color={teamColor} />
            </defs>

            {/* Carry arrows */}
            {filteredCarries.map((carry) => {
              // Mirror coordinates for away team
              const startX = isAway ? 120 - carry.startX : carry.startX;
              const startY = carry.startY;
              const endX = isAway ? 120 - carry.endX : carry.endX;
              const endY = carry.endY;

              const startPos = mapper.toViewport(startX, startY);
              const endPos = mapper.toViewport(endX, endY);
              const lineWidth = getLineWidth(carry.distance);
              const opacity = carry.isProgressive ? 0.9 : 0.5;

              return (
                <g key={carry.id} className="cursor-pointer">
                  <line
                    x1={startPos.x}
                    y1={startPos.y}
                    x2={endPos.x}
                    y2={endPos.y}
                    stroke={teamColor}
                    strokeWidth={lineWidth}
                    strokeOpacity={opacity}
                    markerEnd={`url(#${markerId})`}
                    strokeLinecap="round"
                  />
                  {/* Glow effect for progressive carries */}
                  {carry.isProgressive && (
                    <line
                      x1={startPos.x}
                      y1={startPos.y}
                      x2={endPos.x}
                      y2={endPos.y}
                      stroke={teamColor}
                      strokeWidth={lineWidth + 4}
                      strokeOpacity={0.2}
                      strokeLinecap="round"
                    />
                  )}
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
                    {/* Nutmeg star */}
                    {dribble.nutmeg ? (
                      <text
                        x={pos.x}
                        y={pos.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={14}
                        fill="#f59e0b"
                      >
                        ★
                      </text>
                    ) : (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={radius}
                        fill={dribble.successful ? teamColor : 'none'}
                        stroke={teamColor}
                        strokeWidth={2}
                        opacity={dribble.successful ? 0.8 : 0.5}
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
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
        <div className="text-center">
          <span className="font-medium text-gray-700">{carryStats.totalCarries}</span> carries
          <span className="text-gray-400 ml-1">({carryStats.progressiveCarries} prog.)</span>
        </div>
        <div className="text-center">
          <span className="font-medium text-gray-700">{dribbleStats.totalDribbles}</span> dribbles
          <span className="text-gray-400 ml-1">({dribbleStats.successRate.toFixed(0)}%)</span>
        </div>
      </div>
    </div>
  );
}

function TopCarriersTable({
  homeCarries,
  awayCarries,
  homeColor,
  awayColor,
}: {
  homeCarries: CarryData[];
  awayCarries: CarryData[];
  homeColor: string;
  awayColor: string;
}) {
  const homeTop = useMemo(() => getTopCarriers(homeCarries, 3), [homeCarries]);
  const awayTop = useMemo(() => getTopCarriers(awayCarries, 3), [awayCarries]);

  return (
    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
      <div>
        <div className="text-xs font-semibold mb-2" style={{ color: homeColor }}>
          Top Carriers
        </div>
        {homeTop.map((p, i) => (
          <div key={p.playerId} className="flex justify-between text-xs text-gray-600">
            <span>{i + 1}. {p.playerName}</span>
            <span className="text-gray-400">{p.totalDistance}y</span>
          </div>
        ))}
      </div>
      <div>
        <div className="text-xs font-semibold mb-2" style={{ color: awayColor }}>
          Top Carriers
        </div>
        {awayTop.map((p, i) => (
          <div key={p.playerId} className="flex justify-between text-xs text-gray-600">
            <span>{i + 1}. {p.playerName}</span>
            <span className="text-gray-400">{p.totalDistance}y</span>
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

  return (
    <div className={`pro-card p-5 ${className}`}>
      <h3 className="section-title text-center mb-3">Ball Carries & Dribbles</h3>

      {/* Filter toggles */}
      <div className="flex justify-center gap-4 mb-4">
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={showProgressiveOnly}
            onChange={(e) => setShowProgressiveOnly(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-gray-600">Progressive only</span>
        </label>
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={showDribbles}
            onChange={(e) => setShowDribbles(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-gray-600">Show dribbles</span>
        </label>
      </div>

      {/* Two-column layout for home/away */}
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

      {/* Top carriers */}
      <TopCarriersTable
        homeCarries={homeCarries}
        awayCarries={awayCarries}
        homeColor={homeColor}
        awayColor={awayColor}
      />

      {/* Legend */}
      <div className="mt-4 pt-3 border-t flex flex-wrap justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <svg width="20" height="8" viewBox="0 0 20 8">
            <line x1="0" y1="4" x2="16" y2="4" stroke="#6b7280" strokeWidth="2" />
            <polygon points="14,1 20,4 14,7" fill="#6b7280" />
          </svg>
          <span>Carry</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="4" fill="#6b7280" />
          </svg>
          <span>Dribble (success)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="4" fill="none" stroke="#6b7280" strokeWidth="2" />
          </svg>
          <span>Dribble (fail)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-amber-500 text-sm">★</span>
          <span>Nutmeg</span>
        </div>
      </div>
    </div>
  );
}

export default CarryMap;
