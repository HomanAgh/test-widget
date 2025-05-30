# League Configuration

This directory contains the centralized league configuration that is used throughout the application.

## Adding a New League

To add a new league, you only need to update **one file**: `leagues.ts`

### Steps:

1. Open `app/config/leagues.ts`
2. Add your new league to the `LEAGUE_CONFIG` array with the following format:

```typescript
{
  slug: 'your-league-slug',           // Must match the API slug
  name: 'Your League Name',           // Display name
  category: 'professional',           // 'professional', 'junior', or 'college'
  region: 'north-america',            // 'north-america', 'europe', or 'other'
  ranking: 100,                       // Lower numbers = higher priority
  level: 'professional'               // Used for league level determination
}
```

### Example:

```typescript
// Adding a new European professional league
{ 
  slug: 'finnish-mestis', 
  name: 'Finnish Mestis', 
  category: 'professional', 
  region: 'europe', 
  ranking: 50, 
  level: 'professional' 
}
```

### Properties Explained:

- **slug**: The exact slug used in the API (case-insensitive)
- **name**: Human-readable display name
- **category**: Determines which league category it belongs to
- **region**: Used for geographical grouping in components
- **ranking**: Lower numbers appear first in sorted lists
- **level**: Used for determining player league levels

### What Gets Updated Automatically:

When you add a league to the configuration, it will automatically be available in:

- ✅ League selection dropdowns (`LeagueSelection.tsx`)
- ✅ League ranking/sorting (`LeagueSelection.tsx`)
- ✅ Regional grouping (`LeagueGrouping.tsx`)
- ✅ League category determination (`leagueCategories.ts`)
- ✅ Custom league filtering (`useFetchLeagues.ts`)
- ✅ Tournament routing logic (`route.ts`)

### Tournament Mappings:

If you need to add a new tournament mapping, update the `tournamentMapping` object in the `getTournamentLeagueSlug` function within `leagues.ts`.

## Files That Use This Configuration:

- `app/components/alumni/LeagueSelection.tsx`
- `app/components/common/LeagueGrouping.tsx`
- `app/hooks/useFetchLeagues.ts`
- `app/utils/leagueCategories.ts`
- `app/api/tournament-alumni/route.ts` 