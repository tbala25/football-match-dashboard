// StatsBomb Data Types

// Competition data
export interface Competition {
  competition_id: number;
  season_id: number;
  competition_name: string;
  country_name: string;
  competition_gender: string;
  competition_youth: boolean;
  competition_international: boolean;
  season_name: string;
  match_updated: string;
  match_updated_360: string;
  match_available_360: string;
  match_available: string;
}

// Match data
export interface Match {
  match_id: number;
  match_date: string;
  kick_off: string;
  competition: {
    competition_id: number;
    country_name: string;
    competition_name: string;
  };
  season: {
    season_id: number;
    season_name: string;
  };
  home_team: Team;
  away_team: Team;
  home_score: number;
  away_score: number;
  match_status: string;
  match_status_360: string;
  last_updated: string;
  last_updated_360: string;
  metadata: {
    data_version: string;
    shot_fidelity_version: string;
    xy_fidelity_version: string;
  };
  match_week: number;
  competition_stage: {
    id: number;
    name: string;
  };
  stadium: {
    id: number;
    name: string;
    country: {
      id: number;
      name: string;
    };
  };
  referee: {
    id: number;
    name: string;
    country: {
      id: number;
      name: string;
    };
  };
}

export interface Team {
  // StatsBomb uses prefixed names in match context (home_team_id, away_team_id)
  team_id?: number;
  home_team_id?: number;
  away_team_id?: number;
  team_name?: string;
  home_team_name?: string;
  away_team_name?: string;
  team_gender?: string;
  home_team_gender?: string;
  away_team_gender?: string;
  team_group?: string | null;
  home_team_group?: string | null;
  away_team_group?: string | null;
  country?: {
    id: number;
    name: string;
  };
  managers?: Manager[];
}

export interface Manager {
  id: number;
  name: string;
  nickname: string;
  dob: string;
  country: {
    id: number;
    name: string;
  };
}

// Lineup data
export interface Lineup {
  team_id: number;
  team_name: string;
  lineup: LineupPlayer[];
}

export interface LineupPlayer {
  player_id: number;
  player_name: string;
  player_nickname: string | null;
  jersey_number: number;
  country: {
    id: number;
    name: string;
  };
  cards: Card[];
  positions: Position[];
}

export interface Card {
  time: string;
  card_type: string;
  reason: string | null;
  period: number;
}

export interface Position {
  position_id: number;
  position: string;
  from: string;
  to: string | null;
  from_period: number;
  to_period: number | null;
  start_reason: string;
  end_reason: string | null;
}

// Event data
export interface Event {
  id: string;
  index: number;
  period: number;
  timestamp: string;
  minute: number;
  second: number;
  type: EventType;
  possession: number;
  possession_team: {
    id: number;
    name: string;
  };
  play_pattern: {
    id: number;
    name: string;
  };
  team: {
    id: number;
    name: string;
  };
  player?: {
    id: number;
    name: string;
  };
  position?: {
    id: number;
    name: string;
  };
  location?: [number, number];
  duration?: number;
  under_pressure?: boolean;
  off_camera?: boolean;
  out?: boolean;
  related_events?: string[];

  // Event-specific fields
  pass?: PassDetails;
  shot?: ShotDetails;
  carry?: CarryDetails;
  dribble?: DribbleDetails;
  foul_committed?: FoulDetails;
  foul_won?: FoulDetails;
  duel?: DuelDetails;
  interception?: InterceptionDetails;
  substitution?: SubstitutionDetails;
  tactics?: TacticsDetails;
  goalkeeper?: GoalkeeperDetails;
  ball_receipt?: BallReceiptDetails;
  block?: BlockDetails;
  clearance?: ClearanceDetails;
  miscontrol?: MiscontrolDetails;
  bad_behaviour?: BadBehaviourDetails;

  // 360 data
  freeze_frame?: FreezeFrame[];
}

export interface EventType {
  id: number;
  name: string;
}

export interface PassDetails {
  recipient?: {
    id: number;
    name: string;
  };
  length: number;
  angle: number;
  height: {
    id: number;
    name: string;
  };
  end_location: [number, number];
  body_part?: {
    id: number;
    name: string;
  };
  type?: {
    id: number;
    name: string;
  };
  outcome?: {
    id: number;
    name: string;
  };
  technique?: {
    id: number;
    name: string;
  };
  cross?: boolean;
  switch?: boolean;
  shot_assist?: boolean;
  goal_assist?: boolean;
  cut_back?: boolean;
  through_ball?: boolean;
  assisted_shot_id?: string;
}

export interface ShotDetails {
  statsbomb_xg: number;
  end_location: [number, number] | [number, number, number];
  outcome: {
    id: number;
    name: string;
  };
  type: {
    id: number;
    name: string;
  };
  body_part: {
    id: number;
    name: string;
  };
  technique: {
    id: number;
    name: string;
  };
  first_time?: boolean;
  follows_dribble?: boolean;
  redirect?: boolean;
  one_on_one?: boolean;
  open_goal?: boolean;
  deflected?: boolean;
  saved_off_target?: boolean;
  saved_to_post?: boolean;
  freeze_frame?: FreezeFrame[];
  key_pass_id?: string;
}

export interface CarryDetails {
  end_location: [number, number];
}

export interface DribbleDetails {
  outcome: {
    id: number;
    name: string;
  };
  overrun?: boolean;
  nutmeg?: boolean;
  no_touch?: boolean;
}

export interface FoulDetails {
  offensive?: boolean;
  penalty?: boolean;
  advantage?: boolean;
  card?: {
    id: number;
    name: string;
  };
  type?: {
    id: number;
    name: string;
  };
}

export interface DuelDetails {
  type: {
    id: number;
    name: string;
  };
  outcome?: {
    id: number;
    name: string;
  };
}

export interface InterceptionDetails {
  outcome: {
    id: number;
    name: string;
  };
}

export interface SubstitutionDetails {
  replacement: {
    id: number;
    name: string;
  };
  outcome?: {
    id: number;
    name: string;
  };
}

export interface TacticsDetails {
  formation: number;
  lineup: TacticsPlayer[];
}

export interface TacticsPlayer {
  player: {
    id: number;
    name: string;
  };
  position: {
    id: number;
    name: string;
  };
  jersey_number: number;
}

export interface GoalkeeperDetails {
  type: {
    id: number;
    name: string;
  };
  outcome?: {
    id: number;
    name: string;
  };
  body_part?: {
    id: number;
    name: string;
  };
  technique?: {
    id: number;
    name: string;
  };
  position?: {
    id: number;
    name: string;
  };
  end_location?: [number, number];
}

export interface BallReceiptDetails {
  outcome?: {
    id: number;
    name: string;
  };
}

export interface BlockDetails {
  deflection?: boolean;
  offensive?: boolean;
  save_block?: boolean;
}

export interface ClearanceDetails {
  aerial_won?: boolean;
  body_part?: {
    id: number;
    name: string;
  };
  head?: boolean;
  left_foot?: boolean;
  right_foot?: boolean;
}

export interface MiscontrolDetails {
  aerial_won?: boolean;
}

export interface BadBehaviourDetails {
  card: {
    id: number;
    name: string;
  };
}

export interface FreezeFrame {
  location: [number, number];
  player: {
    id: number;
    name: string;
  };
  position: {
    id: number;
    name: string;
  };
  teammate: boolean;
}

// Visualization data structures
export interface PassNetworkNode {
  playerId: number;
  name: string;
  avgX: number;
  avgY: number;
  passCount: number;
  jerseyNumber?: number;
}

export interface PassNetworkLink {
  source: number;
  target: number;
  count: number;
  successRate: number;
}

export interface PassNetworkData {
  nodes: PassNetworkNode[];
  links: PassNetworkLink[];
}

export interface HeatmapCell {
  x: number;
  y: number;
  value: number;
}

export interface HeatmapData {
  cells: HeatmapCell[];
  maxValue: number;
  gridWidth: number;
  gridHeight: number;
}

export interface ShotData {
  id: string;
  playerId: number;
  playerName: string;
  teamId: number;
  x: number;
  y: number;
  xg: number;
  outcome: string;
  minute: number;
  period: number;
  bodyPart: string;
  technique: string;
  isGoal: boolean;
}

export interface XGTimelinePoint {
  minute: number;
  homeXG: number;
  awayXG: number;
  homeGoals: number;
  awayGoals: number;
  event?: {
    team: 'home' | 'away';
    player: string;
    xg: number;
    isGoal: boolean;
  };
}

export interface PossessionPeriod {
  startMinute: number;
  startSecond: number;
  endMinute: number;
  endSecond: number;
  teamId: number;
  teamName: string;
  period: number;
}

export interface PlayerMatchStats {
  playerId: number;
  playerName: string;
  teamId: number;
  jerseyNumber: number;
  position: string;
  minutesPlayed: number;
  goals: number;
  assists: number;
  shots: number;
  xg: number;
  passes: number;
  passAccuracy: number;
  touches: number;
  cards: {
    yellow: number;
    red: number;
  };
  substitutedIn?: number;
  substitutedOut?: number;
}
