import { NextResponse } from 'next/server';
import { AlumniPlayer } from '@/app/types/alumni';

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

// Cache for better performance
const leagueFilterCache = new Map<string, { data: number[]; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

function buildCacheKey(playerIds: number[], leagueParam: string) {
  return JSON.stringify({
    playerIds: [...playerIds].sort(),
    leagueParam,
  });
}

// Function to fetch player stats to check which leagues they've played in
async function fetchPlayerLeagues(playerId: number): Promise<string[]> {
  const url = `${apiBaseUrl}/player-stats?player=${playerId}&sort=-season&apiKey=${apiKey}&fields=league.slug,league.name`;
  
  try {
    const response = await fetch(url, { 
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.data || result.data.length === 0) {
      return [];
    }
    
    // Extract unique league slugs
    const leagueSlugs = new Set<string>();
    result.data.forEach((stat: any) => {
      if (stat.league?.slug) {
        leagueSlugs.add(stat.league.slug);
      }
    });
    
    return Array.from(leagueSlugs);
  } catch (error) {
    console.error(`Error fetching leagues for player ${playerId}:`, error);
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerIds, leagues } = body;
    
    console.log(`Received request to filter ${playerIds?.length || 0} players by leagues:`, leagues);
    
    if (!playerIds || !Array.isArray(playerIds) || playerIds.length === 0) {
      return NextResponse.json(
        { error: 'Player IDs must be provided as an array' },
        { status: 400 }
      );
    }
    
    if (!leagues || !Array.isArray(leagues) || leagues.length === 0) {
      return NextResponse.json(
        { error: 'Leagues must be provided as an array' },
        { status: 400 }
      );
    }
    
    // Check cache first
    const cacheKey = buildCacheKey(playerIds, JSON.stringify(leagues));
    const cachedData = leagueFilterCache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      console.log('Using cached league filter data');
      return NextResponse.json({
        playerIds: cachedData.data
      });
    }
    
    // For each player, check if they've played in any of the selected leagues
    const filteredPlayerIds: number[] = [];
    let processedCount = 0;
    
    for (const playerId of playerIds) {
      const playerLeagues = await fetchPlayerLeagues(playerId);
      
      // Check if player has played in any of the selected leagues
      // Convert everything to lowercase for case-insensitive comparison
      const hasPlayedInSelectedLeague = playerLeagues.some(playerLeague => 
        leagues.some(selectedLeague => 
          playerLeague.toLowerCase() === selectedLeague.toLowerCase()
        )
      );
      
      if (hasPlayedInSelectedLeague) {
        filteredPlayerIds.push(playerId);
      }
      
      processedCount++;
      if (processedCount % 10 === 0) {
        console.log(`Processed ${processedCount}/${playerIds.length} players for league filtering`);
      }
    }
    
    console.log(`Found ${filteredPlayerIds.length} players matching league criteria out of ${playerIds.length} total`);
    
    // Cache the results
    leagueFilterCache.set(cacheKey, {
      data: filteredPlayerIds,
      timestamp: Date.now()
    });
    
    return NextResponse.json({
      playerIds: filteredPlayerIds
    });
    
  } catch (error) {
    console.error('Error in filter-by-leagues API route:', error);
    return NextResponse.json(
      { error: 'Failed to filter players by leagues' },
      { status: 500 }
    );
  }
} 