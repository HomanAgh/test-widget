import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamID");
  const offset = searchParams.get("offset") || "0"; // Default to 0
  const limit = searchParams.get("limit") || "100"; // Default to 100
  const sort = searchParams.get("sort") || "player.position"; // Default sort

  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL;

  // Validate the team ID
  if (!teamId) {
    console.log("Missing teamId query parameter");
    return NextResponse.json(
      { error: "Team ID is required" },
      { status: 400 }
    );
  }

  // Validate API credentials
  if (!apiKey || !apiBaseUrl) {
    console.log("Missing API key or base URL");
    return NextResponse.json(
      { error: "API key or base URL is missing in environment variables" },
      { status: 500 }
    );
  }

  // Include fields to limit the payload
  const fields = "player.id,player.firstName,player.lastName,player.position,jerseyNumber,player.nationality.name";
  const rosterUrl = `${apiBaseUrl}/v1/teams/${teamId}/roster?fields=${fields}&offset=${offset}&limit=${limit}&sort=${sort}&apiKey=${apiKey}`;

  console.log("Fetching team roster from:", rosterUrl);

  try {
    const response = await fetch(rosterUrl, { method: "GET" });

    // Check response status
    console.log("API Response Status:", response.status);
    if (!response.ok) {
      throw new Error(`Failed to fetch roster: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Fetched Data:", JSON.stringify(data, null, 2));

    // Transform the data for frontend use
    const roster = data.data.map((entry: any) => ({
      id: entry.player.id, // Nested inside "player"
      firstName: entry.player.firstName, // Nested inside "player"
      lastName: entry.player.lastName, // Nested inside "player"
      position: entry.player.position, // Nested inside "player"
      jerseyNumber: entry.jerseyNumber, // Top level
      nationality: entry.player.nationality.name, // Nested inside "player"
    }));

    return NextResponse.json(roster);
  } catch (error: any) {
    console.error("Error during fetch:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred while fetching the roster." },
      { status: 500 }
    );
  }
}

