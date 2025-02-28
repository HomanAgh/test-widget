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
    "regularStats.G",
    "regularStats.A",
    "regularStats.PTS",
  ].join(",");

  const scoringLeadersUrl = `${apiBaseUrl}/leagues/${leagueSlug}/scoring-leaders?season=${season}&fields=${playerFields}&apiKey=${apiKey}&sort=-regularStats.PTS&limit=50`;
  console.log("Fetching league scoring leaders from:", scoringLeadersUrl);

  try {
    const response = await fetch(scoringLeadersUrl, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Failed to fetch scoring leaders: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Process player data to add flag URLs
    if (data.data && Array.isArray(data.data)) {
      // Create a map of unique nationality slugs
      const nationalitySlugs = new Set<string>();
      data.data.forEach((player: any) => {
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
      data.data = data.data.map((player: any) => {
        if (player.player?.nationality?.slug) {
          const flagUrl = flagMap.get(player.player.nationality.slug);
          if (flagUrl) {
            player.player.flagUrl = flagUrl;
          }
        }
        return player;
      });
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error during fetch:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred while fetching scoring leaders." },
      { status: 500 }
    );
  }
} 