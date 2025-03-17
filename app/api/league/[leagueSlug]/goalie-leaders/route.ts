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
    "regularStats.SVS"
  ].join(",");

  const goalieLeadersUrl = `${apiBaseUrl}/player-stats?offset=0&limit=75&sort=-regularStats.SVP&league=${leagueSlug}&season=${season}&player.playerType=GOALTENDER&fields=${playerFields}&apiKey=${apiKey}`;
  console.log("Fetching goalie leaders from:", goalieLeadersUrl);

  try {
    const response = await fetch(goalieLeadersUrl, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Failed to fetch goalie leaders: ${response.statusText}`);
    }

    const data = await response.json();
    // Remove _links from the response without creating any variables
    const filteredData = { ...data };
    delete filteredData._links;
    
    // Process player data to add flag URLs and filter goalies with more than 10 games
    if (filteredData.data && Array.isArray(filteredData.data)) {
      // Filter goalies with more than 10 games played
      filteredData.data = filteredData.data.filter((player: any) => 
        player.regularStats?.GP && player.regularStats.GP >= 10
      );
      
      // Limit to 75 goalies
      filteredData.data = filteredData.data.slice(0, 75);
      
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
