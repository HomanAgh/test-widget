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
  const nationality = searchParams.get("nationality");
  // Keep statsType parameter for sorting only, but always fetch both regular and playoff stats
  const statsType = searchParams.get("statsType") === "postseason" ? "postseason" : "regular";

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
    "regularStats.GAA",
    "regularStats.SVP",
    "regularStats.SO",
    "regularStats.W",
    "regularStats.L",
    "regularStats.T",
    "regularStats.TOI",
    "regularStats.SA",
    "regularStats.GA",
    "regularStats.SVS",
    "postseasonStats.GP",
    "postseasonStats.GAA",
    "postseasonStats.SVP",
    "postseasonStats.SO",
    "postseasonStats.W",
    "postseasonStats.L",
    "postseasonStats.T",
    "postseasonStats.TOI",
    "postseasonStats.SA",
    "postseasonStats.GA",
    "postseasonStats.SVS"
  ].join(",");

  // Sort by regular season SVP by default to get all goalies
  const statsSortField = "-regularStats.SVP";
  let goalieLeadersUrl = `${apiBaseUrl}/player-stats?offset=0&limit=100&sort=${statsSortField}&league=${leagueSlug}&season=${season}&player.playerType=GOALTENDER&fields=${playerFields}&apiKey=${apiKey}`;

  // Add nationality filter if specified
  if (nationality && nationality !== "all") {
    goalieLeadersUrl += `&player.nationality=${nationality}`;
  }

  console.log(`Fetching goalie leaders for both regular and playoff stats:`, goalieLeadersUrl);

  try {
    const response = await fetch(goalieLeadersUrl, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Failed to fetch goalie leaders: ${response.statusText}`);
    }

    const data = await response.json();
    // Remove _links from the response without creating any variables
    const filteredData = { ...data };
    delete filteredData._links;
    
    // Process player data to add flag URLs and prepare for display
    if (filteredData.data && Array.isArray(filteredData.data)) {
      // Collect all goalies that have enough games in either regular or postseason
      const qualifiedGoalies = filteredData.data.filter((player: any) => {
        const regularGamesPlayed = player.regularStats?.GP || 0;
        const playoffGamesPlayed = player.postseasonStats?.GP || 0;
        
        return regularGamesPlayed >= 10 || playoffGamesPlayed >= 3;
      });
      
      // Sort based on the requested stats type
      qualifiedGoalies.sort((a: any, b: any) => {
        if (statsType === "postseason") {
          return (b.postseasonStats?.SVP || 0) - (a.postseasonStats?.SVP || 0);
        }
        return (b.regularStats?.SVP || 0) - (a.regularStats?.SVP || 0);
      });
      
      // Limit to 75 goalies
      filteredData.data = qualifiedGoalies.slice(0, 75);
      
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
      { error: "An internal server error occurred while fetching goalie leaders." },
      { status: 500 }
    );
  }
}
