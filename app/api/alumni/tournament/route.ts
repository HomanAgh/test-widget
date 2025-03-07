import { NextResponse } from 'next/server';
import { ApiResponse } from '@/app/types/route';
import { AlumniAPIResponse, AlumniPlayer } from '@/app/types/alumni';

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

// Cache for better performance
const tournamentCache = new Map<string, { data: AlumniPlayer[]; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

// Map of tournament IDs to their corresponding league slugs in the API
const TOURNAMENT_TO_LEAGUE_MAP: Record<string, string> = {
  'brick-invitational': 'brick-invitational',
  // Add more tournaments as needed
};

function buildCacheKey(tournamentIds: string[], leagueParam: string | null) {
  return JSON.stringify({
    tournamentIds: [...tournamentIds].sort(),
    leagueParam,
  });
}

async function fetchAllPages<T>(baseUrl: string, pageSize = 100): Promise<T[]> {
  let allData: T[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const url = `${baseUrl}&offset=${offset}&limit=${pageSize}`;
    console.log(`Fetching page: ${url}`);
    
    try {
      const response = await fetch(url, { 
        next: { revalidate: 86400 } // Cache for 24 hours
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const result: ApiResponse<T> = await response.json();
      
      if (!result.data || result.data.length === 0) {
        hasMore = false;
      } else {
        allData = [...allData, ...result.data];
        offset += pageSize;
        
        // Check if we've reached the end based on total records
        if (result._meta?.totalRecords && offset >= result._meta.totalRecords) {
          hasMore = false;
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      hasMore = false;
    }
  }
  
  return allData;
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tournamentParam = searchParams.get('tournaments');
  const leagueParam = searchParams.get('leagues');
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  
  console.log(`Received request with tournaments: ${tournamentParam}, leagues: ${leagueParam}`);
  
  if (!tournamentParam) {
    return NextResponse.json(
      { error: 'At least one tournament must be specified' },
      { status: 400 }
    );
  }
  
  const tournamentIds = tournamentParam.split(',').filter(Boolean);
  
  // Check if all tournament IDs are valid
  const invalidTournaments = tournamentIds.filter(id => !TOURNAMENT_TO_LEAGUE_MAP[id]);
  if (invalidTournaments.length > 0) {
    return NextResponse.json(
      { error: `Invalid tournament IDs: ${invalidTournaments.join(', ')}` },
      { status: 400 }
    );
  }
  
  // Convert tournament IDs to league slugs
  const leagueSlugs = tournamentIds.map(id => TOURNAMENT_TO_LEAGUE_MAP[id]);
  
  // Check cache first
  const cacheKey = buildCacheKey(tournamentIds, leagueParam);
  const cachedData = tournamentCache.get(cacheKey);
  
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    console.log('Using cached tournament data');
    const paginatedData = cachedData.data.slice(offset, offset + limit);
    
    return NextResponse.json({
      players: paginatedData,
      total: cachedData.data.length,
      nextOffset: offset + limit < cachedData.data.length ? offset + limit : null,
    });
  }
  
  try {
    // Process each tournament (league) one by one and combine results
    let allPlayers: any[] = [];
    
    for (const leagueSlug of leagueSlugs) {
      const tournamentUrl = `${apiBaseUrl}/players?hasPlayedInLeague=${leagueSlug}&sort=name&apiKey=${apiKey}`;
      const tournamentPlayers = await fetchAllPages<any>(tournamentUrl);
      console.log(`Found ${tournamentPlayers.length} players from tournament: ${leagueSlug}`);
      
      allPlayers = [...allPlayers, ...tournamentPlayers];
    }
    
    // Remove duplicates (players who participated in multiple tournaments)
    allPlayers = Array.from(new Map(allPlayers.map(player => [player.id, player])).values());
    console.log(`Found ${allPlayers.length} unique players from all tournaments`);
    
    // If no additional league filters, return all players from the tournaments
    if (!leagueParam || leagueParam.trim() === '') {
      const formattedPlayers = allPlayers.map(player => ({
        id: player.id,
        name: player.name || 'Unknown',
        birthYear: player.yearOfBirth ? parseInt(player.yearOfBirth, 10) : null,
        gender: player.gender || null,
        status: player.status || null,
        position: player.position || 'Unknown',
        draftPick: {
          year: 0,
          round: 0,
          overall: 0
        },
        teams: [],
        teamName: tournamentIds.map(id => TOURNAMENT_TO_LEAGUE_MAP[id]).join(', ')
      }));
      
      // Cache the results
      tournamentCache.set(cacheKey, {
        data: formattedPlayers,
        timestamp: Date.now()
      });
      
      const paginatedData = formattedPlayers.slice(offset, offset + limit);
      
      return NextResponse.json({
        players: paginatedData,
        total: formattedPlayers.length,
        nextOffset: offset + limit < formattedPlayers.length ? offset + limit : null,
      });
    }
    
    // Parse additional league filters
    const selectedLeagues = leagueParam.split(',').filter(Boolean);
    console.log(`Additional filtering by leagues: ${selectedLeagues.join(', ')}`);
    
    // For each player, check if they've played in any of the selected leagues
    const filteredPlayers: AlumniPlayer[] = [];
    
    for (const player of allPlayers) {
      const playerLeagues = await fetchPlayerLeagues(player.id);
      
      // Check if player has played in any of the selected leagues
      // Convert everything to lowercase for case-insensitive comparison
      const hasPlayedInSelectedLeague = playerLeagues.some(playerLeague => 
        selectedLeagues.some(selectedLeague => 
          playerLeague.toLowerCase() === selectedLeague.toLowerCase()
        )
      );
      
      if (hasPlayedInSelectedLeague) {
        filteredPlayers.push({
          id: player.id,
          name: player.name || 'Unknown',
          birthYear: player.yearOfBirth ? parseInt(player.yearOfBirth, 10) : null,
          gender: player.gender || null,
          status: player.status || null,
          position: player.position || 'Unknown',
          draftPick: {
            year: 0,
            round: 0,
            overall: 0
          },
          teams: playerLeagues.map(league => ({
            name: league,
            leagueLevel: null
          })),
          teamName: tournamentIds.map(id => TOURNAMENT_TO_LEAGUE_MAP[id]).join(', ')
        });
      }
    }
    
    console.log(`Found ${filteredPlayers.length} players matching all criteria`);
    
    // Cache the results
    tournamentCache.set(cacheKey, {
      data: filteredPlayers,
      timestamp: Date.now()
    });
    
    const paginatedData = filteredPlayers.slice(offset, offset + limit);
    
    return NextResponse.json({
      players: paginatedData,
      total: filteredPlayers.length,
      nextOffset: offset + limit < filteredPlayers.length ? offset + limit : null,
    });
    
  } catch (error) {
    console.error('Error in tournament API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tournament players' },
      { status: 500 }
    );
  }
} 