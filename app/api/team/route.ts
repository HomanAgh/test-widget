import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId");

  if (!teamId) {
    return NextResponse.json(
      { error: "Team ID is required" },
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

  const teamUrl = `${apiBaseUrl}/v1/teams/${teamId}?apiKey=${apiKey}`;
  
  try {
    const teamResponse = await fetch(teamUrl, { method: "GET" });
    if (!teamResponse.ok) {
      throw new Error(`Team fetch failed: ${teamResponse.statusText}`);
    }

    const teamData = await teamResponse.json();

    // Extract team colors and other details
    const teamInfo = {
      id: teamData.data.id,
      name: teamData.data.name,
      logo: teamData.data.logo?.medium,
      colors: teamData.data.logo?.colors || [],
    };

    return NextResponse.json(teamInfo);
  } catch (error: any) {
    console.error("Error during fetch:", error.message);
    return NextResponse.json(
      { error: "An error occurred while fetching team data." },
      { status: 500 }
    );
  }
}
