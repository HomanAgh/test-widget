import { NextRequest, NextResponse } from "next/server";

const fetchCountryFlag = async (slug: string, apiKey: string, apiBaseUrl: string) => {
  try {
    const response = await fetch(`${apiBaseUrl}/countries/${slug}?apiKey=${apiKey}`);
    if (response.ok) {
      const countryData = await response.json();
      return countryData.data.flagUrl?.small || null; // Return the small flag URL
    }
  } catch {
    console.warn(`Failed to fetch flag for ${slug}`);
  }
  return null;
};


export async function GET(req: NextRequest, props: { params: Promise<{ playerId: string }> }) {
  const params = await props.params;
  const playerId: string = await params.playerId;

  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5", 10); // Default limit to 5

  if (!playerId) {
    return NextResponse.json(
      { error: "Player ID is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!apiKey || !apiBaseUrl) {
    return NextResponse.json(
      { error: "API key or base URL is missing" },
      { status: 500 }
    );
  }

  const playerInfoField = [
    "id",
    "name",
    "playerType",
    "nationality.slug",
    "secondaryNationality.slug",
    "latestStats.team.id",
    "latestStats.team.name",
    "latestStats.league.slug",
    "latestStats.league.name",
    "latestStats.jerseyNumber",
  ].join(",");

  const skaterFields = ["game.date", "stats.G", "stats.A", "stats.PTS", "stats.PM"].join(",");
  const goalieFields = ["game.date", "stats.SA", "stats.SV", "stats.GA", "stats.SVP"].join(",");

  const playerUrl = `${apiBaseUrl}/players/${playerId}?apiKey=${apiKey}&fields=${encodeURIComponent(
    playerInfoField
  )}`;
  const skaterStatsUrl = `${apiBaseUrl}/players/${playerId}/game-logs?apiKey=${apiKey}&fields=${encodeURIComponent(
    skaterFields
  )}&limit=${limit}`;
  const goalieStatsUrl = `${apiBaseUrl}/players/${playerId}/game-logs?apiKey=${apiKey}&fields=${encodeURIComponent(
    goalieFields
  )}&limit=${limit}`;

  try {
    // Fetch player info
    const playerResponse = await fetch(playerUrl, { method: "GET" });
    if (!playerResponse.ok) {
      throw new Error(`Player fetch failed: ${playerResponse.statusText}`);
    }
    const playerData = await playerResponse.json();

    // Determine if the player is a goalie
    const isGoalie = playerData.data.playerType === "GOALTENDER";
    const statsUrl = isGoalie ? goalieStatsUrl : skaterStatsUrl;

    // Fetch game logs with dynamic limit
    const statsResponse = await fetch(statsUrl, { method: "GET" });
    if (!statsResponse.ok) {
      throw new Error(`Stats fetch failed: ${statsResponse.statusText}`);
    }
    const statsData = await statsResponse.json();

    // Fetch country flags using nationality.slug and secondaryNationality.slug
    const nationalitySlug = playerData.data.nationality?.slug;
    const secondaryNationalitySlug = playerData.data.secondaryNationality?.slug;

    const [primaryFlagUrl, secondaryFlagUrl] = await Promise.all([
      nationalitySlug ? fetchCountryFlag(nationalitySlug, apiKey, apiBaseUrl) : null,
      secondaryNationalitySlug ? fetchCountryFlag(secondaryNationalitySlug, apiKey, apiBaseUrl) : null,
    ]);

    // Map stats data
    const lastGames = statsData.data.map((gameEntry: any) => {
      const stats = gameEntry.stats || {};
      if (isGoalie) {
        return {
          date: gameEntry.game.date || "Unknown Date",
          shotsAgainst: stats.SA || 0,
          saves: stats.SV || 0,
          goalsAgainst: stats.GA || 0,
          savePercentage: stats.SVP || 0,
        };
      } else {
        return {
          date: gameEntry.game.date || "Unknown Date",
          goals: stats.G || 0,
          assists: stats.A || 0,
          points: stats.PTS || 0,
          plusMinusRating: stats.PM || 0,
        };
      }
    });

    // Construct player info
    const playerInfo = {
      id: playerData.data.id,
      name: playerData.data.name,
      playerType: playerData.data.playerType,
      team: playerData.data.latestStats?.team,
      league: playerData.data.latestStats?.league,
      jerseyNumber: playerData.data.latestStats?.jerseyNumber || "Unknown",
      flagUrls: {
        primary: primaryFlagUrl,
        secondary: secondaryFlagUrl,
      },
    };

    return NextResponse.json({ playerInfo, lastGames });
  } catch (error: any) {
    console.error("Error during fetch:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred while fetching player data." },
      { status: 500 }
    );
  }
}
