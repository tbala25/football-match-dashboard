import type { Event } from '../../types/statsbomb';

export interface CarryData {
  id: string;
  playerId: number;
  playerName: string;
  teamId: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  distance: number;
  isProgressive: boolean; // 10+ yards toward goal
  minute: number;
  period: number;
}

export interface DribbleData {
  id: string;
  playerId: number;
  playerName: string;
  teamId: number;
  x: number;
  y: number;
  successful: boolean;
  nutmeg: boolean;
  minute: number;
  period: number;
}

export interface CarrySummary {
  totalCarries: number;
  totalDistance: number;
  progressiveCarries: number;
  avgDistance: number;
}

export interface DribbleSummary {
  totalDribbles: number;
  successful: number;
  successRate: number;
  nutmegs: number;
}

// Calculate distance between two points on the pitch
function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Check if carry is progressive (10+ yards toward opponent goal)
function isProgressiveCarry(startX: number, endX: number): boolean {
  return endX - startX >= 10;
}

export function extractCarries(events: Event[], teamId: number): CarryData[] {
  return events
    .filter(
      (e) =>
        e.type.name === 'Carry' &&
        e.team.id === teamId &&
        e.carry &&
        e.location &&
        e.period <= 4 // Exclude penalty shootout
    )
    .map((e) => {
      const startX = e.location![0];
      const startY = e.location![1];
      const endX = e.carry!.end_location[0];
      const endY = e.carry!.end_location[1];
      const distance = calculateDistance(startX, startY, endX, endY);

      return {
        id: e.id,
        playerId: e.player?.id ?? 0,
        playerName: e.player?.name ?? 'Unknown',
        teamId: e.team.id,
        startX,
        startY,
        endX,
        endY,
        distance,
        isProgressive: isProgressiveCarry(startX, endX),
        minute: e.minute,
        period: e.period,
      };
    })
    // Filter out very short carries (less than 3 yards) to reduce noise
    .filter((c) => c.distance >= 3);
}

export function extractDribbles(events: Event[], teamId: number): DribbleData[] {
  return events
    .filter(
      (e) =>
        e.type.name === 'Dribble' &&
        e.team.id === teamId &&
        e.dribble &&
        e.location &&
        e.period <= 4
    )
    .map((e) => ({
      id: e.id,
      playerId: e.player?.id ?? 0,
      playerName: e.player?.name ?? 'Unknown',
      teamId: e.team.id,
      x: e.location![0],
      y: e.location![1],
      successful: e.dribble!.outcome?.name === 'Complete',
      nutmeg: !!e.dribble!.nutmeg,
      minute: e.minute,
      period: e.period,
    }));
}

export function getCarryStats(carries: CarryData[]): CarrySummary {
  const totalDistance = carries.reduce((sum, c) => sum + c.distance, 0);
  const progressiveCarries = carries.filter((c) => c.isProgressive).length;

  return {
    totalCarries: carries.length,
    totalDistance: Math.round(totalDistance),
    progressiveCarries,
    avgDistance: carries.length > 0 ? Math.round(totalDistance / carries.length * 10) / 10 : 0,
  };
}

export function getDribbleStats(dribbles: DribbleData[]): DribbleSummary {
  const successful = dribbles.filter((d) => d.successful).length;
  const nutmegs = dribbles.filter((d) => d.nutmeg).length;

  return {
    totalDribbles: dribbles.length,
    successful,
    successRate: dribbles.length > 0 ? (successful / dribbles.length) * 100 : 0,
    nutmegs,
  };
}

// Get top ball carriers by total distance
export function getTopCarriers(
  carries: CarryData[],
  limit: number = 5
): { playerId: number; playerName: string; count: number; totalDistance: number }[] {
  const playerData = new Map<number, { name: string; count: number; distance: number }>();

  for (const carry of carries) {
    const existing = playerData.get(carry.playerId);
    if (existing) {
      existing.count++;
      existing.distance += carry.distance;
    } else {
      playerData.set(carry.playerId, {
        name: carry.playerName,
        count: 1,
        distance: carry.distance,
      });
    }
  }

  return Array.from(playerData.entries())
    .map(([playerId, data]) => ({
      playerId,
      playerName: data.name,
      count: data.count,
      totalDistance: Math.round(data.distance),
    }))
    .sort((a, b) => b.totalDistance - a.totalDistance)
    .slice(0, limit);
}

// Get top dribblers by success rate (min 3 attempts)
export function getTopDribblers(
  dribbles: DribbleData[],
  limit: number = 5
): { playerId: number; playerName: string; attempts: number; successful: number; successRate: number }[] {
  const playerData = new Map<number, { name: string; attempts: number; successful: number }>();

  for (const dribble of dribbles) {
    const existing = playerData.get(dribble.playerId);
    if (existing) {
      existing.attempts++;
      if (dribble.successful) existing.successful++;
    } else {
      playerData.set(dribble.playerId, {
        name: dribble.playerName,
        attempts: 1,
        successful: dribble.successful ? 1 : 0,
      });
    }
  }

  return Array.from(playerData.entries())
    .filter(([, data]) => data.attempts >= 3) // Minimum 3 attempts
    .map(([playerId, data]) => ({
      playerId,
      playerName: data.name,
      attempts: data.attempts,
      successful: data.successful,
      successRate: (data.successful / data.attempts) * 100,
    }))
    .sort((a, b) => b.successful - a.successful) // Sort by total successful dribbles
    .slice(0, limit);
}
