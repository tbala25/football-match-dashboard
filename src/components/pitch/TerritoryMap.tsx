import { useEffect, useRef, useMemo } from 'react';
import type { Event } from '../../types/statsbomb';
import { STATSBOMB_PITCH } from '../../lib/coordinates';
import { calculatePossessionPercentage, calculateFieldTilt } from '../../lib/transformers';

interface TerritoryMapProps {
  events: Event[];
  homeTeamId: number;
  awayTeamId: number;
  homeColor?: string;
  awayColor?: string;
  className?: string;
}

export function TerritoryMap({
  events,
  homeTeamId,
  awayTeamId,
  homeColor = '#EF0107',
  awayColor = '#6CABDD',
  className = '',
}: TerritoryMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const possession = useMemo(
    () => calculatePossessionPercentage(events, homeTeamId, awayTeamId),
    [events, homeTeamId, awayTeamId]
  );

  const fieldTilt = useMemo(
    () => calculateFieldTilt(events, homeTeamId, awayTeamId),
    [events, homeTeamId, awayTeamId]
  );

  // Build density grid
  const gridCols = 24;
  const gridRows = 16;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 300;
    const height = 200;
    canvas.width = width;
    canvas.height = height;

    const cellWidth = width / gridCols;
    const cellHeight = height / gridRows;

    // Count events in each cell by team
    const homeGrid: number[][] = Array(gridRows).fill(0).map(() => Array(gridCols).fill(0));
    const awayGrid: number[][] = Array(gridRows).fill(0).map(() => Array(gridCols).fill(0));

    for (const event of events) {
      if (!event.location) continue;
      const [x, y] = event.location;
      const col = Math.min(Math.floor(x / (STATSBOMB_PITCH.width / gridCols)), gridCols - 1);
      const row = Math.min(Math.floor(y / (STATSBOMB_PITCH.height / gridRows)), gridRows - 1);

      if (event.team?.id === homeTeamId) {
        homeGrid[row][col]++;
      } else if (event.team?.id === awayTeamId) {
        awayGrid[row][col]++;
      }
    }

    // Find max for normalization
    let maxCount = 1;
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        maxCount = Math.max(maxCount, homeGrid[r][c], awayGrid[r][c]);
      }
    }

    // Draw gradient based on which team dominated each cell
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const homeVal = homeGrid[r][c];
        const awayVal = awayGrid[r][c];
        const total = homeVal + awayVal;

        if (total === 0) {
          ctx.fillStyle = '#f5f5f5';
        } else {
          const homeRatio = homeVal / total;
          const intensity = Math.min((homeVal + awayVal) / maxCount, 1) * 0.8;

          if (homeRatio > 0.5) {
            // Home dominated - red
            ctx.fillStyle = `rgba(239, 1, 7, ${intensity * homeRatio})`;
          } else {
            // Away dominated - blue
            ctx.fillStyle = `rgba(108, 171, 221, ${intensity * (1 - homeRatio)})`;
          }
        }

        ctx.fillRect(c * cellWidth, r * cellHeight, cellWidth, cellHeight);
      }
    }

    // Draw pitch markings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;

    // Center line
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 20, 0, Math.PI * 2);
    ctx.stroke();

    // Penalty areas
    const paWidth = (STATSBOMB_PITCH.penaltyAreaWidth / STATSBOMB_PITCH.height) * height;
    const paDepth = (STATSBOMB_PITCH.penaltyAreaDepth / STATSBOMB_PITCH.width) * width;

    ctx.strokeRect(0, (height - paWidth) / 2, paDepth, paWidth);
    ctx.strokeRect(width - paDepth, (height - paWidth) / 2, paDepth, paWidth);

  }, [events, homeTeamId, awayTeamId, homeColor, awayColor]);

  return (
    <div className={`bg-white p-4 ${className}`}>
      <div className="relative">
        {/* Possession label - left side */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-3">
          <div className="text-xs text-gray-400 -rotate-90 whitespace-nowrap" style={{ transformOrigin: 'center' }}>
            Possession
          </div>
        </div>

        {/* Field tilt label - right side */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-3">
          <div className="text-xs text-gray-400 rotate-90 whitespace-nowrap" style={{ transformOrigin: 'center' }}>
            Field tilt
          </div>
        </div>

        {/* Canvas with stats overlays */}
        <div className="relative inline-block">
          <canvas ref={canvasRef} className="rounded" />

          {/* Possession stats - left side */}
          <div
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white font-bold text-lg"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
          >
            <div>{possession.home}</div>
            <div className="text-sm opacity-80">{possession.away}</div>
          </div>

          {/* Field tilt stats - right side */}
          <div
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white font-bold text-lg text-right"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
          >
            <div>{Math.round(fieldTilt.home)}</div>
            <div className="text-sm opacity-80">{Math.round(fieldTilt.away)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TerritoryMap;
