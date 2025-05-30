// Utility functions for determining league categories
// This can be used in both client and server components

import { getLeagueSlugs, getLeagueCategory as getLeagueCategoryFromConfig } from '@/app/config/leagues';

// Get league slugs from centralized config
const professionalLeagueSlugs = getLeagueSlugs('professional');
const collegeLeagueSlugs = getLeagueSlugs('college');
const juniorLeagueSlugs = getLeagueSlugs('junior');

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
  return getLeagueCategoryFromConfig(leagueSlug);
}

// Export the arrays for other uses if needed
export { professionalLeagueSlugs, collegeLeagueSlugs, juniorLeagueSlugs }; 