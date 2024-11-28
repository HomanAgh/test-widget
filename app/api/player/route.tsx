import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const playerId = searchParams.get("playerId");

  // Validate playerId query parameter
  if (!playerId) {
    return NextResponse.json(
      { error: "Player ID is required" },
      { status: 400 }
    );
  }

  // Validate environment variables
  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!apiKey || !apiBaseUrl) {
    return NextResponse.json(
      { error: "API key or base URL is missing" },
      { status: 500 }
    );
  }

  // Fields for player information
  const fields = [
    "id",
    "name",
    "firstName",
    "imageUrl",
    "nationality.name",
    "latestStats.team.id",
    "latestStats.team.name",
    "latestStats.league.slug",
    "latestStats.league.name",
    "latestStats.jerseyNumber",
  ].join(",");

  // Fields for game logs
  const fields2 = [
    "game.date",
    "game.dateTime",
    "teamName",
    "opponentName",
    "teamScore",
    "opponentScore",
    "outcome",
    "stats.G",
    "stats.A",
    "stats.PTS",
    "stats.PM",
  ].join(",");

  // Construct API URLs
  const playerUrl = `${apiBaseUrl}/v1/players/${playerId}?apiKey=${apiKey}&fields=${encodeURIComponent(fields)}`;
  const statsUrl = `${apiBaseUrl}/v1/players/${playerId}/game-logs?apiKey=${apiKey}&fields=${encodeURIComponent(fields2)}`;

  console.log("Constructed API URLs:", { playerUrl, statsUrl });

  try {
    // Fetch both player and stats data concurrently
    const [statsResponse, playerResponse] = await Promise.all([
      fetch(statsUrl, { method: "GET" }),
      fetch(playerUrl, { method: "GET" }),
    ]);

    // Check if both responses are successful
    if (!statsResponse.ok || !playerResponse.ok) {
      throw new Error(
        `Failed to fetch data: Stats(${statsResponse.statusText}), Player(${playerResponse.statusText})`
      );
    }

    // Parse the JSON responses
    const statsData = await statsResponse.json();
    const playerData = await playerResponse.json();

    console.log("Fetched Player Data:", playerData);

    // Process the last five games
    const lastFiveGames = statsData.data
      .sort((a: any, b: any) => new Date(b.game.date).getTime() - new Date(a.game.date).getTime())
      .slice(0, 5)
      .map((gameEntry: any) => {
        const stats = gameEntry.stats || {};
        return {
          date: gameEntry.game.date || "Unknown Date",
          teamName: gameEntry.teamName || "Unknown Team",
          opponentName: gameEntry.opponentName || "Unknown Opponent",
          teamScore: gameEntry.teamScore || 0,
          opponentScore: gameEntry.opponentScore || 0,
          outcome: gameEntry.outcome || "N/A",
          goals: stats.G || 0,
          assists: stats.A || 0,
          points: stats.PTS || 0,
          plusMinusRating: stats.PM || 0,
        };
      });

    // Build the player information object
    const playerInfo = {
      id: playerData.data.id,
      name: playerData.data.name,
      firstName: playerData.data.firstName,
      nationality: playerData.data.nationality.name,
      imageUrl: playerData.data.imageUrl || "/default-image.jpg",
      team: playerData.data.latestStats?.team,
      league: playerData.data.latestStats?.league,
      jerseyNumber: playerData.data.latestStats?.jerseyNumber,
    };

    // Return the combined response
    return NextResponse.json({
      playerInfo,
      lastFiveGames,
    });
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during fetch:", error.message);

    // Return an internal server error response
    return NextResponse.json(
      {
        error: "An internal server error occurred while fetching player data. Please try again later.",
      },
      { status: 500 }
    );
  }
}
