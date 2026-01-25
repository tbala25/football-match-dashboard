import { useMemo } from 'react';
import type { Event, XGTimelinePoint } from '../../types/statsbomb';
import { buildXGTimeline, getXGSummary } from '../../lib/transformers';
import { calculatePossessionPercentage, getRollingPossession } from '../../lib/transformers';

interface TimelineProps {
  events: Event[];
  homeTeamId: number;
  awayTeamId: number;
  homeTeamName: string;
  awayTeamName: string;
  homeColor?: string;
  awayColor?: string;
  className?: string;
}

export function Timeline({
  events,
  homeTeamId,
  awayTeamId,
  homeTeamName,
  awayTeamName,
  homeColor = '#1e40af',
  awayColor = '#dc2626',
  className = '',
}: TimelineProps) {
  const xgTimeline = useMemo(
    () => buildXGTimeline(events, homeTeamId, awayTeamId),
    [events, homeTeamId, awayTeamId]
  );

  const xgSummary = useMemo(
    () => getXGSummary(events, homeTeamId, awayTeamId),
    [events, homeTeamId, awayTeamId]
  );

  const possession = useMemo(
    () => calculatePossessionPercentage(events, homeTeamId, awayTeamId),
    [events, homeTeamId, awayTeamId]
  );

  const maxMinute = xgTimeline.length > 0 ? xgTimeline[xgTimeline.length - 1].minute : 90;
  const maxXG = Math.max(
    ...xgTimeline.map((p) => Math.max(p.homeXG, p.awayXG)),
    0.5
  );

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="font-bold text-lg mb-4">Match Timeline</h3>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatComparison
          label="Possession"
          home={`${possession.home}%`}
          away={`${possession.away}%`}
          homeValue={possession.home}
          awayValue={possession.away}
          homeColor={homeColor}
          awayColor={awayColor}
        />
        <StatComparison
          label="xG"
          home={xgSummary.home.xg.toFixed(2)}
          away={xgSummary.away.xg.toFixed(2)}
          homeValue={xgSummary.home.xg}
          awayValue={xgSummary.away.xg}
          homeColor={homeColor}
          awayColor={awayColor}
        />
        <StatComparison
          label="Shots"
          home={xgSummary.home.shots.toString()}
          away={xgSummary.away.shots.toString()}
          homeValue={xgSummary.home.shots}
          awayValue={xgSummary.away.shots}
          homeColor={homeColor}
          awayColor={awayColor}
        />
        <StatComparison
          label="On Target"
          home={xgSummary.home.onTarget.toString()}
          away={xgSummary.away.onTarget.toString()}
          homeValue={xgSummary.home.onTarget}
          awayValue={xgSummary.away.onTarget}
          homeColor={homeColor}
          awayColor={awayColor}
        />
      </div>

      {/* xG Timeline chart */}
      <div className="mb-4">
        <h4 className="text-sm text-gray-500 mb-2">xG Over Time</h4>
        <XGChart
          timeline={xgTimeline}
          maxMinute={maxMinute}
          maxXG={maxXG}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          homeColor={homeColor}
          awayColor={awayColor}
        />
      </div>

      {/* Key events list */}
      <div>
        <h4 className="text-sm text-gray-500 mb-2">Key Events</h4>
        <KeyEventsList
          xgTimeline={xgTimeline}
          homeColor={homeColor}
          awayColor={awayColor}
        />
      </div>
    </div>
  );
}

interface KeyEventsListProps {
  xgTimeline: XGTimelinePoint[];
  homeColor: string;
  awayColor: string;
}

function KeyEventsList({ xgTimeline, homeColor, awayColor }: KeyEventsListProps) {
  return (
    <div className="space-y-1 max-h-48 overflow-y-auto">
      {xgTimeline
        .filter((p) => p.event)
        .map((point, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 text-sm py-1 px-2 rounded ${
              point.event?.isGoal ? 'bg-green-50' : 'bg-gray-50'
            }`}
          >
            <span className="w-8 text-gray-400">{point.minute}'</span>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: point.event?.team === 'home' ? homeColor : awayColor }}
            />
            <span className="flex-1">{point.event?.player}</span>
            <span className="text-gray-500">
              xG: {point.event?.xg.toFixed(2)}
            </span>
            {point.event?.isGoal && (
              <span className="text-green-600 font-bold">GOAL!</span>
            )}
          </div>
        ))}
    </div>
  );
}

interface StatComparisonProps {
  label: string;
  home: string;
  away: string;
  homeValue: number;
  awayValue: number;
  homeColor: string;
  awayColor: string;
}

function StatComparison({ label, home, away, homeValue, awayValue, homeColor, awayColor }: StatComparisonProps) {
  const total = homeValue + awayValue || 1;
  const homeWidth = (homeValue / total) * 100;

  return (
    <div className="text-center">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <span className="w-10 text-right font-semibold" style={{ color: homeColor }}>{home}</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all"
            style={{ width: `${homeWidth}%`, backgroundColor: homeColor }}
          />
        </div>
        <span className="w-10 text-left font-semibold" style={{ color: awayColor }}>{away}</span>
      </div>
    </div>
  );
}

interface XGChartProps {
  timeline: XGTimelinePoint[];
  maxMinute: number;
  maxXG: number;
  homeTeamName: string;
  awayTeamName: string;
  homeColor: string;
  awayColor: string;
}

function XGChart({ timeline, maxMinute, maxXG, homeTeamName, awayTeamName, homeColor, awayColor }: XGChartProps) {
  const width = 100;
  const height = 60;
  const padding = { top: 5, right: 5, bottom: 15, left: 25 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xScale = (minute: number) =>
    padding.left + (minute / maxMinute) * chartWidth;
  const yScale = (xg: number) =>
    padding.top + chartHeight - (xg / (maxXG * 1.1)) * chartHeight;

  // Build path for step chart
  const buildPath = (key: 'homeXG' | 'awayXG') => {
    if (timeline.length === 0) return '';
    let path = `M ${xScale(0)} ${yScale(0)}`;
    for (const point of timeline) {
      path += ` L ${xScale(point.minute)} ${yScale(point[key])}`;
    }
    return path;
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
      {/* Grid lines */}
      <g stroke="#e5e7eb" strokeWidth={0.3}>
        {[0, 15, 30, 45, 60, 75, 90].filter(m => m <= maxMinute).map((m) => (
          <line
            key={m}
            x1={xScale(m)}
            y1={padding.top}
            x2={xScale(m)}
            y2={padding.top + chartHeight}
          />
        ))}
        {[0, maxXG / 2, maxXG].map((xg, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={yScale(xg)}
            x2={padding.left + chartWidth}
            y2={yScale(xg)}
          />
        ))}
      </g>

      {/* Half-time marker */}
      {maxMinute >= 45 && (
        <line
          x1={xScale(45)}
          y1={padding.top}
          x2={xScale(45)}
          y2={padding.top + chartHeight}
          stroke="#9ca3af"
          strokeWidth={0.5}
          strokeDasharray="2,2"
        />
      )}

      {/* xG lines */}
      <path
        d={buildPath('homeXG')}
        fill="none"
        stroke={homeColor}
        strokeWidth={1.5}
      />
      <path
        d={buildPath('awayXG')}
        fill="none"
        stroke={awayColor}
        strokeWidth={1.5}
      />

      {/* Goal markers */}
      {timeline
        .filter((p) => p.event?.isGoal)
        .map((point, i) => (
          <circle
            key={i}
            cx={xScale(point.minute)}
            cy={yScale(point.event?.team === 'home' ? point.homeXG : point.awayXG)}
            r={2}
            fill={point.event?.team === 'home' ? homeColor : awayColor}
            stroke="#fff"
            strokeWidth={0.5}
          />
        ))}

      {/* X-axis labels */}
      <g fontSize={3} fill="#6b7280" textAnchor="middle">
        <text x={xScale(0)} y={height - 2}>0</text>
        {maxMinute >= 45 && <text x={xScale(45)} y={height - 2}>45</text>}
        <text x={xScale(maxMinute)} y={height - 2}>{maxMinute}</text>
      </g>

      {/* Y-axis labels */}
      <g fontSize={3} fill="#6b7280" textAnchor="end">
        <text x={padding.left - 2} y={yScale(0) + 1}>0</text>
        <text x={padding.left - 2} y={yScale(maxXG) + 1}>{maxXG.toFixed(1)}</text>
      </g>

      {/* Legend */}
      <g transform={`translate(${padding.left + 2}, ${padding.top + 2})`}>
        <line x1={0} y1={0} x2={4} y2={0} stroke={homeColor} strokeWidth={1} />
        <text x={5} y={1} fontSize={2.5} fill={homeColor}>{homeTeamName}</text>
        <line x1={0} y1={4} x2={4} y2={4} stroke={awayColor} strokeWidth={1} />
        <text x={5} y={5} fontSize={2.5} fill={awayColor}>{awayTeamName}</text>
      </g>
    </svg>
  );
}

export default Timeline;
