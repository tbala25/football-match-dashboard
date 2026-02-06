import { useState, useMemo, useRef } from 'react';
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

// Gradient color stops for 3D depth effect
const GRADIENT_COLORS: Record<DefensiveActionType, { light: string; dark: string }> = {
  tackle: { light: '#4ade80', dark: '#15803d' },
  interception: { light: '#60a5fa', dark: '#1d4ed8' },
  recovery: { light: '#fbbf24', dark: '#b45309' },
  clearance: { light: '#a78bfa', dark: '#5b21b6' },
  block: { light: '#f87171', dark: '#b91c1c' },
};

const ACTION_LABELS: Record<DefensiveActionType, string> = {
  tackle: 'Tackles',
  interception: 'Interceptions',
  recovery: 'Recoveries',
  clearance: 'Clearances',
  block: 'Blocks',
};

// SVG gradient and filter definitions
function SvgDefs() {
  return (
    <defs>
      {/* Radial gradients for each action type */}
      {(Object.keys(GRADIENT_COLORS) as DefensiveActionType[]).map((type) => (
        <radialGradient key={type} id={`grad-${type}`} cx="30%" cy="30%">
          <stop offset="0%" stopColor={GRADIENT_COLORS[type].light} />
          <stop offset="100%" stopColor={GRADIENT_COLORS[type].dark} />
        </radialGradient>
      ))}

      {/* Drop shadow filter */}
      <filter id="marker-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodOpacity="0.35" />
      </filter>

      {/* Glow filter for hover state */}
      <filter id="marker-glow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

// SVG marker shapes with gradient fills
function ActionMarker({
  type,
  x,
  y,
  size = 6,
  isHovered = false,
}: {
  type: DefensiveActionType;
  x: number;
  y: number;
  size?: number;
  isHovered?: boolean;
}) {
  const gradientId = `grad-${type}`;
  const filterId = isHovered ? 'marker-glow' : 'marker-shadow';
  const scale = isHovered ? 1.2 : 1;

  const transform = `translate(${x}, ${y}) scale(${scale})`;

  switch (type) {
    case 'tackle':
      return (
        <circle
          r={size}
          fill={`url(#${gradientId})`}
          filter={`url(#${filterId})`}
          transform={transform}
          style={{ transformOrigin: `${x}px ${y}px`, transition: 'transform 0.15s ease-out' }}
        />
      );
    case 'interception':
      return (
        <polygon
          points={`0,${-size} ${size},0 0,${size} ${-size},0`}
          fill={`url(#${gradientId})`}
          filter={`url(#${filterId})`}
          transform={transform}
          style={{ transformOrigin: `${x}px ${y}px`, transition: 'transform 0.15s ease-out' }}
        />
      );
    case 'recovery':
      return (
        <polygon
          points={`0,${-size} ${size},${size * 0.6} ${-size},${size * 0.6}`}
          fill={`url(#${gradientId})`}
          filter={`url(#${filterId})`}
          transform={transform}
          style={{ transformOrigin: `${x}px ${y}px`, transition: 'transform 0.15s ease-out' }}
        />
      );
    case 'clearance':
      return (
        <rect
          x={-size * 0.7}
          y={-size * 0.7}
          width={size * 1.4}
          height={size * 1.4}
          fill={`url(#${gradientId})`}
          filter={`url(#${filterId})`}
          transform={transform}
          style={{ transformOrigin: `${x}px ${y}px`, transition: 'transform 0.15s ease-out' }}
        />
      );
    case 'block':
      return (
        <g
          filter={`url(#${filterId})`}
          transform={transform}
          style={{ transformOrigin: `${x}px ${y}px`, transition: 'transform 0.15s ease-out' }}
        >
          <line
            x1={-size}
            y1={-size}
            x2={size}
            y2={size}
            stroke={`url(#${gradientId})`}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <line
            x1={size}
            y1={-size}
            x2={-size}
            y2={size}
            stroke={`url(#${gradientId})`}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>
      );
  }
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  action: DefensiveAction | null;
}

function TeamDefensiveMap({
  actions,
  teamName,
  teamColor,
  filters,
  isAway,
  onHover,
  hoveredId,
}: {
  actions: DefensiveAction[];
  teamName: string;
  teamColor: string;
  filters: Set<DefensiveActionType>;
  isAway: boolean;
  onHover: (action: DefensiveAction | null, x: number, y: number) => void;
  hoveredId: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredActions = useMemo(() => {
    return actions.filter((a) => filters.has(a.type));
  }, [actions, filters]);

  const totalActions = actions.length;

  return (
    <div ref={containerRef}>
      <h4 className="text-sm font-semibold mb-2 text-center" style={{ color: teamColor }}>
        {teamName}
      </h4>
      <Pitch>
        {(mapper: CoordinateMapper) => (
          <g className="defensive-actions">
            <SvgDefs />
            {filteredActions.map((action) => {
              const x = isAway ? 120 - action.x : action.x;
              const pos = mapper.toViewport(x, action.y);
              const isHovered = hoveredId === action.id;

              return (
                <g
                  key={action.id}
                  className="cursor-pointer"
                  onMouseEnter={(e) => {
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (rect) {
                      onHover(action, e.clientX, e.clientY);
                    }
                  }}
                  onMouseLeave={() => onHover(null, 0, 0)}
                >
                  <ActionMarker
                    type={action.type}
                    x={pos.x}
                    y={pos.y}
                    size={5}
                    isHovered={isHovered}
                  />
                </g>
              );
            })}
          </g>
        )}
      </Pitch>
      {/* Stat summary */}
      <div className="mt-2 text-center text-xs text-gray-500">
        <span className="font-semibold text-gray-700">{totalActions}</span> defensive actions
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
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    action: null,
  });

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

  const handleHover = (action: DefensiveAction | null, x: number, y: number) => {
    if (action) {
      setTooltip({ visible: true, x, y, action });
    } else {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }
  };

  // Calculate totals for legend
  const homeCounts = useMemo(() => {
    const counts: Record<DefensiveActionType, number> = {
      tackle: 0, interception: 0, recovery: 0, clearance: 0, block: 0,
    };
    for (const a of homeActions) counts[a.type]++;
    return counts;
  }, [homeActions]);

  const awayCounts = useMemo(() => {
    const counts: Record<DefensiveActionType, number> = {
      tackle: 0, interception: 0, recovery: 0, clearance: 0, block: 0,
    };
    for (const a of awayActions) counts[a.type]++;
    return counts;
  }, [awayActions]);

  return (
    <div className={`pro-card p-5 ${className}`}>
      <h3 className="section-title text-center mb-4">Defensive Actions</h3>

      {/* Filter pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-5">
        {allTypes.map((type) => {
          const isActive = activeFilters.has(type);
          const total = homeCounts[type] + awayCounts[type];
          return (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={`filter-pill ${isActive ? 'active' : ''}`}
              aria-pressed={isActive}
            >
              <span
                className="filter-indicator"
                style={{ backgroundColor: GRADIENT_COLORS[type].dark }}
              />
              {ACTION_LABELS[type]}
              <span className="count-badge">({total})</span>
            </button>
          );
        })}
      </div>

      {/* Two-column pitch layout */}
      <div className="grid grid-cols-2 gap-4">
        <TeamDefensiveMap
          actions={homeActions}
          teamName={homeTeamName}
          teamColor={homeColor}
          filters={activeFilters}
          isAway={false}
          onHover={handleHover}
          hoveredId={tooltip.action?.id ?? null}
        />
        <TeamDefensiveMap
          actions={awayActions}
          teamName={awayTeamName}
          teamColor={awayColor}
          filters={activeFilters}
          isAway={true}
          onHover={handleHover}
          hoveredId={tooltip.action?.id ?? null}
        />
      </div>

      {/* Glass-morphism legend */}
      <div className="glass-legend p-4 mt-4">
        <div className="grid grid-cols-5 gap-4">
          {allTypes.map((type) => {
            const homeCount = homeCounts[type];
            const awayCount = awayCounts[type];
            const isActive = activeFilters.has(type);
            return (
              <div
                key={type}
                className={`flex flex-col items-center transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}
              >
                <svg width="28" height="28" viewBox="0 0 28 28">
                  <SvgDefs />
                  <ActionMarker type={type} x={14} y={14} size={8} />
                </svg>
                <span className="text-[10px] text-gray-600 font-medium mt-1">
                  {ACTION_LABELS[type]}
                </span>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-xs font-bold" style={{ color: homeColor }}>
                    {homeCount}
                  </span>
                  <span className="text-[10px] text-gray-300">|</span>
                  <span className="text-xs font-bold" style={{ color: awayColor }}>
                    {awayCount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating tooltip */}
      {tooltip.visible && tooltip.action && (
        <div
          className="tooltip-floating"
          style={{
            left: tooltip.x,
            top: tooltip.y - 12,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="tooltip-content">
            <div className="font-semibold">{tooltip.action.playerName}</div>
            <div className="text-gray-300 flex items-center gap-2">
              <span>{tooltip.action.minute}'</span>
              <span className="w-1 h-1 rounded-full bg-gray-500" />
              <span>{ACTION_LABELS[tooltip.action.type]}</span>
            </div>
            {tooltip.action.outcome && (
              <div className="text-[10px] text-gray-400 mt-0.5">{tooltip.action.outcome}</div>
            )}
          </div>
          <div className="tooltip-connector" />
        </div>
      )}
    </div>
  );
}

export default DefensiveActionsMap;
