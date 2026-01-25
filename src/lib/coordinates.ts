// StatsBomb pitch coordinate system utilities
// StatsBomb uses a 120x80 yard pitch (origin at bottom-left)

export const STATSBOMB_PITCH = {
  width: 120,
  height: 80,
  // Key pitch markings
  penaltyAreaWidth: 44,
  penaltyAreaDepth: 18,
  goalAreaWidth: 20,
  goalAreaDepth: 6,
  centerCircleRadius: 10,
  penaltySpotDistance: 12,
  cornerArcRadius: 1,
  goalWidth: 8,
};

export interface ViewportDimensions {
  width: number;
  height: number;
}

export interface CoordinateMapper {
  toViewport: (x: number, y: number, flipForPeriod2?: boolean) => { x: number; y: number };
  fromViewport: (x: number, y: number) => { x: number; y: number };
  scale: { x: number; y: number };
}

export function createCoordinateMapper(viewport: ViewportDimensions): CoordinateMapper {
  const scaleX = viewport.width / STATSBOMB_PITCH.width;
  const scaleY = viewport.height / STATSBOMB_PITCH.height;

  return {
    toViewport: (x: number, y: number, flipForPeriod2: boolean = false) => {
      let adjustedX = x;
      let adjustedY = y;

      if (flipForPeriod2) {
        adjustedX = STATSBOMB_PITCH.width - x;
        adjustedY = STATSBOMB_PITCH.height - y;
      }

      return {
        x: adjustedX * scaleX,
        y: adjustedY * scaleY,
      };
    },
    fromViewport: (x: number, y: number) => ({
      x: x / scaleX,
      y: y / scaleY,
    }),
    scale: { x: scaleX, y: scaleY },
  };
}

// Calculate viewport dimensions maintaining aspect ratio
export function calculatePitchViewport(
  containerWidth: number,
  containerHeight: number,
  padding: number = 0
): ViewportDimensions {
  const aspectRatio = STATSBOMB_PITCH.width / STATSBOMB_PITCH.height; // 1.5
  const availableWidth = containerWidth - padding * 2;
  const availableHeight = containerHeight - padding * 2;

  let width: number;
  let height: number;

  if (availableWidth / availableHeight > aspectRatio) {
    // Container is wider than pitch aspect ratio
    height = availableHeight;
    width = height * aspectRatio;
  } else {
    // Container is taller than pitch aspect ratio
    width = availableWidth;
    height = width / aspectRatio;
  }

  return { width, height };
}

// Get zone for a location (for heatmap grouping)
export function getZone(x: number, y: number, gridCols: number = 12, gridRows: number = 8): { col: number; row: number } {
  const col = Math.min(Math.floor(x / (STATSBOMB_PITCH.width / gridCols)), gridCols - 1);
  const row = Math.min(Math.floor(y / (STATSBOMB_PITCH.height / gridRows)), gridRows - 1);
  return { col, row };
}

// Check if location is in attacking third
export function isAttackingThird(x: number): boolean {
  return x >= (STATSBOMB_PITCH.width * 2) / 3;
}

// Check if location is in defensive third
export function isDefensiveThird(x: number): boolean {
  return x <= STATSBOMB_PITCH.width / 3;
}

// Check if location is in penalty area
export function isInPenaltyArea(x: number, y: number, attacking: boolean = true): boolean {
  const areaY1 = (STATSBOMB_PITCH.height - STATSBOMB_PITCH.penaltyAreaWidth) / 2;
  const areaY2 = areaY1 + STATSBOMB_PITCH.penaltyAreaWidth;

  if (attacking) {
    return x >= STATSBOMB_PITCH.width - STATSBOMB_PITCH.penaltyAreaDepth && y >= areaY1 && y <= areaY2;
  } else {
    return x <= STATSBOMB_PITCH.penaltyAreaDepth && y >= areaY1 && y <= areaY2;
  }
}

// Calculate distance between two points
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Calculate angle in degrees from point1 to point2
export function angleDegrees(x1: number, y1: number, x2: number, y2: number): number {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
}
