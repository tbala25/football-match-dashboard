export interface CompetitionBranding {
  name: string;
  shortName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

export const COMPETITION_LOGOS: Record<string, CompetitionBranding> = {
  'Premier League': {
    name: 'Premier League',
    shortName: 'EPL',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/200px-Premier_League_Logo.svg.png',
    primaryColor: '#3D195B',
    secondaryColor: '#00FF85',
  },
  'FA Women\'s Super League': {
    name: 'FA Women\'s Super League',
    shortName: 'WSL',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/FA_Women%27s_Super_League_logo.svg/200px-FA_Women%27s_Super_League_logo.svg.png',
    primaryColor: '#2D2A5D',
    secondaryColor: '#F7F7F7',
  },
  'La Liga': {
    name: 'La Liga',
    shortName: 'LIGA',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/LaLiga_EA_Sports_2023_Horizontal_Logo.svg/200px-LaLiga_EA_Sports_2023_Horizontal_Logo.svg.png',
    primaryColor: '#EE8707',
    secondaryColor: '#FFFFFF',
  },
  'Bundesliga': {
    name: 'Bundesliga',
    shortName: 'BUN',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Bundesliga_logo_%282017%29.svg/200px-Bundesliga_logo_%282017%29.svg.png',
    primaryColor: '#D20515',
    secondaryColor: '#FFFFFF',
  },
  'Serie A': {
    name: 'Serie A',
    shortName: 'SA',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Serie_A_logo_%282019%29.svg/200px-Serie_A_logo_%282019%29.svg.png',
    primaryColor: '#024494',
    secondaryColor: '#F7F7F7',
  },
  'Ligue 1': {
    name: 'Ligue 1',
    shortName: 'L1',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Ligue_1_logo_%282024%29.svg/200px-Ligue_1_logo_%282024%29.svg.png',
    primaryColor: '#091C3E',
    secondaryColor: '#DDEF00',
  },
  'UEFA Champions League': {
    name: 'UEFA Champions League',
    shortName: 'UCL',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/UEFA_Champions_League_logo_2.svg/200px-UEFA_Champions_League_logo_2.svg.png',
    primaryColor: '#1C1D63',
    secondaryColor: '#FFFFFF',
  },
  'Champions League': {
    name: 'UEFA Champions League',
    shortName: 'UCL',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/UEFA_Champions_League_logo_2.svg/200px-UEFA_Champions_League_logo_2.svg.png',
    primaryColor: '#1C1D63',
    secondaryColor: '#FFFFFF',
  },
  'UEFA Europa League': {
    name: 'UEFA Europa League',
    shortName: 'UEL',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Europa_League.svg/200px-Europa_League.svg.png',
    primaryColor: '#F26D00',
    secondaryColor: '#FFFFFF',
  },
  'FIFA World Cup': {
    name: 'FIFA World Cup',
    shortName: 'WC',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/2022_FIFA_World_Cup.svg/200px-2022_FIFA_World_Cup.svg.png',
    primaryColor: '#8A1538',
    secondaryColor: '#FFFFFF',
  },
  'World Cup': {
    name: 'FIFA World Cup',
    shortName: 'WC',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/2022_FIFA_World_Cup.svg/200px-2022_FIFA_World_Cup.svg.png',
    primaryColor: '#8A1538',
    secondaryColor: '#FFFFFF',
  },
  'FIFA Women\'s World Cup': {
    name: 'FIFA Women\'s World Cup',
    shortName: 'WWC',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/67/2023_FIFA_Women%27s_World_Cup.svg/200px-2023_FIFA_Women%27s_World_Cup.svg.png',
    primaryColor: '#1E3953',
    secondaryColor: '#FFFFFF',
  },
  'NWSL': {
    name: 'National Women\'s Soccer League',
    shortName: 'NWSL',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ec/National_Women%27s_Soccer_League_logo.svg/200px-National_Women%27s_Soccer_League_logo.svg.png',
    primaryColor: '#0D1F3C',
    secondaryColor: '#F4C542',
  },
  'MLS': {
    name: 'Major League Soccer',
    shortName: 'MLS',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/MLS_crest_logo_RGB_gradient.svg/200px-MLS_crest_logo_RGB_gradient.svg.png',
    primaryColor: '#131D2D',
    secondaryColor: '#E41A2D',
  },
  'Copa America': {
    name: 'Copa America',
    shortName: 'COPA',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/2024_Copa_America_logo.svg/200px-2024_Copa_America_logo.svg.png',
    primaryColor: '#0054A6',
    secondaryColor: '#FFD700',
  },
};

const DEFAULT_BRANDING: CompetitionBranding = {
  name: 'Competition',
  shortName: 'COMP',
  logoUrl: '',
  primaryColor: '#1e40af',
  secondaryColor: '#f3f4f6',
};

export function getCompetitionBranding(competitionName: string): CompetitionBranding {
  if (COMPETITION_LOGOS[competitionName]) {
    return COMPETITION_LOGOS[competitionName];
  }

  const lowerName = competitionName.toLowerCase();
  for (const [key, branding] of Object.entries(COMPETITION_LOGOS)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return branding;
    }
  }

  return { ...DEFAULT_BRANDING, name: competitionName, shortName: competitionName.substring(0, 4).toUpperCase() };
}

export default COMPETITION_LOGOS;
