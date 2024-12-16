import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId");

  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL;

  // Validate teamId
  if (!teamId) {
    console.log("Missing teamId query parameter");
    return NextResponse.json(
      { error: "Team ID is required" },
      { status: 400 }
    );
  }

  // Validate environment variables
  if (!apiKey || !apiBaseUrl) {
    console.log("Missing API key or base URL");
    return NextResponse.json(
      { error: "API key or base URL is missing in environment variables" },
      { status: 500 }
    );
  }

  try {
    // Construct the roster fetch URL
    const fields = "player.id,player.firstName,player.lastName,player.position,jerseyNumber,player.nationality.name";
    const rosterUrl = `${apiBaseUrl}/teams/${teamId}/roster?fields=${fields}&apiKey=${apiKey}`;
    console.log("Fetching roster from URL:", rosterUrl);

    const response = await fetch(rosterUrl);

    // Check response status
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
    

    // Transform roster data
    const roster = data.data.map((entry: any) => ({
      id: entry.player?.id || "Unknown ID",
      firstName: entry.player?.firstName || "Unknown",
      lastName: entry.player?.lastName || "Unknown",
      position: entry.player?.position || "Unknown",
      jerseyNumber: entry.jerseyNumber || "N/A",
      nationality: entry.player?.nationality?.name || "Unknown",
    }));
    console.log("Raw roster data:", JSON.stringify(data.data, null, 2));
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
