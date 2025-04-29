import { NextRequest, NextResponse } from "next/server";

// Helper function to fetch country flag URL
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

export async function GET(req: NextRequest, props: { params: Promise<{ leagueSlug: string }> }) {
  const params = await props.params;
  const leagueSlug: string = await params.leagueSlug;

  const { searchParams } = new URL(req.url);
  const season = searchParams.get("season");
  const position = searchParams.get("position");
  const nationality = searchParams.get("nationality");
  const statsType = searchParams.get("statsType") || "regular"; // 'regular' or 'postseason'

  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!leagueSlug) {
    console.log("Missing leagueSlug param");
    return NextResponse.json(
      { error: "League slug is required in the path" },
      { status: 400 }
    );
  }

  if (!season) {
    console.log("Missing season query parameter");
    return NextResponse.json(
      { error: "Season is required" },
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

  const playerFields = [
    "player.firstName",
    "player.lastName",
    "player.name",
    "player.id",
    "player.nationality.slug",
    "player.nationality.name",
    "player.detailedPosition",
    "player.playerType",
    "team.id",
    "team.name",
    "team.fullName",
    "team.links.eliteprospectsUrl",
    "team.league.name",
    "team.league.slug",
    "team.logo.small",
    "season.slug",
    "season.startYear",
    "season.endYear",
    "regularStats.GP",
    "regularStats.G",
    "regularStats.A",
    "regularStats.PTS",
    "postseasonStats.GP",
    "postseasonStats.G",
    "postseasonStats.A",
    "postseasonStats.PTS"
  ].join(",");

  // Build the API URL with filters - using player-stats to get ALL entries
  let scoringLeadersUrl = `${apiBaseUrl}/player-stats?offset=0&limit=1000&sort=-${statsType === 'postseason' ? 'postseasonStats.PTS' : 'regularStats.PTS'}&league=${leagueSlug}&season=${season}&fields=${playerFields}&apiKey=${apiKey}&player.playerType=SKATER`;

  // Add position filter if specified
  if (position && position !== "all") {
    scoringLeadersUrl += `&player.position=${position}`;
  }

  // Add nationality filter if specified
  if (nationality && nationality !== "all") {
    scoringLeadersUrl += `&player.nationality=${nationality}`;
  }

  console.log("Fetching player stats from:", scoringLeadersUrl);

  try {
    const response = await fetch(scoringLeadersUrl, { method: "GET" });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      throw new Error(`Failed to fetch scoring leaders: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Raw data count:", data.data?.length);
    
    // Check for postseasonStats in the raw data
    const rawPlayoffEntries = data.data?.filter((entry: any) => 
      entry.postseasonStats && 
      (entry.postseasonStats.GP > 0 || entry.postseasonStats.G > 0 || entry.postseasonStats.A > 0)
    );
    console.log("Raw entries with playoff stats:", rawPlayoffEntries?.length);
    if (rawPlayoffEntries?.length > 0) {
      console.log("First 3 playoff entries:", rawPlayoffEntries.slice(0, 3).map((entry: any) => ({
        name: entry.player?.name,
        team: entry.team?.name,
        regularPTS: entry.regularStats?.PTS,
        playoffStats: entry.postseasonStats
      })));
    }
    
    console.log("First 3 raw entries:", data.data?.slice(0, 3).map((entry: any) => ({
      name: entry.player?.name,
      team: entry.team?.name,
      points: entry.regularStats?.PTS,
      type: entry.player?.playerType
    })));

    const filteredData = { ...data };
    delete filteredData._links;
    
    if (filteredData.data && Array.isArray(filteredData.data)) {
      // Create a map to store aggregated stats by player
      const playerStatsMap = new Map();
      
      // First pass: Aggregate stats for each player
      filteredData.data.forEach((entry: any) => {
        const playerId = entry.player?.id;
        if (!playerId || entry.player?.playerType !== 'SKATER') {
          console.log("Skipping entry:", {
            id: playerId,
            type: entry.player?.playerType,
            name: entry.player?.name
          });
          return;
        }

        if (!playerStatsMap.has(playerId)) {
          // First time seeing this player, initialize their stats
          playerStatsMap.set(playerId, {
            player: entry.player,
            teams: [],
            regularStats: {
              GP: 0,
              G: 0,
              A: 0,
              PTS: 0
            },
            postseasonStats: {
              GP: 0,
              G: 0,
              A: 0,
              PTS: 0
            }
          });
        }

        const playerData = playerStatsMap.get(playerId);
        
        // Add team info if not already included
        if (entry.team) {
          const teamExists = playerData.teams.some((t: any) => t.id === entry.team.id);
          if (!teamExists) {
            playerData.teams.push(entry.team);
            console.log(`Added team ${entry.team.name} for player ${entry.player.name}`);
          }
        }

        // Add regular season stats
        if (entry.regularStats) {
          const oldPTS = playerData.regularStats.PTS;
          playerData.regularStats.GP += entry.regularStats.GP || 0;
          playerData.regularStats.G += entry.regularStats.G || 0;
          playerData.regularStats.A += entry.regularStats.A || 0;
          playerData.regularStats.PTS += entry.regularStats.PTS || 0;
          if (playerData.teams.length > 1) {
            console.log(`Updated regular stats for ${entry.player.name}: ${oldPTS} -> ${playerData.regularStats.PTS} (${entry.team.name})`);
          }
        }
        
        // Add post-season stats
        if (entry.postseasonStats) {
          const oldPTS = playerData.postseasonStats.PTS;
          playerData.postseasonStats.GP += entry.postseasonStats.GP || 0;
          playerData.postseasonStats.G += entry.postseasonStats.G || 0;
          playerData.postseasonStats.A += entry.postseasonStats.A || 0;
          playerData.postseasonStats.PTS += entry.postseasonStats.PTS || 0;
          if (playerData.teams.length > 1) {
            console.log(`Updated playoff stats for ${entry.player.name}: ${oldPTS} -> ${playerData.postseasonStats.PTS} (${entry.team.name})`);
          }
        }
      });

      console.log("Players with multiple teams:", Array.from(playerStatsMap.values())
        .filter(p => p.teams.length > 1)
        .map(p => ({
          name: p.player.name,
          teams: p.teams.map((t: any) => t.name),
          regularPTS: p.regularStats.PTS,
          playoffPTS: p.postseasonStats.PTS
        }))
      );

      // Convert map to array and format for response
      filteredData.data = Array.from(playerStatsMap.values())
        .map(player => ({
          player: player.player,
          regularStats: player.regularStats,
          postseasonStats: player.postseasonStats,
          team: player.teams[player.teams.length - 1],
          allTeams: player.teams.map((t: any) => t.name).join(', ')
        }))
        .sort((a, b) => {
          // Sort based on the requested stats type
          if (statsType === 'postseason') {
            return (b.postseasonStats?.PTS || 0) - (a.postseasonStats?.PTS || 0);
          }
          return (b.regularStats?.PTS || 0) - (a.regularStats?.PTS || 0);
        })
        .slice(0, 75);
      
      // Check if any players have playoff stats
      const playersWithPlayoffStats = filteredData.data.filter(
        (player: any) => player.postseasonStats && player.postseasonStats.GP > 0
      );
      console.log("Players with playoff stats:", playersWithPlayoffStats.length);

      // Create a map of unique nationality slugs
      const nationalitySlugs = new Set<string>();
      filteredData.data.forEach((player: any) => {
        if (player.player?.nationality?.slug) {
          nationalitySlugs.add(player.player.nationality.slug);
        }
      });
      
      // Fetch all flag URLs in parallel
      const flagMap = new Map<string, string | null>();
      await Promise.all(
        Array.from(nationalitySlugs).map(async (slug) => {
          const flagUrl = await fetchCountryFlag(slug, apiKey, apiBaseUrl);
          flagMap.set(slug, flagUrl);
        })
      );
      
      // Add flag URLs to player data
      filteredData.data = filteredData.data.map((player: any) => {
        if (player.player?.nationality?.slug) {
          const flagUrl = flagMap.get(player.player.nationality.slug);
          if (flagUrl) {
            player.player.flagUrl = flagUrl;
          }
        }
        return player;
      });
    }
    
    return NextResponse.json(filteredData);
  } catch (error: any) {
    console.error("Error during fetch:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred while fetching scoring leaders." },
      { status: 500 }
    );
  }
} 