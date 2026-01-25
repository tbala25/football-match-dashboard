import { useMemo } from 'react';
import type { Event } from '../../types/statsbomb';

interface PossessionTimelineProps {
  events: Event[];
  homeTeamId: number;
  awayTeamId: number;
  homeColor?: string;
  awayColor?: string;
  className?: string;
}

export function PossessionTimeline({
  events,
  homeTeamId,
  awayTeamId,
  homeColor = '#EF0107',
  awayColor = '#6CABDD',
  className = '',
}: PossessionTimelineProps) {
  // Build possession by minute
  const possessionByMinute = useMemo(() => {
    const minutes: { minute: number; homeCount: number; awayCount: number }[] = [];

    for (let m = 1; m <= 90; m++) {
      const minuteEvents = events.filter(e => {
        const eventMinute = e.minute + (e.period === 2 ? 45 : 0);
        return eventMinute >= m && eventMinute < m + 1;
      });

      const homeCount = minuteEvents.filter(e => e.possession_team?.id === homeTeamId).length;
      const awayCount = minuteEvents.filter(e => e.possession_team?.id === awayTeamId).length;

      minutes.push({ minute: m, homeCount, awayCount });
    }

    return minutes;
  }, [events, homeTeamId, awayTeamId]);

  const maxCount = Math.max(
    ...possessionByMinute.map(m => Math.max(m.homeCount, m.awayCount)),
    1
  );

  const barHeight = 30;
  const width = 400;
  const barWidth = width / 90;

  return (
    <div className={`bg-white p-4 ${className}`}>
      <svg width={width} height={barHeight * 2 + 20} className="mx-auto">
        {/* Home team bars (pointing up) */}
        <g>
          {possessionByMinute.map((m, i) => {
            const height = (m.homeCount / maxCount) * barHeight;
            return (
              <rect
                key={`home-${i}`}
                x={i * barWidth}
                y={barHeight - height}
                width={barWidth - 1}
                height={height}
                fill={homeColor}
                opacity={0.7}
              />
            );
          })}
        </g>

        {/* Center line */}
        <line
          x1={0}
          y1={barHeight}
          x2={width}
          y2={barHeight}
          stroke="#e5e7eb"
          strokeWidth={1}
        />

        {/* Away team bars (pointing down) */}
        <g>
          {possessionByMinute.map((m, i) => {
            const height = (m.awayCount / maxCount) * barHeight;
            return (
              <rect
                key={`away-${i}`}
                x={i * barWidth}
                y={barHeight}
                width={barWidth - 1}
                height={height}
                fill={awayColor}
                opacity={0.7}
              />
            );
          })}
        </g>

        {/* Time labels */}
        <g fontSize={9} fill="#9ca3af" textAnchor="middle">
          <text x={0} y={barHeight * 2 + 15}>1'</text>
          <text x={width * 0.166} y={barHeight * 2 + 15}>15'</text>
          <text x={width * 0.333} y={barHeight * 2 + 15}>30'</text>
          <text x={width * 0.5} y={barHeight * 2 + 15}>45'</text>
          <text x={width * 0.666} y={barHeight * 2 + 15}>60'</text>
          <text x={width * 0.833} y={barHeight * 2 + 15}>75'</text>
          <text x={width} y={barHeight * 2 + 15}>90'</text>
        </g>
      </svg>
    </div>
  );
}

export default PossessionTimeline;
