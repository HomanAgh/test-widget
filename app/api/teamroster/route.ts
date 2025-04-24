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

const fetchPlayerStats = async (playerId: string, apiKey: string, apiBaseUrl: string) => {
  try {
    const statsFields = [
      "latestStats.regularStats.GP",
      "latestStats.regularStats.G",
      "latestStats.regularStats.A",
      "latestStats.regularStats.PTS",
    ].join(",");
    
    const response = await fetch(`${apiBaseUrl}/players/${playerId}?apiKey=${apiKey}&fields=${encodeURIComponent(statsFields)}`);
    if (response.ok) {
      const data = await response.json();
      return {
        goals: data.data?.latestStats?.regularStats?.G || 0,
        assists: data.data?.latestStats?.regularStats?.A || 0,
        points: data.data?.latestStats?.regularStats?.PTS || 0
      };
    }
  } catch (err) {
    console.warn(`Failed to fetch stats for player ${playerId}:`, err);
  }
  return { goals: 0, assists: 0, points: 0 };
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId");
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
  
    const rosterUrl = `${apiBaseUrl}/teams/${teamId}/roster?fields=${teamField}&apiKey=${apiKey}`;
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
          ? await fetchPlayerStats(entry.player.id, apiKey, apiBaseUrl)
          : { goals: 0, assists: 0, points: 0 };

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
