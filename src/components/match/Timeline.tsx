import { useMemo, useState } from 'react';
import type { Event, XGTimelinePoint } from '../../types/statsbomb';
import { buildXGTimeline, getXGSummary } from '../../lib/transformers';
import { calculatePossessionPercentage } from '../../lib/transformers';

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
    <div className={`pro-card p-5 ${className}`}>
      <h3 className="section-title mb-4">Match Timeline</h3>

      {/* Stats summary grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Possession"
          home={`${possession.home}%`}
          away={`${possession.away}%`}
          homeValue={possession.home}
          awayValue={possession.away}
          homeColor={homeColor}
          awayColor={awayColor}
        />
        <StatCard
          label="xG"
          home={xgSummary.home.xg.toFixed(2)}
          away={xgSummary.away.xg.toFixed(2)}
          homeValue={xgSummary.home.xg}
          awayValue={xgSummary.away.xg}
          homeColor={homeColor}
          awayColor={awayColor}
        />
        <StatCard
          label="Shots"
          home={xgSummary.home.shots.toString()}
          away={xgSummary.away.shots.toString()}
          homeValue={xgSummary.home.shots}
          awayValue={xgSummary.away.shots}
          homeColor={homeColor}
          awayColor={awayColor}
        />
        <StatCard
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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="section-subtitle">xG Over Time</h4>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 rounded" style={{ backgroundColor: homeColor }} />
              {homeTeamName}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 rounded" style={{ backgroundColor: awayColor }} />
              {awayTeamName}
            </span>
          </div>
        </div>
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
        <h4 className="section-subtitle mb-3">Key Events</h4>
        <KeyEventsList
          xgTimeline={xgTimeline}
          homeColor={homeColor}
          awayColor={awayColor}
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  home: string;
  away: string;
  homeValue: number;
  awayValue: number;
  homeColor: string;
  awayColor: string;
}

function StatCard({ label, home, away, homeValue, awayValue, homeColor, awayColor }: StatCardProps) {
  const total = homeValue + awayValue || 1;
  const homeWidth = (homeValue / total) * 100;

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-xs text-gray-500 mb-2 text-center font-medium">{label}</div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold w-10 text-right" style={{ color: homeColor }}>{home}</span>
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${homeWidth}%`, backgroundColor: homeColor }}
          />
        </div>
        <span className="text-sm font-bold w-10 text-left" style={{ color: awayColor }}>{away}</span>
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
  const events = xgTimeline.filter((p) => p.event);

  if (events.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-4">No shot events recorded</p>;
  }

  return (
    <div className="space-y-1 max-h-56 overflow-y-auto custom-scrollbar">
      {events.map((point, i) => (
        <div
          key={i}
          className={`timeline-event ${point.event?.isGoal ? 'timeline-event-goal' : ''}`}
        >
          <span className="w-10 text-xs font-medium text-gray-400">{point.minute}'</span>
          <span
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${point.event?.isGoal ? 'ring-2 ring-offset-1' : ''}`}
            style={{
              backgroundColor: point.event?.team === 'home' ? homeColor : awayColor,
              ringColor: point.event?.isGoal ? (point.event.team === 'home' ? homeColor : awayColor) : 'transparent'
            }}
          />
          <span className="flex-1 text-sm font-medium truncate">{point.event?.player}</span>
          <span className="text-xs text-gray-500 font-mono">
            xG {point.event?.xg.toFixed(2)}
          </span>
          {point.event?.isGoal && (
            <span className="text-xs font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
              GOAL
            </span>
          )}
        </div>
      ))}
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
  const [hoveredPoint, setHoveredPoint] = useState<XGTimelinePoint | null>(null);

  const width = 100;
  const height = 50;
  const padding = { top: 8, right: 8, bottom: 16, left: 20 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xScale = (minute: number) =>
    padding.left + (minute / maxMinute) * chartWidth;
  const yScale = (xg: number) =>
    padding.top + chartHeight - (xg / (maxXG * 1.15)) * chartHeight;

  // Build line path for step chart
  const buildLinePath = (key: 'homeXG' | 'awayXG') => {
    if (timeline.length === 0) return '';
    let path = `M ${xScale(0)} ${yScale(0)}`;
    for (const point of timeline) {
      path += ` L ${xScale(point.minute)} ${yScale(point[key])}`;
    }
    return path;
  };

  // Build area path (closed shape for fill)
  const buildAreaPath = (key: 'homeXG' | 'awayXG') => {
    if (timeline.length === 0) return '';
    let path = `M ${xScale(0)} ${yScale(0)}`;
    for (const point of timeline) {
      path += ` L ${xScale(point.minute)} ${yScale(point[key])}`;
    }
    // Close the path back to baseline
    const lastPoint = timeline[timeline.length - 1];
    path += ` L ${xScale(lastPoint.minute)} ${yScale(0)}`;
    path += ` L ${xScale(0)} ${yScale(0)} Z`;
    return path;
  };

  // Goal events for markers
  const goals = timeline.filter((p) => p.event?.isGoal);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
        {/* Background grid */}
        <g stroke="#e5e7eb" strokeWidth={0.2}>
          {[0, 15, 30, 45, 60, 75, 90].filter(m => m <= maxMinute).map((m) => (
            <line
              key={m}
              x1={xScale(m)}
              y1={padding.top}
              x2={xScale(m)}
              y2={padding.top + chartHeight}
              strokeDasharray={m === 45 ? "1,1" : "0"}
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
          <g>
            <line
              x1={xScale(45)}
              y1={padding.top - 2}
              x2={xScale(45)}
              y2={padding.top + chartHeight}
              stroke="#9ca3af"
              strokeWidth={0.5}
              strokeDasharray="1.5,1.5"
            />
            <text
              x={xScale(45)}
              y={padding.top - 3}
              fontSize={2.5}
              fill="#9ca3af"
              textAnchor="middle"
            >
              HT
            </text>
          </g>
        )}

        {/* Area fills (semi-transparent) */}
        <path
          d={buildAreaPath('homeXG')}
          fill={homeColor}
          fillOpacity={0.12}
        />
        <path
          d={buildAreaPath('awayXG')}
          fill={awayColor}
          fillOpacity={0.12}
        />

        {/* xG lines */}
        <path
          d={buildLinePath('homeXG')}
          fill="none"
          stroke={homeColor}
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={buildLinePath('awayXG')}
          fill="none"
          stroke={awayColor}
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Goal markers with labels */}
        {goals.map((point, i) => {
          const isHome = point.event?.team === 'home';
          const cx = xScale(point.minute);
          const cy = yScale(isHome ? point.homeXG : point.awayXG);
          const color = isHome ? homeColor : awayColor;

          return (
            <g key={i}>
              {/* Outer glow */}
              <circle
                cx={cx}
                cy={cy}
                r={3}
                fill={color}
                fillOpacity={0.2}
              />
              {/* Main marker */}
              <circle
                cx={cx}
                cy={cy}
                r={2}
                fill={color}
                stroke="#fff"
                strokeWidth={0.6}
              />
              {/* Player name label */}
              <text
                x={cx}
                y={cy - 4}
                fontSize={2.2}
                fill={color}
                textAnchor="middle"
                fontWeight="bold"
              >
                {point.event?.player?.split(' ').pop()}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        <g fontSize={2.5} fill="#6b7280" textAnchor="middle">
          <text x={xScale(0)} y={height - 4}>0'</text>
          {maxMinute >= 45 && <text x={xScale(45)} y={height - 4}>45'</text>}
          {maxMinute >= 90 && <text x={xScale(90)} y={height - 4}>90'</text>}
          {maxMinute > 90 && <text x={xScale(maxMinute)} y={height - 4}>{maxMinute}'</text>}
        </g>

        {/* Y-axis labels */}
        <g fontSize={2.5} fill="#6b7280" textAnchor="end">
          <text x={padding.left - 2} y={yScale(0) + 0.8}>0</text>
          <text x={padding.left - 2} y={yScale(maxXG) + 0.8}>{maxXG.toFixed(1)}</text>
        </g>

        {/* Final xG values at end of lines */}
        {timeline.length > 0 && (
          <>
            <text
              x={xScale(timeline[timeline.length - 1].minute) + 1}
              y={yScale(timeline[timeline.length - 1].homeXG)}
              fontSize={2.5}
              fill={homeColor}
              fontWeight="bold"
              alignmentBaseline="middle"
            >
              {timeline[timeline.length - 1].homeXG.toFixed(2)}
            </text>
            <text
              x={xScale(timeline[timeline.length - 1].minute) + 1}
              y={yScale(timeline[timeline.length - 1].awayXG)}
              fontSize={2.5}
              fill={awayColor}
              fontWeight="bold"
              alignmentBaseline="middle"
            >
              {timeline[timeline.length - 1].awayXG.toFixed(2)}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

export default Timeline;
