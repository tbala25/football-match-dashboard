import { useMemo, useRef, useEffect, useState, ReactNode } from 'react';
import { STATSBOMB_PITCH, createCoordinateMapper, type CoordinateMapper } from '../../lib/coordinates';

interface PitchProps {
  width?: number;
  height?: number;
  className?: string;
  showGrid?: boolean;
  children?: ReactNode | ((mapper: CoordinateMapper) => ReactNode);
}

export function Pitch({
  width: propWidth,
  height: propHeight,
  className = '',
  showGrid = false,
  children,
}: PitchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    if (!containerRef.current) return;
    if (propWidth && propHeight) {
      setDimensions({ width: propWidth, height: propHeight });
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const containerWidth = entry.contentRect.width;
        // Maintain 3:2 aspect ratio (120:80)
        const aspectRatio = STATSBOMB_PITCH.width / STATSBOMB_PITCH.height;
        const height = containerWidth / aspectRatio;
        setDimensions({ width: containerWidth, height });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [propWidth, propHeight]);

  const mapper = useMemo(
    () => createCoordinateMapper(dimensions),
    [dimensions.width, dimensions.height]
  );

  const { width, height } = dimensions;
  const p = STATSBOMB_PITCH;

  // Scale pitch markings
  const scale = (val: number, isY: boolean = false) =>
    isY ? (val / p.height) * height : (val / p.width) * width;

  // Key coordinates
  const centerX = width / 2;
  const centerY = height / 2;
  const penaltyAreaWidth = scale(p.penaltyAreaWidth, true);
  const penaltyAreaDepth = scale(p.penaltyAreaDepth);
  const goalAreaWidth = scale(p.goalAreaWidth, true);
  const goalAreaDepth = scale(p.goalAreaDepth);
  const centerCircleRadius = scale(p.centerCircleRadius);
  const penaltySpotDistance = scale(p.penaltySpotDistance);
  const penaltyArcRadius = scale(p.centerCircleRadius);
  const cornerRadius = scale(p.cornerArcRadius);

  return (
    <div ref={containerRef} className={`pitch-container ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block"
      >
        {/* Pitch background */}
        <rect x={0} y={0} width={width} height={height} fill="#2d5016" />

        {/* Pitch stripes (optional aesthetic) */}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect
            key={i}
            x={(width / 12) * i}
            y={0}
            width={width / 12}
            height={height}
            fill={i % 2 === 0 ? '#2d5016' : '#2a4a14'}
          />
        ))}

        {/* Pitch markings */}
        <g stroke="rgba(255,255,255,0.8)" strokeWidth={2} fill="none">
          {/* Outer boundary */}
          <rect x={2} y={2} width={width - 4} height={height - 4} />

          {/* Center line */}
          <line x1={centerX} y1={2} x2={centerX} y2={height - 2} />

          {/* Center circle */}
          <circle cx={centerX} cy={centerY} r={centerCircleRadius} />

          {/* Center spot */}
          <circle cx={centerX} cy={centerY} r={3} fill="rgba(255,255,255,0.8)" />

          {/* Left penalty area */}
          <rect
            x={2}
            y={centerY - penaltyAreaWidth / 2}
            width={penaltyAreaDepth}
            height={penaltyAreaWidth}
          />

          {/* Right penalty area */}
          <rect
            x={width - penaltyAreaDepth - 2}
            y={centerY - penaltyAreaWidth / 2}
            width={penaltyAreaDepth}
            height={penaltyAreaWidth}
          />

          {/* Left goal area */}
          <rect
            x={2}
            y={centerY - goalAreaWidth / 2}
            width={goalAreaDepth}
            height={goalAreaWidth}
          />

          {/* Right goal area */}
          <rect
            x={width - goalAreaDepth - 2}
            y={centerY - goalAreaWidth / 2}
            width={goalAreaDepth}
            height={goalAreaWidth}
          />

          {/* Left penalty spot */}
          <circle
            cx={penaltySpotDistance + 2}
            cy={centerY}
            r={3}
            fill="rgba(255,255,255,0.8)"
          />

          {/* Right penalty spot */}
          <circle
            cx={width - penaltySpotDistance - 2}
            cy={centerY}
            r={3}
            fill="rgba(255,255,255,0.8)"
          />

          {/* Left penalty arc */}
          <path
            d={describeArc(
              penaltySpotDistance + 2,
              centerY,
              penaltyArcRadius,
              -50,
              50
            )}
          />

          {/* Right penalty arc */}
          <path
            d={describeArc(
              width - penaltySpotDistance - 2,
              centerY,
              penaltyArcRadius,
              130,
              230
            )}
          />

          {/* Corner arcs */}
          <path d={describeArc(2, 2, cornerRadius, 0, 90)} />
          <path d={describeArc(width - 2, 2, cornerRadius, 90, 180)} />
          <path d={describeArc(width - 2, height - 2, cornerRadius, 180, 270)} />
          <path d={describeArc(2, height - 2, cornerRadius, 270, 360)} />

          {/* Goals (behind the lines) */}
          <rect
            x={-8}
            y={centerY - scale(p.goalWidth, true) / 2}
            width={8}
            height={scale(p.goalWidth, true)}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth={1}
          />
          <rect
            x={width}
            y={centerY - scale(p.goalWidth, true) / 2}
            width={8}
            height={scale(p.goalWidth, true)}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth={1}
          />
        </g>

        {/* Optional grid overlay */}
        {showGrid && (
          <g stroke="rgba(255,255,255,0.1)" strokeWidth={1}>
            {Array.from({ length: 11 }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={((i + 1) * width) / 12}
                y1={0}
                x2={((i + 1) * width) / 12}
                y2={height}
              />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <line
                key={`h${i}`}
                x1={0}
                y1={((i + 1) * height) / 8}
                x2={width}
                y2={((i + 1) * height) / 8}
              />
            ))}
          </g>
        )}

        {/* Children with coordinate mapper */}
        {typeof children === 'function' ? children(mapper) : children}
      </svg>
    </div>
  );
}

// Helper function to describe SVG arc
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(' ');
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

export default Pitch;
