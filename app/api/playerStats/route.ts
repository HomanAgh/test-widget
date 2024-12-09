import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("Request received:", req.url);

  const { searchParams } = new URL(req.url);
  const playerId = searchParams.get("playerId");
  console.log("Extracted playerId:", playerId);

  if (!playerId) {
    console.error("Player ID is missing in the request.");
    return NextResponse.json({ error: "Player ID is required" }, { status: 400 });
  }

  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL;
  console.log("API Key:", apiKey ? "Provided" : "Missing");
  console.log("API Base URL:", apiBaseUrl ? "Provided" : "Missing");

  if (!apiKey || !apiBaseUrl) {
    console.error("API key or base URL is missing in environment variables.");
    return NextResponse.json(
      { error: "API key or base URL is missing" },
      { status: 500 }
    );
  }

  // Common player fields
  const playerFields = [
    "id",
    "name",
    "playerType",
  ].join(",");
  console.log("Player fields:", playerFields);

  // Skater and goalie-specific fields
  const skaterFields = [
    "latestStats.regularStats.GP",
    "latestStats.regularStats.G",
    "latestStats.regularStats.A",
    "latestStats.regularStats.PTS",
    "latestStats.regularStats.PM",
  ].join(",");
  console.log("Skater fields:", skaterFields);

  const goalieFields = [
    "latestStats.regularStats.GP",
    "latestStats.regularStats.SA",
    "latestStats.regularStats.SVS",
    "latestStats.regularStats.GA",
    "latestStats.regularStats.SVP",
  ].join(",");
  console.log("Goalie fields:", goalieFields);

  const playerUrl = `${apiBaseUrl}/v1/players/${playerId}?apiKey=${apiKey}&fields=${encodeURIComponent(playerFields)}`;
  const skaterStatsUrl = `${apiBaseUrl}/v1/players/${playerId}?apiKey=${apiKey}&fields=${encodeURIComponent(skaterFields)}`;
  const goalieStatsUrl = `${apiBaseUrl}/v1/players/${playerId}?apiKey=${apiKey}&fields=${encodeURIComponent(goalieFields)}`;
  console.log("Player URL:", playerUrl);
  console.log("Skater stats URL:", skaterStatsUrl);
  console.log("Goalie stats URL:", goalieStatsUrl);

  try {
    // Fetch player data
    console.log("Fetching player data...");
    const playerResponse = await fetch(playerUrl, { method: "GET" });
    console.log("Player response status:", playerResponse.status);

    if (!playerResponse.ok) {
      console.error("Failed to fetch player data:", playerResponse.statusText);
      throw new Error(`Player fetch failed: ${playerResponse.statusText}`);
    }

    const playerData = await playerResponse.json();
    console.log("Fetched player data:", playerData);

    const playerType = playerData.data.playerType;
    console.log("Determined player type:", playerType);

    // Determine the URL for stats based on player type
    const statsUrl = playerType === "GOALTENDER" ? goalieStatsUrl : skaterStatsUrl;
    console.log("Stats URL to be used:", statsUrl);

    // Fetch stats data
    console.log("Fetching stats data from:", statsUrl);
    const statsResponse = await fetch(statsUrl, { method: "GET" });
    console.log("Stats response status:", statsResponse.status);

    if (!statsResponse.ok) {
      console.error("Failed to fetch stats data:", statsResponse.statusText);
      throw new Error(`Stats fetch failed: ${statsResponse.statusText}`);
    }

    const statsData = await statsResponse.json();
    console.log("Fetched stats data:", statsData);

    // Build the response data
    console.log("Building response data...");
    const playerInfo = {
      id: playerData.data.id,
      name: playerData.data.name,
      playerType: playerData.data.playerType,
    };
    console.log("Player Info:", playerInfo);

    const stats =
      playerType === "GOALTENDER"
        ? {
            gamesPlayed: statsData.data.latestStats?.regularStats?.GP || 0,
            shotsAgainst: statsData.data.latestStats?.regularStats?.SA || 0,
            saves: statsData.data.latestStats?.regularStats?.SV || 0,
            goalsAgainst: statsData.data.latestStats?.regularStats?.GA || 0,
            savePercentage: statsData.data.latestStats?.regularStats?.SVP || "0%",
          }
        : {
            gamesPlayed: statsData.data.latestStats?.regularStats?.GP || 0,
            goals: statsData.data.latestStats?.regularStats?.G || 0,
            assists: statsData.data.latestStats?.regularStats?.A || 0,
            points: statsData.data.latestStats?.regularStats?.PTS || 0,
            plusMinusRating: statsData.data.latestStats?.regularStats?.PM || 0,
          };
    console.log("Stats:", stats);

    console.log("Returning response...");
    return NextResponse.json({ playerInfo, stats });
  } catch (error: any) {
    console.error("Error during fetch:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred while fetching player data." },
      { status: 500 }
    );
  }
}
