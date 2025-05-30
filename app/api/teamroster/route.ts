import { NextRequest, NextResponse } from "next/server";

const fetchCountryFlag = async (slug: string, apiKey: string, apiBaseUrl: string) => {
  try {
    const response = await fetch(`${apiBaseUrl}/countries/${slug}?apiKey=${apiKey}`);
    if (response.ok) {
      const countryData = await response.json();
      return countryData.data.flagUrl?.small || null; 
    }
  } catch {
    console.warn(`Failed to fetch flag for ${slug}`);
  }
  return null;
};

const fetchPlayerStats = async (playerId: string, teamId: string, season: string | null, apiKey: string, apiBaseUrl: string) => {
  try {
    // If season is provided, fetch season-specific stats; otherwise use latest stats
    if (season) {
      // Fetch season-specific player stats
      const statsFields = [
        "regularStats.GP",
        "regularStats.G", 
        "regularStats.A",
        "regularStats.PTS",
        "postseasonStats.GP",
        "postseasonStats.G",
        "postseasonStats.A", 
        "postseasonStats.PTS",
        "team.id",
        "team.name"
      ].join(",");
      
      const statsUrl = `${apiBaseUrl}/player-stats?player=${playerId}&season=${season}&apiKey=${apiKey}&fields=${encodeURIComponent(statsFields)}`;
      
      const response = await fetch(statsUrl);
      if (response.ok) {
        const data = await response.json();
        
        // Check if we have any data
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          // Find the matching team stats for this season - must match exact team ID
          // Try both string and number comparison since API might return different types
          const teamStats = data.data.find((stat: any) => 
            stat.team?.id === teamId || 
            stat.team?.id === parseInt(teamId) || 
            stat.team?.id?.toString() === teamId
          );
          
          if (teamStats) {
            return {
              regular: {
                gamesPlayed: teamStats.regularStats?.GP || 0,
                goals: teamStats.regularStats?.G || 0,
                assists: teamStats.regularStats?.A || 0,
                points: teamStats.regularStats?.PTS || 0
              },
              postseason: {
                gamesPlayed: teamStats.postseasonStats?.GP || 0,
                goals: teamStats.postseasonStats?.G || 0,
                assists: teamStats.postseasonStats?.A || 0,
                points: teamStats.postseasonStats?.PTS || 0
              }
            };
          } else {
            // No stats found for this specific team - return zeros
            return {
              regular: { gamesPlayed: 0, goals: 0, assists: 0, points: 0 },
              postseason: { gamesPlayed: 0, goals: 0, assists: 0, points: 0 }
            };
          }
        }
      } else {
        // Try without season filter as fallback
        const fallbackUrl = `${apiBaseUrl}/player-stats?player=${playerId}&apiKey=${apiKey}&fields=${encodeURIComponent(statsFields)}`;
        const fallbackResponse = await fetch(fallbackUrl);
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          
          if (fallbackData.data && Array.isArray(fallbackData.data) && fallbackData.data.length > 0) {
            const teamStats = fallbackData.data.find((stat: any) => 
              stat.team?.id === teamId || 
              stat.team?.id === parseInt(teamId) || 
              stat.team?.id?.toString() === teamId
            );
            
            if (teamStats) {
              return {
                regular: {
                  gamesPlayed: teamStats.regularStats?.GP || 0,
                  goals: teamStats.regularStats?.G || 0,
                  assists: teamStats.regularStats?.A || 0,
                  points: teamStats.regularStats?.PTS || 0
                },
                postseason: {
                  gamesPlayed: teamStats.postseasonStats?.GP || 0,
                  goals: teamStats.postseasonStats?.G || 0,
                  assists: teamStats.postseasonStats?.A || 0,
                  points: teamStats.postseasonStats?.PTS || 0
                }
              };
            }
          }
        }
      }
    } else {
      // Fallback to latest stats if no season specified
      const statsFields = [
        "latestStats.regularStats.GP",
        "latestStats.regularStats.G",
        "latestStats.regularStats.A",
        "latestStats.regularStats.PTS",
        "latestStats.postseasonStats.GP",
        "latestStats.postseasonStats.G",
        "latestStats.postseasonStats.A",
        "latestStats.postseasonStats.PTS"
      ].join(",");
      
      const response = await fetch(`${apiBaseUrl}/players/${playerId}?apiKey=${apiKey}&fields=${encodeURIComponent(statsFields)}`);
      if (response.ok) {
        const data = await response.json();
        return {
          regular: {
            gamesPlayed: data.data?.latestStats?.regularStats?.GP || 0,
            goals: data.data?.latestStats?.regularStats?.G || 0,
            assists: data.data?.latestStats?.regularStats?.A || 0,
            points: data.data?.latestStats?.regularStats?.PTS || 0
          },
          postseason: {
            gamesPlayed: data.data?.latestStats?.postseasonStats?.GP || 0,
            goals: data.data?.latestStats?.postseasonStats?.G || 0,
            assists: data.data?.latestStats?.postseasonStats?.A || 0,
            points: data.data?.latestStats?.postseasonStats?.PTS || 0
          }
        };
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch stats for player ${playerId}:`, err);
  }
  return { 
    regular: { gamesPlayed: 0, goals: 0, assists: 0, points: 0 },
    postseason: { gamesPlayed: 0, goals: 0, assists: 0, points: 0 }
  };
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId");
  const season = searchParams.get("season");
  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!teamId) {
    console.log("Missing teamId query parameter");
    return NextResponse.json(
      { error: "Team ID is required" },
      { status: 400 }
    );
  }

  if (!apiKey || !apiBaseUrl) {
    console.log("Missing API key or base URL");
    return NextResponse.json(
      { error: "API key or base URL is missing in environment variables" },
      { status: 500 }
    );
  }

  console.log(`Fetching roster for team ${teamId}${season ? ` for season ${season}` : ' (latest season)'}`);

  try {
    const teamField = [
      "player.id",
      "player.firstName",
      "player.lastName",
      "player.position",
      "player.placeOfBirth",
      "player.shoots",
      "player.catches",
      "player.weight.metrics",
      "player.height.metrics",
      "jerseyNumber",
      "player.nationality.slug",
      "player.dateOfBirth",
      "playerRole",
    ].join(",")
  
    let rosterUrl = `${apiBaseUrl}/teams/${teamId}/roster?fields=${teamField}&apiKey=${apiKey}`;
    if (season) {
      rosterUrl += `&season=${season}`;
    }
    
    console.log("Fetching roster from URL:", rosterUrl);
    const response = await fetch(rosterUrl);

    console.log("Roster API Response Status:", response.status);
    if (!response.ok) {
      throw new Error(`Failed to fetch roster: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Fetched Roster Data:", data);

    if (!data.data || data.data.length === 0) {
      return NextResponse.json(
        { error: "No roster data available for the team." },
        { status: 404 }
      );
    }

    const roster = await Promise.all(
      data.data.map(async (entry: any) => {
        const flagUrl = entry.player?.nationality?.slug
          ? await fetchCountryFlag(entry.player.nationality.slug, apiKey, apiBaseUrl)
          : null;
          
        const playerStats = entry.player?.id 
          ? await fetchPlayerStats(entry.player.id, teamId, season, apiKey, apiBaseUrl)
          : { 
              regular: { gamesPlayed: 0, goals: 0, assists: 0, points: 0 },
              postseason: { gamesPlayed: 0, goals: 0, assists: 0, points: 0 }
            };

        return {
          id: entry.player?.id || "Unknown ID",
          firstName: entry.player?.firstName || "Unknown",
          lastName: entry.player?.lastName || "Unknown",
          position: entry.player?.position || "Unknown",
          placeOfBirth: entry.player?.placeOfBirth || "Unknown",
          shoots: entry.player?.shoots || "Unknown",
          catches: entry.player?.catches || "Unknown",
          weight: entry.player?.weight?.metrics || "Unknown",
          height: entry.player?.height?.metrics || "Unknown",
          jerseyNumber: entry.jerseyNumber || "N/A",
          dateOfBirth: entry.player?.dateOfBirth || "N/A",
          flagUrl: flagUrl || null, 
          playerRole: entry.playerRole,
          stats: playerStats,
        };
      })
    );

    console.log("Transformed roster data:", JSON.stringify(roster, null, 2));
    return NextResponse.json(roster);
  } catch (error: any) {
    console.error("Error during roster fetch:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred while fetching the roster." },
      { status: 500 }
    );
  }
}
