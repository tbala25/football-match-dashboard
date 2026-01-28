import { useState, useMemo } from 'react';
import type { DefensiveAction, DefensiveActionType } from '../../lib/transformers/defensiveActions';
import { Pitch } from './Pitch';
import type { CoordinateMapper } from '../../lib/coordinates';

interface DefensiveActionsMapProps {
  homeActions: DefensiveAction[];
  awayActions: DefensiveAction[];
  homeTeamName: string;
  awayTeamName: string;
  homeColor?: string;
  awayColor?: string;
  className?: string;
}

const ACTION_COLORS: Record<DefensiveActionType, string> = {
  tackle: '#22c55e',      // Green
  interception: '#3b82f6', // Blue
  recovery: '#f59e0b',     // Orange
  clearance: '#8b5cf6',    // Purple
  block: '#ef4444',        // Red
};

const ACTION_LABELS: Record<DefensiveActionType, string> = {
  tackle: 'Tackles',
  interception: 'Interceptions',
  recovery: 'Recoveries',
  clearance: 'Clearances',
  block: 'Blocks',
};

// SVG marker shapes for each action type
function ActionMarker({
  type,
  x,
  y,
  color,
  size = 6,
}: {
  type: DefensiveActionType;
  x: number;
  y: number;
  color: string;
  size?: number;
}) {
  switch (type) {
    case 'tackle':
      // Filled circle
      return <circle cx={x} cy={y} r={size} fill={color} />;
    case 'interception':
      // Diamond
      return (
        <polygon
          points={`${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}`}
          fill={color}
        />
      );
    case 'recovery':
      // Triangle pointing up
      return (
        <polygon
          points={`${x},${y - size} ${x + size},${y + size * 0.6} ${x - size},${y + size * 0.6}`}
          fill={color}
        />
      );
    case 'clearance':
      // Square
      return (
        <rect
          x={x - size * 0.7}
          y={y - size * 0.7}
          width={size * 1.4}
          height={size * 1.4}
          fill={color}
        />
      );
    case 'block':
      // X marker
      return (
        <g stroke={color} strokeWidth={2.5} strokeLinecap="round">
          <line x1={x - size} y1={y - size} x2={x + size} y2={y + size} />
          <line x1={x + size} y1={y - size} x2={x - size} y2={y + size} />
        </g>
      );
  }
}

function TeamDefensiveMap({
  actions,
  teamName,
  teamColor,
  filters,
  isAway,
}: {
  actions: DefensiveAction[];
  teamName: string;
  teamColor: string;
  filters: Set<DefensiveActionType>;
  isAway: boolean;
}) {
  const filteredActions = useMemo(() => {
    return actions.filter((a) => filters.has(a.type));
  }, [actions, filters]);

  // Count actions by type for summary
  const actionCounts = useMemo(() => {
    const counts: Record<DefensiveActionType, number> = {
      tackle: 0,
      interception: 0,
      recovery: 0,
      clearance: 0,
      block: 0,
    };
    for (const a of actions) {
      counts[a.type]++;
    }
    return counts;
  }, [actions]);

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
          <g className="defensive-actions">
            {filteredActions.map((action) => {
              // Mirror x coordinate for away team (attacking right to left)
              const x = isAway ? 120 - action.x : action.x;
              const pos = mapper.toViewport(x, action.y);
              return (
                <g key={action.id} className="cursor-pointer">
                  <ActionMarker
                    type={action.type}
                    x={pos.x}
                    y={pos.y}
                    color={ACTION_COLORS[action.type]}
                    size={5}
                  />
                  <title>
                    {`${action.playerName}\n${action.minute}' - ${ACTION_LABELS[action.type]}${action.outcome ? ` (${action.outcome})` : ''}`}
                  </title>
                </g>
              );
            })}
          </g>
        )}
      </Pitch>
      {/* Action counts */}
      <div className="mt-2 flex justify-center gap-3 text-xs text-gray-500">
        {(Object.keys(ACTION_LABELS) as DefensiveActionType[]).map((type) => (
          <span key={type} style={{ color: filters.has(type) ? ACTION_COLORS[type] : '#9ca3af' }}>
            {actionCounts[type]}
          </span>
        ))}
      </div>
    </div>
  );
}

export function DefensiveActionsMap({
  homeActions,
  awayActions,
  homeTeamName,
  awayTeamName,
  homeColor = '#1e40af',
  awayColor = '#dc2626',
  className = '',
}: DefensiveActionsMapProps) {
  const allTypes: DefensiveActionType[] = ['tackle', 'interception', 'recovery', 'clearance', 'block'];
  const [activeFilters, setActiveFilters] = useState<Set<DefensiveActionType>>(new Set(allTypes));

  const toggleFilter = (type: DefensiveActionType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  return (
    <div className={`pro-card p-5 ${className}`}>
      <h3 className="section-title text-center mb-3">Defensive Actions</h3>

      {/* Filter toggles */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {allTypes.map((type) => (
          <button
            key={type}
            onClick={() => toggleFilter(type)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeFilters.has(type)
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: activeFilters.has(type) ? ACTION_COLORS[type] : '#9ca3af',
              }}
            />
            {ACTION_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Two-column layout for home/away */}
      <div className="grid grid-cols-2 gap-4">
        <TeamDefensiveMap
          actions={homeActions}
          teamName={homeTeamName}
          teamColor={homeColor}
          filters={activeFilters}
          isAway={false}
        />
        <TeamDefensiveMap
          actions={awayActions}
          teamName={awayTeamName}
          teamColor={awayColor}
          filters={activeFilters}
          isAway={true}
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
        {allTypes.map((type) => (
          <div key={type} className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <ActionMarker type={type} x={6} y={6} color={ACTION_COLORS[type]} size={4} />
            </svg>
            <span>{ACTION_LABELS[type]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DefensiveActionsMap;
