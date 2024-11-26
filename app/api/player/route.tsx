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

  const statsUrl = `${apiBaseUrl}/v1/players/${playerId}/game-logs?apiKey=${apiKey}`;
  const playerUrl = `${apiBaseUrl}/v1/players/${playerId}?apiKey=${apiKey}`;
  
  console.log("Constructed API URLs:", statsUrl, playerUrl);
  
  try {
    // Fetch both URLs concurrently
    const [statsResponse, playerResponse] = await Promise.all([
      fetch(statsUrl, { method: "GET" }),
      fetch(playerUrl, { method: "GET" }),
    ]);
  
    // Check if both responses are OK
    if (!statsResponse.ok || !playerResponse.ok) {
      throw new Error(
        `Failed to fetch data: Stats(${statsResponse.statusText}), Player(${playerResponse.statusText})`
      );
    }
  
    // Parse the JSON responses
    const statsData = await statsResponse.json();
    const playerData = await playerResponse.json();
  
    /* console.log("Fetched Stats Data:", statsData); */
    console.log("Fetched Player Data:", playerData);
  
    // Process the data (example)
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
          plusMinusRating: stats.PM || 0, //test kan ta bort sen om det inte funkar
        };
      });

      const playerInfo = {
        name: playerData.data.name || "Unknown Player",
        firstName: playerData.data.firstName || "Unknown First Name",
        biographyAsHTML: playerData.data.biographyAsHTML || "No biography available",
        imageUrl: playerData.data.imageUrl || "No image available",
      }
      
  
    return NextResponse.json({
      playerInfo,
      lastFiveGames,
    });
  } catch (err: any) {
    console.error("Error during fetch:", err.message);
  
    return NextResponse.json(
      {
        error: "An internal server error occurred while fetching player data. Please try again later.",
      },
      { status: 500 }
    );
  }  
}
