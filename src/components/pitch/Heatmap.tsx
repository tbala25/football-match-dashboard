import { useEffect, useRef, useMemo } from 'react';
import type { HeatmapData } from '../../types/statsbomb';
import { STATSBOMB_PITCH } from '../../lib/coordinates';

interface HeatmapProps {
  data: HeatmapData;
  teamColor?: string;
  className?: string;
  opacity?: number;
  showPitchMarkings?: boolean;
}

export function Heatmap({
  data,
  teamColor = '#1e40af',
  className = '',
  opacity = 0.7,
  showPitchMarkings = true,
}: HeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert hex color to RGB
  const rgb = useMemo(() => {
    const hex = teamColor.replace('#', '');
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };
  }, [teamColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const width = container.clientWidth;
    const height = width / (STATSBOMB_PITCH.width / STATSBOMB_PITCH.height);
    canvas.width = width;
    canvas.height = height;

    const scaleX = width / STATSBOMB_PITCH.width;
    const scaleY = height / STATSBOMB_PITCH.height;

    // Draw pitch background
    ctx.fillStyle = '#2d5016';
    ctx.fillRect(0, 0, width, height);

    // Draw heatmap cells
    for (const cell of data.cells) {
      if (cell.value === 0) continue;

      const x = cell.x * scaleX;
      const y = cell.y * scaleY;
      const w = data.gridWidth * scaleX;
      const h = data.gridHeight * scaleY;

      // Color intensity based on value
      const intensity = cell.value;
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${intensity * opacity})`;
      ctx.fillRect(x, y, w, h);
    }

    // Draw pitch markings
    if (showPitchMarkings) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;

      // Center line
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      // Center circle
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 10 * scaleX, 0, Math.PI * 2);
      ctx.stroke();

      // Penalty areas
      const paWidth = STATSBOMB_PITCH.penaltyAreaWidth * scaleY;
      const paDepth = STATSBOMB_PITCH.penaltyAreaDepth * scaleX;
      const centerY = height / 2;

      // Left penalty area
      ctx.strokeRect(0, centerY - paWidth / 2, paDepth, paWidth);
      // Right penalty area
      ctx.strokeRect(width - paDepth, centerY - paWidth / 2, paDepth, paWidth);

      // Goal areas
      const gaWidth = STATSBOMB_PITCH.goalAreaWidth * scaleY;
      const gaDepth = STATSBOMB_PITCH.goalAreaDepth * scaleX;

      ctx.strokeRect(0, centerY - gaWidth / 2, gaDepth, gaWidth);
      ctx.strokeRect(width - gaDepth, centerY - gaWidth / 2, gaDepth, gaWidth);
    }
  }, [data, rgb, opacity, showPitchMarkings]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas ref={canvasRef} className="w-full rounded-lg" />

      {/* Gradient legend */}
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs p-2 rounded flex items-center gap-2">
        <span>Low</span>
        <div
          className="w-16 h-3 rounded"
          style={{
            background: `linear-gradient(to right, transparent, ${teamColor})`,
          }}
        />
        <span>High</span>
      </div>
    </div>
  );
}

export default Heatmap;
