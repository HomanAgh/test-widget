/* import { NextRequest, NextResponse } from "next/server";

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
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query"); // Input team name
  const offset = searchParams.get("offset") || "0";
  const limit = searchParams.get("limit") || "100";
  const sort = searchParams.get("sort") || "player.position";

  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter (team name) is required" },
      { status: 400 }
    );
  }

  if (!apiKey || !apiBaseUrl) {
    return NextResponse.json(
      { error: "API key or base URL is missing" },
      { status: 500 }
    );
  }

  try {
    // Step 1: Fetch team ID based on team name
    const searchUrl = `${apiBaseUrl}/v1/teams?name=${encodeURIComponent(query)}&apiKey=${apiKey}`;
    const searchResponse = await fetch(searchUrl);

    if (!searchResponse.ok) {
      throw new Error(`Failed to search team by name: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    const team = searchData.data?.find((t: any) =>
      t.name.toLowerCase() === query.toLowerCase()
    );

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    const teamId = team.id;

    // Step 2: Fetch roster using the resolved team ID
    const fields = "player.id,player.firstName,player.lastName,player.position,jerseyNumber,player.nationality.name";
    const rosterUrl = `${apiBaseUrl}/v1/teams/${teamId}/roster?fields=${fields}&offset=${offset}&limit=${limit}&sort=${sort}&apiKey=${apiKey}`;

    const rosterResponse = await fetch(rosterUrl);

    if (!rosterResponse.ok) {
      throw new Error(`Failed to fetch roster: ${rosterResponse.statusText}`);
    }

    const rosterData = await rosterResponse.json();

    // Transform the roster data
    const roster = rosterData.data.map((entry: any) => ({
      id: entry.player.id,
      firstName: entry.player.firstName,
      lastName: entry.player.lastName,
      position: entry.player.position,
      jerseyNumber: entry.jerseyNumber,
      nationality: entry.player.nationality.name,
    }));

    return NextResponse.json(roster);
  } catch (error: any) {
    console.error("Error during team roster fetch:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
