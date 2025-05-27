// Utility functions for determining league categories
// This can be used in both client and server components

// Professional league slugs (from useFetchLeagues.ts)
const professionalLeagueSlugs = [
  // Women's Leagues
  'pwhl-w', 'sdhl-w', 'nwhl-ca-w', 'phf-w',
  // Men's Leagues
  'nhl', 'shl', 'ahl', 'khl', 'nl', 'liiga', 'czechia', 'del', 'echl', 'icehl', 'slovakia', 'hockeyallsvenskan','alpshl','norway','del2','denmark', 'hockeyettan', 'sl', 'mestis', 'eihl', 'ligue-magnus'
];

// College league slugs (from useFetchLeagues.ts)
const collegeLeagueSlugs = [
  // Women's Leagues
  'ncaa-w', 'ncaa-iii-w', 'acha-w', 'acha-d2-w', 'usports-w',
  // Men's Leagues
  'ncaa', 'usports', 'acac', 'acha'
];

// Junior league slugs (from useFetchLeagues.ts)
const juniorLeagueSlugs = [
  // Women's Leagues
  'jwhl-w',
  // Men's Leagues
  'ohl', 'whl', 'ushl', 'qmjhl', 'j20-nationell', 'mhl', 'cchl', 'nahl'
];

/**
 * Determines which league categories are represented in the selected leagues
 * @param selectedLeagues Array of league slugs
 * @returns Object with boolean flags for each category
 */
export function determineSelectedLeagueCategories(selectedLeagues: string[]) {
  const categories = {
    junior: false,
    college: false,
    professional: false,
  };

  selectedLeagues.forEach((selectedSlug) => {
    const normalizedSlug = selectedSlug.toLowerCase();
    
    if (juniorLeagueSlugs.includes(normalizedSlug)) {
      categories.junior = true;
    } else if (collegeLeagueSlugs.includes(normalizedSlug)) {
      categories.college = true;
    } else if (professionalLeagueSlugs.includes(normalizedSlug)) {
      categories.professional = true;
    }
  });

  return categories;
}

/**
 * Gets the category for a specific league slug
 * @param leagueSlug The league slug to categorize
 * @returns The category name or null if not found
 */
export function getLeagueCategory(leagueSlug: string): 'junior' | 'college' | 'professional' | null {
  const normalizedSlug = leagueSlug.toLowerCase();
  
  if (juniorLeagueSlugs.includes(normalizedSlug)) {
    return 'junior';
  } else if (collegeLeagueSlugs.includes(normalizedSlug)) {
    return 'college';
  } else if (professionalLeagueSlugs.includes(normalizedSlug)) {
    return 'professional';
  }
  
  return null;
}

// Export the arrays for other uses if needed
export { professionalLeagueSlugs, collegeLeagueSlugs, juniorLeagueSlugs }; 