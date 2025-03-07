import { NextResponse } from 'next/server';
import { ApiResponse, DraftSelection } from '@/app/types/route';

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

// Cache for better performance
const playerDetailsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerIds } = body;
    
    if (!playerIds || !Array.isArray(playerIds) || playerIds.length === 0) {
      return NextResponse.json(
        { error: 'Player IDs must be provided as an array' },
        { status: 400 }
      );
    }
    
    // Check cache first
    const cacheKey = JSON.stringify([...playerIds].sort());
    const cachedData = playerDetailsCache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      console.log('Using cached player details data');
      return NextResponse.json(cachedData.data);
    }
    
    // Fetch draft picks for all players
    const draftPicks = await fetchBatchDraftPicks(playerIds);
    
    // Fetch team history for all players
    const teamHistory = await fetchBatchTeamHistory(playerIds);
    
    // Fetch birth years for all players
    const birthYears = await fetchBatchBirthYears(playerIds);
    console.log(`Fetched birth years for ${playerIds.length} players, got ${birthYears.size} results`);
    
    // Combine the data
    const playerDetails: Record<number, any> = {};
    
    for (const playerId of playerIds) {
      const birthYear = birthYears.get(playerId);
      console.log(`Player ${playerId} birth year: ${birthYear}`);
      
      playerDetails[playerId] = {
        draftPick: draftPicks.get(playerId) || {
          year: 0,
          round: 0,
          overall: 0
        },
        teams: teamHistory.get(playerId) || [],
        birthYear: birthYear
      };
    }
    
    // Cache the results
    playerDetailsCache.set(cacheKey, {
      data: playerDetails,
      timestamp: Date.now()
    });
    
    return NextResponse.json(playerDetails);
    
  } catch (error) {
    console.error('Error in player-details API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player details' },
      { status: 500 }
    );
  }
}

async function fetchBatchBirthYears(
  playerIds: number[],
  chunkSize = 100
): Promise<Map<number, number | null>> {
  const resultMap = new Map<number, number | null>();
  if (!playerIds.length) return resultMap;

  // Process chunks in parallel with a reasonable concurrency limit
  const chunks: number[][] = [];
  for (let i = 0; i < playerIds.length; i += chunkSize) {
    chunks.push(playerIds.slice(i, i + chunkSize));
  }
  
  const MAX_CONCURRENT = 3; // Limit concurrent requests
  
  // Process chunks with limited concurrency
  for (let i = 0; i < chunks.length; i += MAX_CONCURRENT) {
    const chunkPromises = chunks.slice(i, i + MAX_CONCURRENT).map(async (chunk) => {
      const chunkMap = new Map<number, number | null>();
      
      // Join player IDs for a single request
      const joinedIds = chunk.join(',');
      try {
        // Use the players endpoint with multiple IDs instead of individual requests
        const url = `${apiBaseUrl}/players?id=${joinedIds}&apiKey=${apiKey}&fields=id,yearOfBirth`;
        
        console.log(`Fetching birth years for ${chunk.length} players`);
        const response = await fetch(url, {
          next: { revalidate: 86400 } // Cache for 24 hours
        });
        
        if (!response.ok) {
          console.error(`Failed to fetch birth years: ${response.status}`);
          chunk.forEach(id => chunkMap.set(id, null));
          return chunkMap;
        }
        
        const data = await response.json();
        
        if (!data.data || !Array.isArray(data.data)) {
          console.error('Invalid response format for birth years');
          chunk.forEach(id => chunkMap.set(id, null));
          return chunkMap;
        }
        
        // Process each player in the response
        data.data.forEach((player: any) => {
          if (player && player.id) {
            const birthYear = player.yearOfBirth ? parseInt(player.yearOfBirth, 10) : null;
            console.log(`Player ${player.id} birth year: ${birthYear}, raw: ${player.yearOfBirth}`);
            chunkMap.set(player.id, birthYear);
          }
        });
        
        // Set null for any players not found in the response
        chunk.forEach(id => {
          if (!chunkMap.has(id)) {
            chunkMap.set(id, null);
          }
        });
      } catch (error) {
        console.error(`Error fetching birth years for chunk:`, error);
        chunk.forEach(id => chunkMap.set(id, null));
      }
      
      return chunkMap;
    });

    const chunkResults = await Promise.all(chunkPromises);
    for (const chunkMap of chunkResults) {
      for (const [pid, birthYear] of chunkMap.entries()) {
        resultMap.set(pid, birthYear);
      }
    }
  }

  return resultMap;
}

async function fetchBatchDraftPicks(
  playerIds: number[],
  chunkSize = 500
): Promise<Map<number, DraftSelection>> {
  const resultMap = new Map<number, DraftSelection>();
  if (!playerIds.length) return resultMap;

  // Process chunks in parallel with a reasonable concurrency limit
  const chunks: number[][] = [];
  for (let i = 0; i < playerIds.length; i += chunkSize) {
    chunks.push(playerIds.slice(i, i + chunkSize));
  }
  
  const MAX_CONCURRENT = 3; // Limit concurrent requests
  
  // Process chunks with limited concurrency
  for (let i = 0; i < chunks.length; i += MAX_CONCURRENT) {
    const chunkPromises = chunks.slice(i, i + MAX_CONCURRENT).map(async (chunk) => {
      const joinedIds = chunk.join(',');
      const url = `${apiBaseUrl}/draft-selections?offset=0&limit=1000&draftType=nhl-entry-draft&player=${joinedIds}&apiKey=${apiKey}&fields=${encodeURIComponent(
        'player.id,year,round,overall,team.name,team.logo.small,draftType.slug'
      )}`;

      try {
        const response = await fetch(url, {
          next: { revalidate: 86400 } // Cache for 24 hours
        });
        
        if (!response.ok) {
          return new Map<number, DraftSelection>();
        }

        interface DraftSelectionWithPlayer extends DraftSelection {
          player?: { id: number };
        }
        const data: ApiResponse<DraftSelectionWithPlayer> = await response.json();
        if (!data.data) {
          return new Map<number, DraftSelection>();
        }

        const chunkMap = new Map<number, DraftSelection>();
        for (const ds of data.data) {
          const pid = ds.player?.id;
          if (pid) {
            chunkMap.set(pid, {
              year: ds.year,
              round: ds.round,
              overall: ds.overall,
              team: ds.team?.name ? {
                name: ds.team.name,
                logo: ds.team?.logo?.small || ''
              } : undefined
            });
          }
        }
        return chunkMap;
      } catch (error) {
        console.error('Error fetching draft picks:', error);
        return new Map<number, DraftSelection>();
      }
    });

    const chunkResults = await Promise.all(chunkPromises);
    for (const chunkMap of chunkResults) {
      for (const [pid, ds] of chunkMap.entries()) {
        resultMap.set(pid, ds);
      }
    }
  }

  return resultMap;
}

async function fetchBatchTeamHistory(
  playerIds: number[],
  chunkSize = 100
): Promise<Map<number, any[]>> {
  const resultMap = new Map<number, any[]>();
  if (!playerIds.length) return resultMap;

  // Process chunks in parallel with a reasonable concurrency limit
  const chunks: number[][] = [];
  for (let i = 0; i < playerIds.length; i += chunkSize) {
    chunks.push(playerIds.slice(i, i + chunkSize));
  }
  
  const MAX_CONCURRENT = 3; // Limit concurrent requests
  
  // Process chunks with limited concurrency
  for (let i = 0; i < chunks.length; i += MAX_CONCURRENT) {
    const chunkPromises = chunks.slice(i, i + MAX_CONCURRENT).map(async (chunk) => {
      const chunkMap = new Map<number, any[]>();
      
      for (const playerId of chunk) {
        try {
          const url = `${apiBaseUrl}/player-stats?player=${playerId}&sort=-season&apiKey=${apiKey}&fields=league.slug,league.name,league.leagueLevel,team.name,season`;
          
          const response = await fetch(url, {
            next: { revalidate: 86400 } // Cache for 24 hours
          });
          
          if (!response.ok) {
            chunkMap.set(playerId, []);
            continue;
          }
          
          const data = await response.json();
          
          if (!data.data || data.data.length === 0) {
            chunkMap.set(playerId, []);
            continue;
          }
          
          // Process team history
          const teams: any[] = [];
          const processedTeams = new Set<string>();
          
          for (const stat of data.data) {
            const teamName = stat.team?.name;
            const leagueSlug = stat.league?.slug;
            const leagueLevel = stat.league?.leagueLevel;
            
            if (teamName && leagueSlug) {
              const key = `${teamName}-${leagueSlug}`;
              
              if (!processedTeams.has(key)) {
                teams.push({
                  name: teamName,
                  leagueLevel: leagueLevel || null
                });
                
                processedTeams.add(key);
              }
            }
          }
          
          chunkMap.set(playerId, teams);
        } catch (error) {
          console.error(`Error fetching team history for player ${playerId}:`, error);
          chunkMap.set(playerId, []);
        }
      }
      
      return chunkMap;
    });

    const chunkResults = await Promise.all(chunkPromises);
    for (const chunkMap of chunkResults) {
      for (const [pid, teams] of chunkMap.entries()) {
        resultMap.set(pid, teams);
      }
    }
  }

  return resultMap;
} 