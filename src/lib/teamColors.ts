// Team colors and logos database
// Colors sourced from teamcolorcodes.com, teamcolours.netlify.app, and official team sources

export interface TeamColors {
  primary: string;
  secondary: string;
  accent?: string;
  text: string; // Text color for primary background
}

export interface TeamBranding {
  colors: TeamColors;
  logoUrl?: string;
}

// National teams - World Cup participants
const nationalTeams: Record<string, TeamBranding> = {
  // South America
  'Argentina': {
    colors: { primary: '#43A1D5', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c1/Argentina_national_football_team_logo.svg',
  },
  'Brazil': {
    colors: { primary: '#FFDF00', secondary: '#009739', text: '#009739' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Soccerball.svg',
  },
  'Uruguay': {
    colors: { primary: '#0038A8', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Colombia': {
    colors: { primary: '#FCD116', secondary: '#003893', text: '#003893' },
  },
  'Chile': {
    colors: { primary: '#D52B1E', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Peru': {
    colors: { primary: '#D91023', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Ecuador': {
    colors: { primary: '#FFD100', secondary: '#0033A0', text: '#0033A0' },
  },
  'Paraguay': {
    colors: { primary: '#DA121A', secondary: '#0038A8', text: '#FFFFFF' },
  },

  // Europe
  'France': {
    colors: { primary: '#002654', secondary: '#FFFFFF', accent: '#ED2939', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c3/France_national_football_team_logo.svg',
  },
  'Germany': {
    colors: { primary: '#000000', secondary: '#FFFFFF', accent: '#DD0000', text: '#FFFFFF' },
  },
  'Spain': {
    colors: { primary: '#AA151B', secondary: '#F1BF00', text: '#FFFFFF' },
  },
  'England': {
    colors: { primary: '#FFFFFF', secondary: '#002366', accent: '#CF081F', text: '#002366' },
  },
  'Italy': {
    colors: { primary: '#0066B2', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Netherlands': {
    colors: { primary: '#FF6600', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Portugal': {
    colors: { primary: '#006600', secondary: '#FF0000', text: '#FFFFFF' },
  },
  'Belgium': {
    colors: { primary: '#ED2939', secondary: '#000000', accent: '#FAE042', text: '#FFFFFF' },
  },
  'Croatia': {
    colors: { primary: '#FF0000', secondary: '#FFFFFF', accent: '#0000FF', text: '#FFFFFF' },
  },
  'Poland': {
    colors: { primary: '#FFFFFF', secondary: '#DC143C', text: '#DC143C' },
  },
  'Switzerland': {
    colors: { primary: '#FF0000', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Denmark': {
    colors: { primary: '#C8102E', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Sweden': {
    colors: { primary: '#FFCD00', secondary: '#004B87', text: '#004B87' },
  },
  'Austria': {
    colors: { primary: '#ED2939', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Wales': {
    colors: { primary: '#C8102E', secondary: '#00AB39', text: '#FFFFFF' },
  },
  'Scotland': {
    colors: { primary: '#0065BF', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Serbia': {
    colors: { primary: '#C6363C', secondary: '#0C4076', text: '#FFFFFF' },
  },
  'Ukraine': {
    colors: { primary: '#FFD500', secondary: '#0057B7', text: '#0057B7' },
  },

  // Africa
  'Morocco': {
    colors: { primary: '#C1272D', secondary: '#006233', text: '#FFFFFF' },
  },
  'Senegal': {
    colors: { primary: '#00853F', secondary: '#FDEF42', text: '#FFFFFF' },
  },
  'Tunisia': {
    colors: { primary: '#E70013', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Cameroon': {
    colors: { primary: '#007A3D', secondary: '#CE1126', accent: '#FCD116', text: '#FFFFFF' },
  },
  'Ghana': {
    colors: { primary: '#006B3F', secondary: '#FCD116', accent: '#CE1126', text: '#FFFFFF' },
  },
  'Nigeria': {
    colors: { primary: '#008751', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Egypt': {
    colors: { primary: '#C8102E', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Algeria': {
    colors: { primary: '#006633', secondary: '#FFFFFF', text: '#FFFFFF' },
  },

  // Asia
  'Japan': {
    colors: { primary: '#002B5C', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'South Korea': {
    colors: { primary: '#CD2E3A', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Korea Republic': {
    colors: { primary: '#CD2E3A', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Australia': {
    colors: { primary: '#FFCD00', secondary: '#00843D', text: '#00843D' },
  },
  'Iran': {
    colors: { primary: '#FFFFFF', secondary: '#DA0000', accent: '#239F40', text: '#DA0000' },
  },
  'Saudi Arabia': {
    colors: { primary: '#006C35', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Qatar': {
    colors: { primary: '#8A1538', secondary: '#FFFFFF', text: '#FFFFFF' },
  },

  // North/Central America
  'United States': {
    colors: { primary: '#002868', secondary: '#BF0A30', text: '#FFFFFF' },
  },
  'USA': {
    colors: { primary: '#002868', secondary: '#BF0A30', text: '#FFFFFF' },
  },
  'Mexico': {
    colors: { primary: '#006847', secondary: '#FFFFFF', accent: '#CE1126', text: '#FFFFFF' },
  },
  'Canada': {
    colors: { primary: '#FF0000', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Costa Rica': {
    colors: { primary: '#CE1126', secondary: '#002B7F', text: '#FFFFFF' },
  },

  // Women's teams
  "Argentina Women's": {
    colors: { primary: '#43A1D5', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  "United States Women's": {
    colors: { primary: '#002868', secondary: '#BF0A30', text: '#FFFFFF' },
  },
  "England Women's": {
    colors: { primary: '#FFFFFF', secondary: '#002366', text: '#002366' },
  },
  "France Women's": {
    colors: { primary: '#002654', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  "Germany Women's": {
    colors: { primary: '#000000', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  "Spain Women's": {
    colors: { primary: '#AA151B', secondary: '#F1BF00', text: '#FFFFFF' },
  },
};

// Club teams
const clubTeams: Record<string, TeamBranding> = {
  // Premier League
  'Arsenal': {
    colors: { primary: '#EF0107', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  },
  'Manchester City': {
    colors: { primary: '#6CABDD', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
  },
  'Liverpool': {
    colors: { primary: '#C8102E', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
  },
  'Chelsea': {
    colors: { primary: '#034694', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
  },
  'Manchester United': {
    colors: { primary: '#DA291C', secondary: '#FBE122', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
  },
  'Tottenham Hotspur': {
    colors: { primary: '#132257', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Tottenham': {
    colors: { primary: '#132257', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Newcastle United': {
    colors: { primary: '#241F20', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Aston Villa': {
    colors: { primary: '#670E36', secondary: '#95BFE5', text: '#FFFFFF' },
  },
  'Brighton': {
    colors: { primary: '#0057B8', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Brighton & Hove Albion': {
    colors: { primary: '#0057B8', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'West Ham United': {
    colors: { primary: '#7A263A', secondary: '#1BB1E7', text: '#FFFFFF' },
  },
  'West Ham': {
    colors: { primary: '#7A263A', secondary: '#1BB1E7', text: '#FFFFFF' },
  },
  'Brentford': {
    colors: { primary: '#E30613', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Fulham': {
    colors: { primary: '#FFFFFF', secondary: '#000000', text: '#000000' },
  },
  'Crystal Palace': {
    colors: { primary: '#1B458F', secondary: '#C4122E', text: '#FFFFFF' },
  },
  'Wolverhampton Wanderers': {
    colors: { primary: '#FDB913', secondary: '#231F20', text: '#231F20' },
  },
  'Wolves': {
    colors: { primary: '#FDB913', secondary: '#231F20', text: '#231F20' },
  },
  'Everton': {
    colors: { primary: '#003399', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Nottingham Forest': {
    colors: { primary: '#DD0000', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Bournemouth': {
    colors: { primary: '#DA291C', secondary: '#000000', text: '#FFFFFF' },
  },
  'Luton Town': {
    colors: { primary: '#F78F1E', secondary: '#002D62', text: '#FFFFFF' },
  },
  'Burnley': {
    colors: { primary: '#6C1D45', secondary: '#99D6EA', text: '#FFFFFF' },
  },
  'Sheffield United': {
    colors: { primary: '#EE2737', secondary: '#FFFFFF', text: '#FFFFFF' },
  },

  // La Liga
  'Barcelona': {
    colors: { primary: '#004D98', secondary: '#A50044', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
  },
  'Real Madrid': {
    colors: { primary: '#FFFFFF', secondary: '#00529F', text: '#00529F' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
  },
  'Atletico Madrid': {
    colors: { primary: '#CB3524', secondary: '#FFFFFF', accent: '#272E61', text: '#FFFFFF' },
  },
  'Atlético Madrid': {
    colors: { primary: '#CB3524', secondary: '#FFFFFF', accent: '#272E61', text: '#FFFFFF' },
  },
  'Sevilla': {
    colors: { primary: '#FFFFFF', secondary: '#D4021D', text: '#D4021D' },
  },
  'Real Betis': {
    colors: { primary: '#00954C', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Athletic Bilbao': {
    colors: { primary: '#EE2523', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Athletic Club': {
    colors: { primary: '#EE2523', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Real Sociedad': {
    colors: { primary: '#143C8B', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Villarreal': {
    colors: { primary: '#FFE114', secondary: '#005DAA', text: '#005DAA' },
  },
  'Valencia': {
    colors: { primary: '#FFFFFF', secondary: '#000000', accent: '#EE3524', text: '#000000' },
  },

  // Bundesliga
  'Bayern Munich': {
    colors: { primary: '#DC052D', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
  },
  'Borussia Dortmund': {
    colors: { primary: '#FDE100', secondary: '#000000', text: '#000000' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg',
  },
  'RB Leipzig': {
    colors: { primary: '#DD0741', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Bayer Leverkusen': {
    colors: { primary: '#E32221', secondary: '#000000', text: '#FFFFFF' },
  },
  'Eintracht Frankfurt': {
    colors: { primary: '#000000', secondary: '#E1000F', text: '#FFFFFF' },
  },
  'Borussia Mönchengladbach': {
    colors: { primary: '#000000', secondary: '#00A859', text: '#FFFFFF' },
  },
  'Wolfsburg': {
    colors: { primary: '#65B32E', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Freiburg': {
    colors: { primary: '#000000', secondary: '#E30613', text: '#FFFFFF' },
  },

  // Serie A
  'Juventus': {
    colors: { primary: '#000000', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_logo.svg',
  },
  'Inter': {
    colors: { primary: '#0068A8', secondary: '#000000', text: '#FFFFFF' },
  },
  'Inter Milan': {
    colors: { primary: '#0068A8', secondary: '#000000', text: '#FFFFFF' },
  },
  'AC Milan': {
    colors: { primary: '#FB090B', secondary: '#000000', text: '#FFFFFF' },
  },
  'Milan': {
    colors: { primary: '#FB090B', secondary: '#000000', text: '#FFFFFF' },
  },
  'Napoli': {
    colors: { primary: '#12A0D7', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Roma': {
    colors: { primary: '#8E1F2F', secondary: '#F0BC42', text: '#FFFFFF' },
  },
  'AS Roma': {
    colors: { primary: '#8E1F2F', secondary: '#F0BC42', text: '#FFFFFF' },
  },
  'Lazio': {
    colors: { primary: '#87D8F7', secondary: '#FFFFFF', text: '#000000' },
  },
  'Atalanta': {
    colors: { primary: '#1E71B8', secondary: '#000000', text: '#FFFFFF' },
  },
  'Fiorentina': {
    colors: { primary: '#482E92', secondary: '#FFFFFF', text: '#FFFFFF' },
  },

  // Ligue 1
  'Paris Saint-Germain': {
    colors: { primary: '#004170', secondary: '#DA291C', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg',
  },
  'PSG': {
    colors: { primary: '#004170', secondary: '#DA291C', text: '#FFFFFF' },
  },
  'Marseille': {
    colors: { primary: '#2FAEE0', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Olympique de Marseille': {
    colors: { primary: '#2FAEE0', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Lyon': {
    colors: { primary: '#FFFFFF', secondary: '#DA001A', accent: '#0E2A5E', text: '#0E2A5E' },
  },
  'Olympique Lyonnais': {
    colors: { primary: '#FFFFFF', secondary: '#DA001A', text: '#0E2A5E' },
  },
  'Monaco': {
    colors: { primary: '#E1001A', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'AS Monaco': {
    colors: { primary: '#E1001A', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Lille': {
    colors: { primary: '#DA291C', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
};

// Combined database
const allTeams: Record<string, TeamBranding> = {
  ...nationalTeams,
  ...clubTeams,
};

// Normalize team name for lookup
function normalizeTeamName(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Generate colors from team name (fallback)
function generateColorsFromName(name: string): TeamColors {
  // Simple hash function to generate consistent colors
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate hue from hash (0-360)
  const hue = Math.abs(hash % 360);
  const saturation = 65 + (Math.abs(hash >> 8) % 20);
  const lightness = 40 + (Math.abs(hash >> 16) % 15);

  // Convert HSL to hex
  const primary = hslToHex(hue, saturation, lightness);
  const secondary = '#FFFFFF';

  return {
    primary,
    secondary,
    text: lightness < 50 ? '#FFFFFF' : '#000000',
  };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Main lookup function
export function getTeamBranding(teamName: string): TeamBranding {
  // Direct lookup
  if (allTeams[teamName]) {
    return allTeams[teamName];
  }

  // Normalized lookup
  const normalized = normalizeTeamName(teamName);
  for (const [key, branding] of Object.entries(allTeams)) {
    if (normalizeTeamName(key) === normalized) {
      return branding;
    }
  }

  // Partial match
  for (const [key, branding] of Object.entries(allTeams)) {
    if (
      normalizeTeamName(key).includes(normalized) ||
      normalized.includes(normalizeTeamName(key))
    ) {
      return branding;
    }
  }

  // Fallback: generate colors
  return {
    colors: generateColorsFromName(teamName),
  };
}

// Get just colors
export function getTeamColors(teamName: string): TeamColors {
  return getTeamBranding(teamName).colors;
}

// Get logo URL (may be undefined)
export function getTeamLogoUrl(teamName: string): string | undefined {
  return getTeamBranding(teamName).logoUrl;
}

// Default colors for unknown teams
export const defaultHomeColors: TeamColors = {
  primary: '#1e40af',
  secondary: '#FFFFFF',
  text: '#FFFFFF',
};

export const defaultAwayColors: TeamColors = {
  primary: '#dc2626',
  secondary: '#FFFFFF',
  text: '#FFFFFF',
};
