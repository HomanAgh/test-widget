import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const playerId = searchParams.get("playerId");

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
    "imageUrl",
    "nationality.name",
    "latestStats.team.id",
    "latestStats.team.name",
    "latestStats.league.slug",
    "latestStats.league.name",
    "latestStats.jerseyNumber",
  ].join(",");

  const skaterFields = [
    "game.date",
    "stats.G",
    "stats.A",
    "stats.PTS",
    "stats.PM",
  ].join(",");

  const goalieFields = [
    "game.date",
    "stats.SA",
    "stats.SV",
    "stats.GA",
    "stats.SVP",
  ].join(",");

  const playerUrl = `${apiBaseUrl}/v1/players/${playerId}?apiKey=${apiKey}&fields=${encodeURIComponent(playerInfoField)}`;
  const skaterStatsUrl = `${apiBaseUrl}/v1/players/${playerId}/game-logs?apiKey=${apiKey}&fields=${encodeURIComponent(skaterFields)}`;
  const goalieStatsUrl = `${apiBaseUrl}/v1/players/${playerId}/game-logs?apiKey=${apiKey}&fields=${encodeURIComponent(goalieFields)}`;

  try {
    const playerResponse = await fetch(playerUrl, { method: "GET" });
    if (!playerResponse.ok) {
      throw new Error(`Player fetch failed: ${playerResponse.statusText}`);
    }

    const playerData = await playerResponse.json();

    const isGoalie = playerData.data.playerType === "GOALTENDER";
    const statsUrl = isGoalie ? goalieStatsUrl : skaterStatsUrl;

    const statsResponse = await fetch(statsUrl, { method: "GET" });
    if (!statsResponse.ok) {
      throw new Error(`Stats fetch failed: ${statsResponse.statusText}`);
    }

    const statsData = await statsResponse.json();

    const lastFiveGames = statsData.data
      .sort((a: any, b: any) => new Date(b.game.date).getTime() - new Date(a.game.date).getTime())
      .slice(0, 5)
      .map((gameEntry: any) => {
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

    const playerInfo = {
      id: playerData.data.id,
      name: playerData.data.name,
      playerType: playerData.data.playerType,
      imageUrl: playerData.data.imageUrl || "/default-image.jpg",
      team: playerData.data.latestStats?.team,
      league: playerData.data.latestStats?.league,
      nationality: playerData.data.nationality.name || "Unknown",
      jerseyNumber: playerData.data.latestStats?.jerseyNumber || "Unknown",
    };

    return NextResponse.json({ playerInfo, lastFiveGames });
  } catch (error: any) {
    console.error("Error during fetch:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred while fetching player data." },
      { status: 500 }
    );
  }
}
