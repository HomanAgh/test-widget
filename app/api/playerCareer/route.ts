import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const playerId = searchParams.get("playerId");

  if (!playerId) {
    return NextResponse.json({ error: "Player ID is required" }, { status: 400 });
  }

  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!apiKey || !apiBaseUrl) {
    return NextResponse.json(
      { error: "API key or base URL is missing" },
      { status: 500 }
    );
  }

  const playerStatsUrl = `${apiBaseUrl}/players/${playerId}/stats/all-time-league?apiKey=${apiKey}`;

  try {
    // Fetch player stats
    const response = await fetch(playerStatsUrl, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Failed to fetch player stats: ${response.statusText}`);
    }

    const statsData = await response.json();

    // Map the stats to a uniform structure
    const formattedStats = statsData.data.map((entry: any) => {
      const { league, numberOfSeasons, regularStats } = entry;

      // Determine if the entry is for a goalie or a skater
      const isGoalie = regularStats?.GAA !== undefined || regularStats?.SVP !== undefined;

      return {
        league: league?.name || "N/A",
        leagueSlug: league?.slug || "N/A",
        numberOfSeasons: numberOfSeasons || 0,
        role: isGoalie ? "GOALTENDER" : "SKATER",
        stats: isGoalie
          ? {
              gamesPlayed: regularStats?.GP || 0,
              goalsAgainstAverage: regularStats?.GAA || null,
              savePercentage: regularStats?.SVP || null,
              shutouts: regularStats?.SO || 0,
            }
          : {
              gamesPlayed: regularStats?.GP || 0,
              goals: regularStats?.G || 0,
              assists: regularStats?.A || 0,
              points: regularStats?.PTS || 0,
            },
      };
    });

    return NextResponse.json({ stats: formattedStats });
  } catch (error: any) {
    console.error("Error fetching player stats:", error.message);
    return NextResponse.json(
      { error: "An error occurred while fetching player stats." },
      { status: 500 }
    );
  }
}
