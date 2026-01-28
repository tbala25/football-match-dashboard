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

// Rotated coordinate mapper for goal-at-top view (90° rotation)
// This is used for individual team shot maps where the goal is at the top
export interface RotatedCoordinateMapper {
  toViewport: (x: number, y: number) => { x: number; y: number };
  fromViewport: (x: number, y: number) => { x: number; y: number };
  scale: { x: number; y: number };
}

export interface RotatedViewportConfig {
  width: number;    // Viewport width
  height: number;   // Viewport height
  isAwayTeam?: boolean; // If true, flip for away team perspective
  xMin?: number;    // Minimum x coordinate to show (default: 60 for half pitch)
}

/**
 * Creates a coordinate mapper for rotated half-pitch view (goal at top)
 *
 * StatsBomb coordinates: x: 0-120 (left to right), y: 0-80 (bottom to top)
 * Goal is at x=120 for attacking team
 *
 * For this view:
 * - We only show the attacking half (x: 60-120)
 * - The goal should be at the TOP of the viewport
 * - Y axis is preserved (0-80 maps to left-right in rotated view)
 *
 * Transformation:
 * - Original x (60-120) maps to viewport y (top to bottom, goal at top)
 * - Original y (0-80) maps to viewport x (left to right)
 */
export function createRotatedCoordinateMapper(config: RotatedViewportConfig): RotatedCoordinateMapper {
  const { width, height, isAwayTeam = false, xMin = 60 } = config;

  // We're mapping the specified portion of the attacking half
  // Default: x from 60 to 120 (60 yard range), can be cropped with xMin
  const pitchLengthToShow = 120 - xMin; // e.g., 60 for full half, 40 for cropped
  const pitchWidth = STATSBOMB_PITCH.height; // y: 0-80

  // Scale factors
  const scaleX = width / pitchWidth; // Original y maps to viewport x
  const scaleY = height / pitchLengthToShow; // Original x maps to viewport y

  return {
    toViewport: (x: number, y: number) => {
      // Transform coordinates:
      // - Original y (0-80) -> Viewport x (0-width)
      // - Original x (xMin-120) -> Viewport y (height to 0, goal at top)
      //
      // StatsBomb normalizes ALL coordinates to "attacking right" (goal at x=120)
      // Both home and away team shots are in the same coordinate system
      // So both teams use identical transformations - no mirroring needed

      // Goal at x=120 should be at top (viewport y=0)
      // xMin should be at bottom (viewport y=height)
      const viewportX = y * scaleX;
      const viewportY = (120 - x) * scaleY;

      return { x: viewportX, y: viewportY };
    },

    fromViewport: (viewportX: number, viewportY: number) => {
      const y = viewportX / scaleX;
      const x = 120 - (viewportY / scaleY);

      return { x, y };
    },

    scale: { x: scaleX, y: scaleY },
  };
}

// Half-pitch dimensions for rotated view
export const HALF_PITCH = {
  // Original coords for attacking half
  xMin: 60,
  xMax: 120,
  yMin: 0,
  yMax: 80,
  // Key markings (in original coords)
  penaltyAreaX: 120 - STATSBOMB_PITCH.penaltyAreaDepth, // 102
  penaltyAreaYMin: (80 - STATSBOMB_PITCH.penaltyAreaWidth) / 2, // 18
  penaltyAreaYMax: (80 + STATSBOMB_PITCH.penaltyAreaWidth) / 2, // 62
  goalAreaX: 120 - STATSBOMB_PITCH.goalAreaDepth, // 114
  goalAreaYMin: (80 - STATSBOMB_PITCH.goalAreaWidth) / 2, // 30
  goalAreaYMax: (80 + STATSBOMB_PITCH.goalAreaWidth) / 2, // 50
  penaltySpotX: 120 - STATSBOMB_PITCH.penaltySpotDistance, // 108
  goalYMin: (80 - STATSBOMB_PITCH.goalWidth) / 2, // 36
  goalYMax: (80 + STATSBOMB_PITCH.goalWidth) / 2, // 44
};
