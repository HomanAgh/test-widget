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

  const playerStatsUrl = `${apiBaseUrl}/players/${playerId}/stats?apiKey=${apiKey}`;

  try {
    const response = await fetch(playerStatsUrl, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Failed to fetch player stats: ${response.statusText}`);
    }

    const statsData = await response.json();
    const formattedStats = statsData.data.map((entry: any) => {
      const { regularStats, season, team, league } = entry;
      const isGoalie = regularStats?.GAA !== undefined || regularStats?.SVP !== undefined;

      return {
        season: season.slug,
        startYear: season.startYear,
        endYear: season.endYear,
        teamId: team?.id || null,
        teamName: team?.name || "N/A",
        league: league?.name || "N/A",
        role: isGoalie ? "GOALTENDER" : "SKATER",
        stats: isGoalie
          ? {
              gamesPlayed: regularStats?.GP || 0,
              goalsAgainstAverage: regularStats?.GAA || 0,
              savePercentage: regularStats?.SVP || 0,
              shutouts: regularStats?.SO || 0,
            }
          : {
              gamesPlayed: regularStats?.GP || 0,
              goals: regularStats?.G || 0,
              assists: regularStats?.A || 0,
              points: regularStats?.PTS || 0,
              plusMinus: regularStats?.PM || 0,
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
