import { useMemo, useRef, useEffect } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Build possession by minute
  const possessionByMinute = useMemo(() => {
    // Get max minute from events
    const maxMinute = Math.max(
      ...events.map(e => e.minute + (e.period === 2 ? 45 : 0)),
      90
    );

    const minutes: { minute: number; homeCount: number; awayCount: number }[] = [];

    for (let m = 0; m <= maxMinute; m++) {
      const minuteEvents = events.filter(e => {
        const eventMinute = e.minute + (e.period === 2 ? 45 : 0);
        return Math.floor(eventMinute) === m;
      });

      const homeCount = minuteEvents.filter(e => e.possession_team?.id === homeTeamId).length;
      const awayCount = minuteEvents.filter(e => e.possession_team?.id === awayTeamId).length;

      minutes.push({ minute: m, homeCount, awayCount });
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

    // Find max count for scaling
    const maxCount = Math.max(
      ...possessionByMinute.map(m => Math.max(m.homeCount, m.awayCount)),
      1
    );

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

    // Draw bars
    possessionByMinute.forEach((m, i) => {
      const x = (i / numMinutes) * width;

      // Home team bar (pointing up)
      if (m.homeCount > 0) {
        const homeHeight = (m.homeCount / maxCount) * barHeight;
        ctx.fillStyle = homeColor;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(x, centerY - homeHeight, barWidth - 0.5, homeHeight);
      }

      // Away team bar (pointing down)
      if (m.awayCount > 0) {
        const awayHeight = (m.awayCount / maxCount) * barHeight;
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
