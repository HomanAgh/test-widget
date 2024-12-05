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

  const teamColorField = [
    "id",
    "name",
    "league.name",
    "country.name",
    "logo.small",
    "logo.medium",
    "logo.large",
    "logo.colors",
  ].join(",")

  const teamUrl = `${apiBaseUrl}/v1/teams/${teamId}?apiKey=${apiKey}&fields=${encodeURIComponent(teamColorField)}`;
  console.log("Fetching team data from URL:", teamUrl);

  try {
    const teamResponse = await fetch(teamUrl, { method: "GET" });
    if (!teamResponse.ok) {
      throw new Error(`Team fetch failed: ${teamResponse.statusText}`);
    }

    const teamData = await teamResponse.json();
    console.log("Fetched Team Data:", teamData);

    if (!teamData || !teamData.data) {
      throw new Error("Invalid API response: Team data is missing.");
    }

    const teamInfo = {
      id: teamData.data?.id || "Unknown ID",
      name: teamData.data?.name || "Unknown Team",
      league: teamData.data?.league?.name || "Unknown League",
      country: teamData.data?.country?.name || "Unknown Country",
      logoS: teamData.data?.logo?.small || null,
      logoM: teamData.data?.logo?.medium || null,
      logoL: teamData.data?.logo?.large || null,
      colors: teamData.data?.logo?.colors || [],
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
