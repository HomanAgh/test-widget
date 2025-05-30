export interface LeagueConfig {
  slug: string;
  name: string;
  category: 'professional' | 'junior' | 'college';
  region: 'north-america' | 'europe' | 'other';
  ranking: number;
  level?: string; // For the route.ts getLeagueLevel function
}

// Centralized league configuration - ADD NEW LEAGUES HERE
export const LEAGUE_CONFIG: LeagueConfig[] = [
  // Professional Leagues - North America
  { slug: 'nhl', name: 'NHL', category: 'professional', region: 'north-america', ranking: 1, level: 'professional' },
  { slug: 'ahl', name: 'AHL', category: 'professional', region: 'north-america', ranking: 2, level: 'professional' },
  { slug: 'echl', name: 'ECHL', category: 'professional', region: 'north-america', ranking: 9, level: 'professional' },

  // Professional Leagues - Europe
  { slug: 'shl', name: 'SHL', category: 'professional', region: 'europe', ranking: 3, level: 'professional' },
  { slug: 'khl', name: 'KHL', category: 'professional', region: 'europe', ranking: 4, level: 'professional' },
  { slug: 'nl', name: 'NL', category: 'professional', region: 'europe', ranking: 5, level: 'professional' },
  { slug: 'liiga', name: 'Liiga', category: 'professional', region: 'europe', ranking: 6, level: 'professional' },
  { slug: 'czechia', name: 'Czechia', category: 'professional', region: 'europe', ranking: 7, level: 'professional' },
  { slug: 'del', name: 'DEL', category: 'professional', region: 'europe', ranking: 8, level: 'professional' },
  { slug: 'icehl', name: 'ICEHL', category: 'professional', region: 'europe', ranking: 10, level: 'professional' },
  { slug: 'slovakia', name: 'Slovakia', category: 'professional', region: 'europe', ranking: 11, level: 'professional' },
  { slug: 'hockeyallsvenskan', name: 'HockeyAllsvenskan', category: 'professional', region: 'europe', ranking: 12, level: 'professional' },
  { slug: 'sl', name: 'SL', category: 'professional', region: 'europe', ranking: 13, level: 'professional' },
  { slug: 'denmark', name: 'Denmark', category: 'professional', region: 'europe', ranking: 14, level: 'professional' },
  { slug: 'norway', name: 'Norway', category: 'professional', region: 'europe', ranking: 15, level: 'professional' },
  { slug: 'mestis', name: 'Mestis', category: 'professional', region: 'europe', ranking: 16, level: 'professional' },
  { slug: 'del2', name: 'DEL2', category: 'professional', region: 'europe', ranking: 17, level: 'professional' },
  { slug: 'eihl', name: 'EIHL', category: 'professional', region: 'europe', ranking: 18, level: 'professional' },
  { slug: 'alpshl', name: 'AlpsHL', category: 'professional', region: 'europe', ranking: 19, level: 'professional' },
  { slug: 'ligue-magnus', name: 'Ligue Magnus', category: 'professional', region: 'europe', ranking: 20, level: 'professional' },
  { slug: 'hockeyettan', name: 'HockeyEttan', category: 'professional', region: 'europe', ranking: 21, level: 'professional' },

  // Women's Professional Leagues
  { slug: 'pwhl-w', name: 'PWHL', category: 'professional', region: 'north-america', ranking: 33, level: 'professional' },
  { slug: 'sdhl-w', name: 'SDHL', category: 'professional', region: 'europe', ranking: 34, level: 'professional' },
  { slug: 'nwhl-ca-w', name: 'NWHL', category: 'professional', region: 'north-america', ranking: 35, level: 'professional' },
  { slug: 'phf-w', name: 'PHF', category: 'professional', region: 'north-america', ranking: 36, level: 'professional' },

  // College Leagues
  { slug: 'ncaa', name: 'NCAA', category: 'college', region: 'north-america', ranking: 22, level: 'college' },
  { slug: 'usports', name: 'USports', category: 'college', region: 'north-america', ranking: 23, level: 'college' },
  { slug: 'acac', name: 'ACAC', category: 'college', region: 'north-america', ranking: 24, level: 'college' },
  { slug: 'acha', name: 'ACHA', category: 'college', region: 'north-america', ranking: 25, level: 'college' },

  // Women's College Leagues
  { slug: 'ncaa-w', name: 'NCAA Women', category: 'college', region: 'north-america', ranking: 37, level: 'college' },
  { slug: 'ncaa-iii-w', name: 'NCAA III Women', category: 'college', region: 'north-america', ranking: 38, level: 'college' },
  { slug: 'acha-w', name: 'ACHA Women', category: 'college', region: 'north-america', ranking: 39, level: 'college' },
  { slug: 'acha-d2-w', name: 'ACHA D2 Women', category: 'college', region: 'north-america', ranking: 40, level: 'college' },
  { slug: 'usports-w', name: 'USports Women', category: 'college', region: 'north-america', ranking: 42, level: 'college' },

  // Junior Leagues
  { slug: 'ohl', name: 'OHL', category: 'junior', region: 'north-america', ranking: 26, level: 'junior' },
  { slug: 'whl', name: 'WHL', category: 'junior', region: 'north-america', ranking: 27, level: 'junior' },
  { slug: 'ushl', name: 'USHL', category: 'junior', region: 'north-america', ranking: 28, level: 'junior' },
  { slug: 'qmjhl', name: 'QMJHL', category: 'junior', region: 'north-america', ranking: 29, level: 'junior' },
  { slug: 'j20-nationell', name: 'J20 Nationell', category: 'junior', region: 'europe', ranking: 30, level: 'junior' },
  { slug: 'mhl', name: 'MHL', category: 'junior', region: 'europe', ranking: 31, level: 'junior' },
  { slug: 'cchl', name: 'CCHL', category: 'junior', region: 'north-america', ranking: 32, level: 'junior' },
  { slug: 'nahl', name: 'NAHL', category: 'junior', region: 'north-america', ranking: 43, level: 'junior' },

  // Women's Junior Leagues
  { slug: 'jwhl-w', name: 'JWHL Women', category: 'junior', region: 'north-america', ranking: 41, level: 'junior' },
];

// Utility functions to get league information
export const getLeaguesByCategory = (category: 'professional' | 'junior' | 'college') => {
  return LEAGUE_CONFIG.filter(league => league.category === category);
};

export const getLeaguesByRegion = (region: 'north-america' | 'europe' | 'other') => {
  return LEAGUE_CONFIG.filter(league => league.region === region);
};

export const getLeagueRankings = (): Record<string, number> => {
  const rankings: Record<string, number> = {};
  LEAGUE_CONFIG.forEach(league => {
    rankings[league.slug.toLowerCase()] = league.ranking;
  });
  return rankings;
};

export const getLeagueSlugs = (category?: 'professional' | 'junior' | 'college'): string[] => {
  const leagues = category ? getLeaguesByCategory(category) : LEAGUE_CONFIG;
  return leagues.map(league => league.slug.toLowerCase());
};

export const getLeagueLevel = (slug?: string): string => {
  if (!slug) return "unknown";
  const league = LEAGUE_CONFIG.find(l => l.slug.toLowerCase() === slug.toLowerCase());
  return league?.level || "professional"; // Default to professional if unknown
};

export const getLeagueCategory = (slug?: string): 'professional' | 'junior' | 'college' | null => {
  if (!slug) return null;
  const league = LEAGUE_CONFIG.find(l => l.slug.toLowerCase() === slug.toLowerCase());
  return league?.category || null;
};

export const getNorthAmericanLeagues = (): string[] => {
  return getLeaguesByRegion('north-america')
    .filter(league => league.category !== 'professional' || !['nhl', 'ahl'].includes(league.slug))
    .map(league => league.slug.toLowerCase());
};

export const getEuropeanLeagues = (): string[] => {
  return getLeaguesByRegion('europe').map(league => league.slug.toLowerCase());
};

// Tournament mapping helper (for route.ts)
export const getTournamentLeagueSlug = (tournamentSlug: string): string => {
  const slugLc = tournamentSlug.toLowerCase();
  
  // Tournament to league mapping
  const tournamentMapping: Record<string, string> = {
    // International Pro Tournaments
    "world-championship": "wc",
    "wc": "wc",
    "olympics": "olympics",
    "olympic-games": "olympics",
    "spengler-cup": "shl",
    "champions-hockey-league": "shl",
    
    // Junior Tournaments
    "world-junior": "wjc",
    "wjc": "wjc",
    "world-juniors": "wjc",
    "u18-world-championship": "wjc",
    "u18-worlds": "wjc",
    "memorial-cup": "ohl",
    "hlinka-gretzky": "wjc",
    
    // College Tournaments
    "ncaa-tournament": "ncaa",
    "frozen-four": "ncaa",
    "beanpot": "ncaa",
    
    // Women's Tournaments
    "womens-worlds": "pwhl-w",
    "womens-olympics": "pwhl-w",
    "u18-womens-worlds": "jwhl-w"
  };

  // Direct mapping
  if (tournamentMapping[slugLc]) {
    return tournamentMapping[slugLc];
  }
  
  // Fallback based on name patterns
  if (slugLc.includes('junior') || slugLc.includes('u18') || slugLc.includes('u20')) {
    return 'wjc';
  }
  
  if (slugLc.includes('college') || slugLc.includes('ncaa') || slugLc.includes('university')) {
    return 'ncaa';
  }
  
  if (slugLc.includes('women') || slugLc.includes('girl')) {
    return 'pwhl-w';
  }
  
  // Default to NHL
  return 'nhl';
}; 