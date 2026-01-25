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
  const containerRef = useRef<HTMLDivElement>(null);

  const possession = useMemo(
    () => calculatePossessionPercentage(events, homeTeamId, awayTeamId),
    [events, homeTeamId, awayTeamId]
  );

  const fieldTilt = useMemo(
    () => calculateFieldTilt(events, homeTeamId, awayTeamId),
    [events, homeTeamId, awayTeamId]
  );

  // Parse colors to RGB
  const parseColor = (hex: string) => {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16),
    };
  };

  const homeRGB = parseColor(homeColor);
  const awayRGB = parseColor(awayColor);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Make canvas fill container
    const width = container.clientWidth;
    const height = Math.min(width * 0.55, 250); // Maintain rough pitch aspect
    canvas.width = width;
    canvas.height = height;

    const gridCols = 24;
    const gridRows = 16;
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
        maxCount = Math.max(maxCount, homeGrid[r][c] + awayGrid[r][c]);
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
          const intensity = Math.min((total / maxCount) * 1.2, 1);

          // Blend colors based on dominance
          if (homeRatio >= 0.5) {
            const alpha = intensity * (homeRatio - 0.5) * 2 * 0.8;
            ctx.fillStyle = `rgba(${homeRGB.r}, ${homeRGB.g}, ${homeRGB.b}, ${alpha})`;
          } else {
            const alpha = intensity * (0.5 - homeRatio) * 2 * 0.8;
            ctx.fillStyle = `rgba(${awayRGB.r}, ${awayRGB.g}, ${awayRGB.b}, ${alpha})`;
          }
        }

        ctx.fillRect(c * cellWidth, r * cellHeight, cellWidth + 0.5, cellHeight + 0.5);
      }
    }

    // Draw pitch markings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5;

    // Center line
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Center circle
    const centerCircleRadius = (10 / STATSBOMB_PITCH.width) * width;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, centerCircleRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Penalty areas
    const paWidthPx = (STATSBOMB_PITCH.penaltyAreaWidth / STATSBOMB_PITCH.height) * height;
    const paDepthPx = (STATSBOMB_PITCH.penaltyAreaDepth / STATSBOMB_PITCH.width) * width;

    // Left penalty area
    ctx.strokeRect(0, (height - paWidthPx) / 2, paDepthPx, paWidthPx);
    // Right penalty area
    ctx.strokeRect(width - paDepthPx, (height - paWidthPx) / 2, paDepthPx, paWidthPx);

    // Goal areas
    const gaWidthPx = (STATSBOMB_PITCH.goalAreaWidth / STATSBOMB_PITCH.height) * height;
    const gaDepthPx = (STATSBOMB_PITCH.goalAreaDepth / STATSBOMB_PITCH.width) * width;

    ctx.strokeRect(0, (height - gaWidthPx) / 2, gaDepthPx, gaWidthPx);
    ctx.strokeRect(width - gaDepthPx, (height - gaWidthPx) / 2, gaDepthPx, gaWidthPx);

  }, [events, homeTeamId, awayTeamId, homeRGB, awayRGB]);

  return (
    <div className={`bg-white p-4 ${className}`}>
      <div className="flex items-center gap-4">
        {/* Possession - left side */}
        <div className="text-center w-16">
          <div className="text-xs text-gray-400 mb-1">Possession</div>
          <div className="font-bold text-lg" style={{ color: homeColor }}>{possession.home}</div>
          <div className="text-sm text-gray-500">{possession.away}</div>
        </div>

        {/* Territory map */}
        <div ref={containerRef} className="flex-1">
          <canvas ref={canvasRef} className="w-full rounded" />
        </div>

        {/* Field tilt - right side */}
        <div className="text-center w-16">
          <div className="text-xs text-gray-400 mb-1">Field tilt</div>
          <div className="font-bold text-lg" style={{ color: homeColor }}>{Math.round(fieldTilt.home)}</div>
          <div className="text-sm text-gray-500">{Math.round(fieldTilt.away)}</div>
        </div>
      </div>
    </div>
  );
}

export default TerritoryMap;
