import { useMemo, useRef, useEffect } from 'react';
import type { Event } from '../../types/statsbomb';
import { buildPossessionTimeline } from '../../lib/transformers/possession';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Build possession by minute using DURATION-based calculation (not event counts)
  const possessionByMinute = useMemo(() => {
    const possessionPeriods = buildPossessionTimeline(events);

    // Get max minute from events
    const maxMinute = Math.max(
      ...events.map(e => e.minute + (e.period === 2 ? 45 : 0)),
      90
    );

    const minutes: { minute: number; homeDuration: number; awayDuration: number }[] = [];

    for (let m = 0; m <= maxMinute; m++) {
      let homeDuration = 0;
      let awayDuration = 0;

      // Calculate duration each team held possession during this minute
      for (const period of possessionPeriods) {
        const periodOffset = period.period === 2 ? 45 : 0;
        const startMin = period.startMinute + periodOffset + period.startSecond / 60;
        const endMin = period.endMinute + periodOffset + period.endSecond / 60;

        // Check if this possession period overlaps with minute m
        if (endMin > m && startMin < m + 1) {
          const overlapStart = Math.max(startMin, m);
          const overlapEnd = Math.min(endMin, m + 1);
          const duration = (overlapEnd - overlapStart) * 60; // in seconds

          if (period.teamId === homeTeamId) {
            homeDuration += duration;
          } else if (period.teamId === awayTeamId) {
            awayDuration += duration;
          }
        }
      }

      minutes.push({ minute: m, homeDuration, awayDuration });
    }

    return minutes;
  }, [events, homeTeamId, awayTeamId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = container.clientWidth;
    const height = 60;
    canvas.width = width;
    canvas.height = height;

    const barHeight = 25;
    const centerY = height / 2;
    const numMinutes = possessionByMinute.length;
    const barWidth = Math.max(width / numMinutes, 2);

    // Max possible duration per minute is 60 seconds
    const maxDuration = 60;

    // Clear canvas
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, height);

    // Draw center line
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw bars based on possession duration
    possessionByMinute.forEach((m, i) => {
      const x = (i / numMinutes) * width;

      // Home team bar (pointing up) - scaled by duration in seconds
      if (m.homeDuration > 0) {
        const homeHeight = (m.homeDuration / maxDuration) * barHeight;
        ctx.fillStyle = homeColor;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(x, centerY - homeHeight, barWidth - 0.5, homeHeight);
      }

      // Away team bar (pointing down) - scaled by duration in seconds
      if (m.awayDuration > 0) {
        const awayHeight = (m.awayDuration / maxDuration) * barHeight;
        ctx.fillStyle = awayColor;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(x, centerY, barWidth - 0.5, awayHeight);
      }
    });

    ctx.globalAlpha = 1;

    // Draw time markers
    ctx.fillStyle = '#9ca3af';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';

    const timeMarkers = [1, 15, 30, 45, 60, 75, 90];
    timeMarkers.forEach(minute => {
      if (minute <= numMinutes) {
        const x = (minute / numMinutes) * width;
        ctx.fillText(`${minute}'`, x, height - 2);
      }
    });

  }, [possessionByMinute, homeColor, awayColor]);

  return (
    <div className={`bg-white p-4 ${className}`}>
      <div ref={containerRef} className="w-full">
        <canvas ref={canvasRef} className="w-full" style={{ height: '60px' }} />
      </div>
    </div>
  );
}

export default PossessionTimeline;
