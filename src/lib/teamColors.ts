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
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1d/Brazilian_Football_Confederation_%28CBF%29_logo.svg',
  },
  'Uruguay': {
    colors: { primary: '#0038A8', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/44/Uruguay_national_football_team_logo.svg',
  },
  'Colombia': {
    colors: { primary: '#FCD116', secondary: '#003893', text: '#003893' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/ab/Colombia_national_football_team_badge.svg',
  },
  'Chile': {
    colors: { primary: '#D52B1E', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b0/Chile_national_football_team_badge.svg',
  },
  'Peru': {
    colors: { primary: '#D91023', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3a/Peru_national_football_team_badge.svg',
  },
  'Ecuador': {
    colors: { primary: '#FFD100', secondary: '#0033A0', text: '#0033A0' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c9/Ecuadorian_Football_Federation_logo.svg',
  },
  'Paraguay': {
    colors: { primary: '#DA121A', secondary: '#0038A8', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/51/Paraguayan_Football_Association_logo.svg',
  },
  'Venezuela': {
    colors: { primary: '#8B0000', secondary: '#FFD700', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/68/Venezuela_national_football_team_badge.svg',
  },
  'Bolivia': {
    colors: { primary: '#007A33', secondary: '#FFD700', text: '#FFFFFF' },
  },

  // Europe
  'France': {
    colors: { primary: '#002654', secondary: '#FFFFFF', accent: '#ED2939', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c3/France_national_football_team_logo.svg',
  },
  'Germany': {
    colors: { primary: '#000000', secondary: '#FFFFFF', accent: '#DD0000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e3/German_Football_Association_%28DFB%29_logo.svg',
  },
  'Spain': {
    colors: { primary: '#AA151B', secondary: '#F1BF00', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/13/Royal_Spanish_Football_Federation_logo.svg',
  },
  'England': {
    colors: { primary: '#FFFFFF', secondary: '#002366', accent: '#CF081F', text: '#002366' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/b/be/England_national_football_team_crest.svg',
  },
  'Italy': {
    colors: { primary: '#0066B2', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/ce/Italian_Football_Federation_%28FIGC%29_logo.svg',
  },
  'Netherlands': {
    colors: { primary: '#FF6600', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/dd/Royal_Dutch_Football_Association_%28KNVB%29_logo.svg',
  },
  'Portugal': {
    colors: { primary: '#006600', secondary: '#FF0000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/44/Portuguese_Football_Federation_logo.svg',
  },
  'Belgium': {
    colors: { primary: '#ED2939', secondary: '#000000', accent: '#FAE042', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3f/Royal_Belgian_Football_Association_logo.svg',
  },
  'Croatia': {
    colors: { primary: '#FF0000', secondary: '#FFFFFF', accent: '#0000FF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/43/Croatian_Football_Federation_logo.svg',
  },
  'Poland': {
    colors: { primary: '#FFFFFF', secondary: '#DC143C', text: '#DC143C' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0d/Polish_Football_Association_logo.svg',
  },
  'Switzerland': {
    colors: { primary: '#FF0000', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Swiss_Football_Association_logo.svg',
  },
  'Denmark': {
    colors: { primary: '#C8102E', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2c/Danish_Football_Association_logo.svg',
  },
  'Sweden': {
    colors: { primary: '#FFCD00', secondary: '#004B87', text: '#004B87' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Swedish_Football_Association_logo.svg',
  },
  'Austria': {
    colors: { primary: '#ED2939', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/44/Austrian_Football_Association_logo.svg',
  },
  'Wales': {
    colors: { primary: '#C8102E', secondary: '#00AB39', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d9/Welsh_Football_Association_logo.svg',
  },
  'Scotland': {
    colors: { primary: '#0065BF', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Scottish_Football_Association_logo.svg',
  },
  'Serbia': {
    colors: { primary: '#C6363C', secondary: '#0C4076', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0f/Football_Association_of_Serbia_logo.svg',
  },
  'Ukraine': {
    colors: { primary: '#FFD500', secondary: '#0057B7', text: '#0057B7' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/df/Ukrainian_Football_Association_logo.svg',
  },
  'Turkey': {
    colors: { primary: '#E30A17', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5b/Turkish_Football_Federation_logo.svg',
  },
  'Greece': {
    colors: { primary: '#0D5EAF', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/03/Hellenic_Football_Federation_logo.svg',
  },
  'Czech Republic': {
    colors: { primary: '#D7141A', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f4/Czech_Football_Association_logo.svg',
  },
  'Romania': {
    colors: { primary: '#FCD116', secondary: '#002B7F', text: '#002B7F' },
  },
  'Hungary': {
    colors: { primary: '#CE2939', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Norway': {
    colors: { primary: '#EF2B2D', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Republic of Ireland': {
    colors: { primary: '#169B62', secondary: '#FF883E', text: '#FFFFFF' },
  },
  'Ireland': {
    colors: { primary: '#169B62', secondary: '#FF883E', text: '#FFFFFF' },
  },
  'Finland': {
    colors: { primary: '#FFFFFF', secondary: '#002F6C', text: '#002F6C' },
  },
  'Iceland': {
    colors: { primary: '#003897', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Slovenia': {
    colors: { primary: '#005DA4', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Slovakia': {
    colors: { primary: '#0B4EA2', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Albania': {
    colors: { primary: '#E41E20', secondary: '#000000', text: '#FFFFFF' },
  },
  'Russia': {
    colors: { primary: '#D52B1E', secondary: '#FFFFFF', text: '#FFFFFF' },
  },

  // Africa
  'Morocco': {
    colors: { primary: '#C1272D', secondary: '#006233', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/10/Morocco_national_football_team_badge.svg',
  },
  'Senegal': {
    colors: { primary: '#00853F', secondary: '#FDEF42', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8c/Senegalese_Football_Federation_logo.svg',
  },
  'Tunisia': {
    colors: { primary: '#E70013', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c5/Tunisian_Football_Federation_logo.svg',
  },
  'Cameroon': {
    colors: { primary: '#007A3D', secondary: '#CE1126', accent: '#FCD116', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/62/Cameroon_Football_Federation_logo.svg',
  },
  'Ghana': {
    colors: { primary: '#006B3F', secondary: '#FCD116', accent: '#CE1126', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Ghana_Football_Association_logo.svg',
  },
  'Nigeria': {
    colors: { primary: '#008751', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1f/Nigeria_Football_Federation_logo.svg',
  },
  'Egypt': {
    colors: { primary: '#C8102E', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/61/Egyptian_Football_Association_logo.svg',
  },
  'Algeria': {
    colors: { primary: '#006633', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e3/Algerian_Football_Federation_logo.svg',
  },
  'Ivory Coast': {
    colors: { primary: '#FF8200', secondary: '#FFFFFF', accent: '#009E60', text: '#FFFFFF' },
  },
  "Côte d'Ivoire": {
    colors: { primary: '#FF8200', secondary: '#FFFFFF', accent: '#009E60', text: '#FFFFFF' },
  },
  'South Africa': {
    colors: { primary: '#007749', secondary: '#FFB81C', text: '#FFFFFF' },
  },
  'DR Congo': {
    colors: { primary: '#007FFF', secondary: '#CE1126', text: '#FFFFFF' },
  },
  'Mali': {
    colors: { primary: '#14B53A', secondary: '#FCD116', text: '#FFFFFF' },
  },
  'Burkina Faso': {
    colors: { primary: '#009E49', secondary: '#EF2B2D', text: '#FFFFFF' },
  },

  // Asia
  'Japan': {
    colors: { primary: '#002B5C', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Japan_Football_Association_logo.svg',
  },
  'South Korea': {
    colors: { primary: '#CD2E3A', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Korea_Football_Association_logo.svg',
  },
  'Korea Republic': {
    colors: { primary: '#CD2E3A', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Korea_Football_Association_logo.svg',
  },
  'Australia': {
    colors: { primary: '#FFCD00', secondary: '#00843D', text: '#00843D' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a5/Football_Australia_logo.svg',
  },
  'Iran': {
    colors: { primary: '#FFFFFF', secondary: '#DA0000', accent: '#239F40', text: '#DA0000' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Football_Federation_Islamic_Republic_of_Iran_logo.svg',
  },
  'Saudi Arabia': {
    colors: { primary: '#006C35', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9c/Saudi_Arabia_Football_Federation_logo.svg',
  },
  'Qatar': {
    colors: { primary: '#8A1538', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Qatar_Football_Association_logo.svg',
  },
  'China': {
    colors: { primary: '#DE2910', secondary: '#FFDE00', text: '#FFFFFF' },
  },
  'China PR': {
    colors: { primary: '#DE2910', secondary: '#FFDE00', text: '#FFFFFF' },
  },
  'United Arab Emirates': {
    colors: { primary: '#FFFFFF', secondary: '#00732F', accent: '#FF0000', text: '#00732F' },
  },
  'Iraq': {
    colors: { primary: '#007A3D', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Uzbekistan': {
    colors: { primary: '#0099B5', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Vietnam': {
    colors: { primary: '#DA251D', secondary: '#FFFF00', text: '#FFFFFF' },
  },
  'Thailand': {
    colors: { primary: '#0033A0', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Indonesia': {
    colors: { primary: '#CE1126', secondary: '#FFFFFF', text: '#FFFFFF' },
  },

  // North/Central America
  'United States': {
    colors: { primary: '#002868', secondary: '#BF0A30', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/United_States_Soccer_Federation_logo.svg',
  },
  'USA': {
    colors: { primary: '#002868', secondary: '#BF0A30', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/United_States_Soccer_Federation_logo.svg',
  },
  'Mexico': {
    colors: { primary: '#006847', secondary: '#FFFFFF', accent: '#CE1126', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/15/Mexico_national_football_team_logo.svg',
  },
  'Canada': {
    colors: { primary: '#FF0000', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5a/Canada_Soccer_logo.svg',
  },
  'Costa Rica': {
    colors: { primary: '#CE1126', secondary: '#002B7F', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fb/Costa_Rica_Football_Federation_logo.svg',
  },
  'Panama': {
    colors: { primary: '#DA121A', secondary: '#003893', text: '#FFFFFF' },
  },
  'Honduras': {
    colors: { primary: '#0073CF', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Jamaica': {
    colors: { primary: '#009B3A', secondary: '#FED100', text: '#FFFFFF' },
  },
  'El Salvador': {
    colors: { primary: '#0F47AF', secondary: '#FFFFFF', text: '#FFFFFF' },
  },
  'Guatemala': {
    colors: { primary: '#4997D0', secondary: '#FFFFFF', text: '#FFFFFF' },
  },

  // Oceania
  'New Zealand': {
    colors: { primary: '#FFFFFF', secondary: '#000000', text: '#000000' },
  },

  // Women's teams
  "Argentina Women's": {
    colors: { primary: '#43A1D5', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c1/Argentina_national_football_team_logo.svg',
  },
  "United States Women's": {
    colors: { primary: '#002868', secondary: '#BF0A30', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/United_States_Soccer_Federation_logo.svg',
  },
  "England Women's": {
    colors: { primary: '#FFFFFF', secondary: '#002366', text: '#002366' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/b/be/England_national_football_team_crest.svg',
  },
  "France Women's": {
    colors: { primary: '#002654', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c3/France_national_football_team_logo.svg',
  },
  "Germany Women's": {
    colors: { primary: '#000000', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e3/German_Football_Association_%28DFB%29_logo.svg',
  },
  "Spain Women's": {
    colors: { primary: '#AA151B', secondary: '#F1BF00', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/13/Royal_Spanish_Football_Federation_logo.svg',
  },
  "Brazil Women's": {
    colors: { primary: '#FFDF00', secondary: '#009739', text: '#009739' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1d/Brazilian_Football_Confederation_%28CBF%29_logo.svg',
  },
  "Japan Women's": {
    colors: { primary: '#002B5C', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Japan_Football_Association_logo.svg',
  },
  "Canada Women's": {
    colors: { primary: '#FF0000', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5a/Canada_Soccer_logo.svg',
  },
  "Sweden Women's": {
    colors: { primary: '#FFCD00', secondary: '#004B87', text: '#004B87' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Swedish_Football_Association_logo.svg',
  },
  "Netherlands Women's": {
    colors: { primary: '#FF6600', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/dd/Royal_Dutch_Football_Association_%28KNVB%29_logo.svg',
  },
  "Australia Women's": {
    colors: { primary: '#FFCD00', secondary: '#00843D', text: '#00843D' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a5/Football_Australia_logo.svg',
  },
};

// Club teams
const clubTeams: Record<string, TeamBranding> = {
  // Premier League - All 20 clubs
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
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
  },
  'Tottenham': {
    colors: { primary: '#132257', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
  },
  'Newcastle United': {
    colors: { primary: '#241F20', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg',
  },
  'Aston Villa': {
    colors: { primary: '#670E36', secondary: '#95BFE5', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Aston_Villa_FC_crest_%282016%29.svg',
  },
  'Brighton': {
    colors: { primary: '#0057B8', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg',
  },
  'Brighton & Hove Albion': {
    colors: { primary: '#0057B8', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg',
  },
  'West Ham United': {
    colors: { primary: '#7A263A', secondary: '#1BB1E7', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg',
  },
  'West Ham': {
    colors: { primary: '#7A263A', secondary: '#1BB1E7', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg',
  },
  'Brentford': {
    colors: { primary: '#E30613', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg',
  },
  'Fulham': {
    colors: { primary: '#FFFFFF', secondary: '#000000', text: '#000000' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg',
  },
  'Crystal Palace': {
    colors: { primary: '#1B458F', secondary: '#C4122E', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Crystal_Palace_FC_logo.svg',
  },
  'Wolverhampton Wanderers': {
    colors: { primary: '#FDB913', secondary: '#231F20', text: '#231F20' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg',
  },
  'Wolves': {
    colors: { primary: '#FDB913', secondary: '#231F20', text: '#231F20' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg',
  },
  'Everton': {
    colors: { primary: '#003399', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg',
  },
  'Nottingham Forest': {
    colors: { primary: '#DD0000', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Nottingham_Forest_F.C._logo.svg',
  },
  'Bournemouth': {
    colors: { primary: '#DA291C', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg',
  },
  'AFC Bournemouth': {
    colors: { primary: '#DA291C', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg',
  },
  'Luton Town': {
    colors: { primary: '#F78F1E', secondary: '#002D62', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9d/Luton_Town_logo.svg',
  },
  'Burnley': {
    colors: { primary: '#6C1D45', secondary: '#99D6EA', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/62/Burnley_F.C._Logo.svg',
  },
  'Sheffield United': {
    colors: { primary: '#EE2737', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9c/Sheffield_United_FC_logo.svg',
  },
  'Leicester City': {
    colors: { primary: '#003090', secondary: '#FDBE11', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg',
  },
  'Leicester': {
    colors: { primary: '#003090', secondary: '#FDBE11', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg',
  },
  'Southampton': {
    colors: { primary: '#D71920', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton.svg',
  },
  'Leeds United': {
    colors: { primary: '#FFFFFF', secondary: '#1D428A', text: '#1D428A' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/54/Leeds_United_F.C._logo.svg',
  },
  'Leeds': {
    colors: { primary: '#FFFFFF', secondary: '#1D428A', text: '#1D428A' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/54/Leeds_United_F.C._logo.svg',
  },
  'Ipswich Town': {
    colors: { primary: '#0000FF', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/43/Ipswich_Town.svg',
  },

  // La Liga - All 20 clubs
  'Barcelona': {
    colors: { primary: '#004D98', secondary: '#A50044', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
  },
  'FC Barcelona': {
    colors: { primary: '#004D98', secondary: '#A50044', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
  },
  'Real Madrid': {
    colors: { primary: '#FFFFFF', secondary: '#00529F', text: '#00529F' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
  },
  'Real Madrid CF': {
    colors: { primary: '#FFFFFF', secondary: '#00529F', text: '#00529F' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
  },
  'Atletico Madrid': {
    colors: { primary: '#CB3524', secondary: '#FFFFFF', accent: '#272E61', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg',
  },
  'Atlético Madrid': {
    colors: { primary: '#CB3524', secondary: '#FFFFFF', accent: '#272E61', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg',
  },
  'Sevilla': {
    colors: { primary: '#FFFFFF', secondary: '#D4021D', text: '#D4021D' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg',
  },
  'Sevilla FC': {
    colors: { primary: '#FFFFFF', secondary: '#D4021D', text: '#D4021D' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg',
  },
  'Real Betis': {
    colors: { primary: '#00954C', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/13/Real_Betis_logo.svg',
  },
  'Athletic Bilbao': {
    colors: { primary: '#EE2523', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/98/Club_Athletic_Bilbao_logo.svg',
  },
  'Athletic Club': {
    colors: { primary: '#EE2523', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/98/Club_Athletic_Bilbao_logo.svg',
  },
  'Real Sociedad': {
    colors: { primary: '#143C8B', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f1/Real_Sociedad_logo.svg',
  },
  'Villarreal': {
    colors: { primary: '#FFE114', secondary: '#005DAA', text: '#005DAA' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/70/Villarreal_CF_logo.svg',
  },
  'Villarreal CF': {
    colors: { primary: '#FFE114', secondary: '#005DAA', text: '#005DAA' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/70/Villarreal_CF_logo.svg',
  },
  'Valencia': {
    colors: { primary: '#FFFFFF', secondary: '#000000', accent: '#EE3524', text: '#000000' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/ce/Valenciacf.svg',
  },
  'Valencia CF': {
    colors: { primary: '#FFFFFF', secondary: '#000000', accent: '#EE3524', text: '#000000' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/ce/Valenciacf.svg',
  },
  'Celta Vigo': {
    colors: { primary: '#8AC3EE', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/12/RC_Celta_de_Vigo_logo.svg',
  },
  'RC Celta': {
    colors: { primary: '#8AC3EE', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/12/RC_Celta_de_Vigo_logo.svg',
  },
  'Getafe': {
    colors: { primary: '#005999', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/46/Getafe_logo.svg',
  },
  'Getafe CF': {
    colors: { primary: '#005999', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/46/Getafe_logo.svg',
  },
  'Osasuna': {
    colors: { primary: '#D91A21', secondary: '#0A2240', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/db/CA_Osasuna_logo.svg',
  },
  'CA Osasuna': {
    colors: { primary: '#D91A21', secondary: '#0A2240', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/db/CA_Osasuna_logo.svg',
  },
  'Rayo Vallecano': {
    colors: { primary: '#FFFFFF', secondary: '#E53027', text: '#E53027' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/12/Rayo_Vallecano_logo.svg',
  },
  'Mallorca': {
    colors: { primary: '#E20613', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e0/RCD_Mallorca_logo.svg',
  },
  'RCD Mallorca': {
    colors: { primary: '#E20613', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e0/RCD_Mallorca_logo.svg',
  },
  'Girona': {
    colors: { primary: '#CD2534', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/90/Girona_FC_Logo.svg',
  },
  'Girona FC': {
    colors: { primary: '#CD2534', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/90/Girona_FC_Logo.svg',
  },
  'Almería': {
    colors: { primary: '#EE1119', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f5/UD_Almer%C3%ADa_logo.svg',
  },
  'UD Almería': {
    colors: { primary: '#EE1119', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f5/UD_Almer%C3%ADa_logo.svg',
  },
  'Cádiz': {
    colors: { primary: '#FFD200', secondary: '#0033A0', text: '#0033A0' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/58/C%C3%A1diz_CF_logo.svg',
  },
  'Cádiz CF': {
    colors: { primary: '#FFD200', secondary: '#0033A0', text: '#0033A0' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/58/C%C3%A1diz_CF_logo.svg',
  },
  'Granada': {
    colors: { primary: '#E30613', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d5/Granada_CF_logo.svg',
  },
  'Granada CF': {
    colors: { primary: '#E30613', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d5/Granada_CF_logo.svg',
  },
  'Las Palmas': {
    colors: { primary: '#FFD200', secondary: '#0033A0', text: '#0033A0' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4e/UD_Las_Palmas_logo.svg',
  },
  'UD Las Palmas': {
    colors: { primary: '#FFD200', secondary: '#0033A0', text: '#0033A0' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4e/UD_Las_Palmas_logo.svg',
  },
  'Alavés': {
    colors: { primary: '#0033A0', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/8/88/Deportivo_Alav%C3%A9s_logo_%282020%29.svg',
  },
  'Deportivo Alavés': {
    colors: { primary: '#0033A0', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/8/88/Deportivo_Alav%C3%A9s_logo_%282020%29.svg',
  },

  // Bundesliga - All 18 clubs
  'Bayern Munich': {
    colors: { primary: '#DC052D', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
  },
  'FC Bayern München': {
    colors: { primary: '#DC052D', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
  },
  'Borussia Dortmund': {
    colors: { primary: '#FDE100', secondary: '#000000', text: '#000000' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg',
  },
  'BVB': {
    colors: { primary: '#FDE100', secondary: '#000000', text: '#000000' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg',
  },
  'RB Leipzig': {
    colors: { primary: '#DD0741', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg',
  },
  'Bayer Leverkusen': {
    colors: { primary: '#E32221', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg',
  },
  'Bayer 04 Leverkusen': {
    colors: { primary: '#E32221', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg',
  },
  'Eintracht Frankfurt': {
    colors: { primary: '#000000', secondary: '#E1000F', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Eintracht_Frankfurt_Logo.svg',
  },
  'Borussia Mönchengladbach': {
    colors: { primary: '#000000', secondary: '#00A859', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Borussia_M%C3%B6nchengladbach_logo.svg',
  },
  'VfL Wolfsburg': {
    colors: { primary: '#65B32E', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/VfL_Wolfsburg_Logo.svg',
  },
  'Wolfsburg': {
    colors: { primary: '#65B32E', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/VfL_Wolfsburg_Logo.svg',
  },
  'SC Freiburg': {
    colors: { primary: '#000000', secondary: '#E30613', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6d/SC_Freiburg_logo.svg',
  },
  'Freiburg': {
    colors: { primary: '#000000', secondary: '#E30613', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6d/SC_Freiburg_logo.svg',
  },
  'Union Berlin': {
    colors: { primary: '#EB1923', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/1._FC_Union_Berlin_logo.svg',
  },
  '1. FC Union Berlin': {
    colors: { primary: '#EB1923', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/1._FC_Union_Berlin_logo.svg',
  },
  'TSG Hoffenheim': {
    colors: { primary: '#1961B5', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Logo_TSG_Hoffenheim.svg',
  },
  'Hoffenheim': {
    colors: { primary: '#1961B5', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Logo_TSG_Hoffenheim.svg',
  },
  '1. FSV Mainz 05': {
    colors: { primary: '#C3141E', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Logo_Mainz_05.svg',
  },
  'Mainz': {
    colors: { primary: '#C3141E', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Logo_Mainz_05.svg',
  },
  'VfB Stuttgart': {
    colors: { primary: '#E32219', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/VfB_Stuttgart_1893_Logo.svg',
  },
  'Stuttgart': {
    colors: { primary: '#E32219', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/VfB_Stuttgart_1893_Logo.svg',
  },
  'FC Augsburg': {
    colors: { primary: '#BA3733', secondary: '#00683A', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c5/FC_Augsburg_logo.svg',
  },
  'Augsburg': {
    colors: { primary: '#BA3733', secondary: '#00683A', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c5/FC_Augsburg_logo.svg',
  },
  'Werder Bremen': {
    colors: { primary: '#1D9053', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/be/SV-Werder-Bremen-Logo.svg',
  },
  'SV Werder Bremen': {
    colors: { primary: '#1D9053', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/be/SV-Werder-Bremen-Logo.svg',
  },
  'VfL Bochum': {
    colors: { primary: '#005BA5', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/72/VfL_Bochum_logo.svg',
  },
  'Bochum': {
    colors: { primary: '#005BA5', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/72/VfL_Bochum_logo.svg',
  },
  '1. FC Köln': {
    colors: { primary: '#ED1C24', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/44/1._FC_K%C3%B6ln_logo.svg',
  },
  'FC Köln': {
    colors: { primary: '#ED1C24', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/44/1._FC_K%C3%B6ln_logo.svg',
  },
  'Heidenheim': {
    colors: { primary: '#E30613', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/58/1._FC_Heidenheim_1846_logo.svg',
  },
  '1. FC Heidenheim': {
    colors: { primary: '#E30613', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/58/1._FC_Heidenheim_1846_logo.svg',
  },
  'SV Darmstadt 98': {
    colors: { primary: '#004B9B', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/SV_Darmstadt_98_logo.svg',
  },
  'Darmstadt': {
    colors: { primary: '#004B9B', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/SV_Darmstadt_98_logo.svg',
  },

  // Serie A - Top clubs
  'Juventus': {
    colors: { primary: '#000000', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_logo.svg',
  },
  'Inter': {
    colors: { primary: '#0068A8', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg',
  },
  'Inter Milan': {
    colors: { primary: '#0068A8', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg',
  },
  'Internazionale': {
    colors: { primary: '#0068A8', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg',
  },
  'AC Milan': {
    colors: { primary: '#FB090B', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg',
  },
  'Milan': {
    colors: { primary: '#FB090B', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg',
  },
  'Napoli': {
    colors: { primary: '#12A0D7', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/SSC_Napoli_%282023%29.svg',
  },
  'SSC Napoli': {
    colors: { primary: '#12A0D7', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/SSC_Napoli_%282023%29.svg',
  },
  'Roma': {
    colors: { primary: '#8E1F2F', secondary: '#F0BC42', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f7/AS_Roma_logo_%282017%29.svg',
  },
  'AS Roma': {
    colors: { primary: '#8E1F2F', secondary: '#F0BC42', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f7/AS_Roma_logo_%282017%29.svg',
  },
  'Lazio': {
    colors: { primary: '#87D8F7', secondary: '#FFFFFF', text: '#000000' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c2/S.S._Lazio_badge.svg',
  },
  'SS Lazio': {
    colors: { primary: '#87D8F7', secondary: '#FFFFFF', text: '#000000' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c2/S.S._Lazio_badge.svg',
  },
  'Atalanta': {
    colors: { primary: '#1E71B8', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/66/AtalantaBC.svg',
  },
  'Fiorentina': {
    colors: { primary: '#482E92', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/ACF_Fiorentina_2022.svg',
  },
  'ACF Fiorentina': {
    colors: { primary: '#482E92', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/ACF_Fiorentina_2022.svg',
  },
  'Torino': {
    colors: { primary: '#8B0000', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Torino_FC_Logo.svg',
  },
  'Torino FC': {
    colors: { primary: '#8B0000', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Torino_FC_Logo.svg',
  },
  'Bologna': {
    colors: { primary: '#1A2F48', secondary: '#A21C26', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Bologna_F.C._1909_logo.svg',
  },
  'Bologna FC': {
    colors: { primary: '#1A2F48', secondary: '#A21C26', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Bologna_F.C._1909_logo.svg',
  },
  'Udinese': {
    colors: { primary: '#000000', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/ce/Udinese_Calcio_logo.svg',
  },
  'Sassuolo': {
    colors: { primary: '#00A651', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/17/US_Sassuolo_Calcio_logo.svg',
  },
  'Sampdoria': {
    colors: { primary: '#005EB8', secondary: '#FFFFFF', accent: '#E4002B', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1c/U.C._Sampdoria_logo.svg',
  },
  'Genoa': {
    colors: { primary: '#9C1B29', secondary: '#003366', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4e/Genoa_CFC_crest.svg',
  },
  'Verona': {
    colors: { primary: '#FFFF00', secondary: '#003399', text: '#003399' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/92/Hellas_Verona_FC_logo_%282020%29.svg',
  },
  'Hellas Verona': {
    colors: { primary: '#FFFF00', secondary: '#003399', text: '#003399' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/92/Hellas_Verona_FC_logo_%282020%29.svg',
  },
  'Monza': {
    colors: { primary: '#C8102E', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bd/AC_Monza_logo_%282019%29.svg',
  },
  'AC Monza': {
    colors: { primary: '#C8102E', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bd/AC_Monza_logo_%282019%29.svg',
  },
  'Lecce': {
    colors: { primary: '#FFD100', secondary: '#E4002B', text: '#E4002B' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/44/US_Lecce_logo.svg',
  },
  'Empoli': {
    colors: { primary: '#005EB8', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Empoli_FC.svg',
  },
  'Cagliari': {
    colors: { primary: '#A21C26', secondary: '#003366', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/61/Cagliari_Calcio_1920.svg',
  },
  'Frosinone': {
    colors: { primary: '#FFFF00', secondary: '#005EB8', text: '#005EB8' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Frosinone_Calcio_logo.svg',
  },

  // Ligue 1 - Top clubs
  'Paris Saint-Germain': {
    colors: { primary: '#004170', secondary: '#DA291C', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg',
  },
  'PSG': {
    colors: { primary: '#004170', secondary: '#DA291C', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg',
  },
  'Marseille': {
    colors: { primary: '#2FAEE0', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Olympique_Marseille_logo.svg',
  },
  'Olympique de Marseille': {
    colors: { primary: '#2FAEE0', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Olympique_Marseille_logo.svg',
  },
  'Lyon': {
    colors: { primary: '#FFFFFF', secondary: '#DA001A', accent: '#0E2A5E', text: '#0E2A5E' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a3/Olympique_Lyonnais_2022.svg',
  },
  'Olympique Lyonnais': {
    colors: { primary: '#FFFFFF', secondary: '#DA001A', text: '#0E2A5E' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a3/Olympique_Lyonnais_2022.svg',
  },
  'Monaco': {
    colors: { primary: '#E1001A', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/AS_Monaco_FC.svg',
  },
  'AS Monaco': {
    colors: { primary: '#E1001A', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/AS_Monaco_FC.svg',
  },
  'Lille': {
    colors: { primary: '#DA291C', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3f/Lille_OSC_2018_logo.svg',
  },
  'LOSC Lille': {
    colors: { primary: '#DA291C', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3f/Lille_OSC_2018_logo.svg',
  },
  'Nice': {
    colors: { primary: '#CC0000', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/OGC_Nice_logo.svg',
  },
  'OGC Nice': {
    colors: { primary: '#CC0000', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/OGC_Nice_logo.svg',
  },
  'Lens': {
    colors: { primary: '#FBD039', secondary: '#E52330', text: '#000000' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/ca/RC_Lens_logo.svg',
  },
  'RC Lens': {
    colors: { primary: '#FBD039', secondary: '#E52330', text: '#000000' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/ca/RC_Lens_logo.svg',
  },
  'Rennes': {
    colors: { primary: '#E4002B', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9e/Stade_Rennais_FC_logo.svg',
  },
  'Stade Rennais': {
    colors: { primary: '#E4002B', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9e/Stade_Rennais_FC_logo.svg',
  },
  'Strasbourg': {
    colors: { primary: '#005EB8', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/8/80/Racing_Club_de_Strasbourg_logo.svg',
  },
  'RC Strasbourg': {
    colors: { primary: '#005EB8', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/8/80/Racing_Club_de_Strasbourg_logo.svg',
  },
  'Nantes': {
    colors: { primary: '#FFDB00', secondary: '#009639', text: '#009639' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/FC_Nantes_logo.svg',
  },
  'FC Nantes': {
    colors: { primary: '#FFDB00', secondary: '#009639', text: '#009639' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/FC_Nantes_logo.svg',
  },
  'Montpellier': {
    colors: { primary: '#FF6600', secondary: '#003366', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Montpellier_HSC_logo.svg',
  },
  'Montpellier HSC': {
    colors: { primary: '#FF6600', secondary: '#003366', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Montpellier_HSC_logo.svg',
  },
  'Reims': {
    colors: { primary: '#E4002B', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/19/Stade_de_Reims_logo.svg',
  },
  'Stade de Reims': {
    colors: { primary: '#E4002B', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/19/Stade_de_Reims_logo.svg',
  },
  'Brest': {
    colors: { primary: '#E4002B', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/60/Stade_Brestois_29_logo.svg',
  },
  'Stade Brestois': {
    colors: { primary: '#E4002B', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/60/Stade_Brestois_29_logo.svg',
  },
  'Toulouse': {
    colors: { primary: '#5B2C82', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Toulouse_FC_2018_logo.svg',
  },
  'Toulouse FC': {
    colors: { primary: '#5B2C82', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Toulouse_FC_2018_logo.svg',
  },

  // Other notable European clubs
  'Ajax': {
    colors: { primary: '#D2122E', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg',
  },
  'AFC Ajax': {
    colors: { primary: '#D2122E', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg',
  },
  'Benfica': {
    colors: { primary: '#E4002B', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg',
  },
  'SL Benfica': {
    colors: { primary: '#E4002B', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg',
  },
  'Porto': {
    colors: { primary: '#003087', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f1/FC_Porto.svg',
  },
  'FC Porto': {
    colors: { primary: '#003087', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f1/FC_Porto.svg',
  },
  'Sporting CP': {
    colors: { primary: '#008B3C', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e1/Sporting_Clube_de_Portugal_%28Logo%29.svg',
  },
  'Sporting Lisbon': {
    colors: { primary: '#008B3C', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e1/Sporting_Clube_de_Portugal_%28Logo%29.svg',
  },
  'Celtic': {
    colors: { primary: '#00A651', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/35/Celtic_FC.svg',
  },
  'Rangers': {
    colors: { primary: '#0033A0', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/43/Rangers_FC.svg',
  },
  'PSV': {
    colors: { primary: '#E4002B', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/05/PSV_Eindhoven.svg',
  },
  'PSV Eindhoven': {
    colors: { primary: '#E4002B', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/05/PSV_Eindhoven.svg',
  },
  'Feyenoord': {
    colors: { primary: '#E4002B', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/95/Feyenoord_logo.svg',
  },
  'Galatasaray': {
    colors: { primary: '#FDB912', secondary: '#A21C26', text: '#000000' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Galatasaray_Sports_Club_Logo.svg',
  },
  'Fenerbahce': {
    colors: { primary: '#FFED00', secondary: '#00205B', text: '#00205B' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Fenerbah%C3%A7e.svg',
  },
  'Fenerbahçe': {
    colors: { primary: '#FFED00', secondary: '#00205B', text: '#00205B' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Fenerbah%C3%A7e.svg',
  },
  'Besiktas': {
    colors: { primary: '#000000', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Be%C5%9Fikta%C5%9F_Logo_Be%C5%9Fikta%C5%9F_Amblem_Be%C5%9Fikta%C5%9F_Arma.svg',
  },
  'Beşiktaş': {
    colors: { primary: '#000000', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Be%C5%9Fikta%C5%9F_Logo_Be%C5%9Fikta%C5%9F_Amblem_Be%C5%9Fikta%C5%9F_Arma.svg',
  },
  'Shakhtar Donetsk': {
    colors: { primary: '#FF6600', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a1/FC_Shakhtar_Donetsk.svg',
  },
  'Red Bull Salzburg': {
    colors: { primary: '#E4002B', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/77/FC_Red_Bull_Salzburg_logo.svg',
  },
  'FC Salzburg': {
    colors: { primary: '#E4002B', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/77/FC_Red_Bull_Salzburg_logo.svg',
  },
  'Young Boys': {
    colors: { primary: '#FFD100', secondary: '#000000', text: '#000000' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/21/BSC_Young_Boys_logo.svg',
  },
  'BSC Young Boys': {
    colors: { primary: '#FFD100', secondary: '#000000', text: '#000000' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/21/BSC_Young_Boys_logo.svg',
  },
  'Club Brugge': {
    colors: { primary: '#005EB8', secondary: '#000000', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d0/Club_Brugge_KV_logo.svg',
  },
  'Anderlecht': {
    colors: { primary: '#5B2C82', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/ce/RSC_Anderlecht_logo.svg',
  },
  'RSC Anderlecht': {
    colors: { primary: '#5B2C82', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/ce/RSC_Anderlecht_logo.svg',
  },
  'Copenhagen': {
    colors: { primary: '#003087', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/93/F.C._Copenhagen_logo.svg',
  },
  'FC Copenhagen': {
    colors: { primary: '#003087', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/93/F.C._Copenhagen_logo.svg',
  },
  'Olympiacos': {
    colors: { primary: '#E4002B', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b8/Olympiacos_FC_logo.svg',
  },
  'PAOK': {
    colors: { primary: '#000000', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/22/PAOK_FC_logo.svg',
  },
  'Dinamo Zagreb': {
    colors: { primary: '#005EB8', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/GNK_Dinamo_Zagreb_logo.svg',
  },
  'GNK Dinamo Zagreb': {
    colors: { primary: '#005EB8', secondary: '#FFFFFF', text: '#FFFFFF' },
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/GNK_Dinamo_Zagreb_logo.svg',
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
