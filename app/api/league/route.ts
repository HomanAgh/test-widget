import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const leagueSlug = searchParams.get("league");

  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!leagueSlug) {
    console.log("Missing leagueSlug query parameter");
    return NextResponse.json(
      { error: "League slug is required" },
      { status: 400 }
    );
  }

  if (!apiKey || !apiBaseUrl) {
    console.log("Missing API key or base URL");
    return NextResponse.json(
      { error: "API key or base URL is missing in environment variables" },
      { status: 500 }
    );
  }

  const leagueField = [
    "team.league.name",
    "team.name",
    "team.links.eliteprospectsUrl",
    "stats.GP",
    "stats.W",
    "stats.L",
    "stats.OTW",
    "stats.OTL",
    "stats.PTS",
    "season.slug",
    "group",
  ].join(",")

  const standingsUrl = `${apiBaseUrl}/leagues/${leagueSlug}/standings?fields=${leagueField}&apiKey=${apiKey}`;
  console.log("Fetching league standings from:", standingsUrl);

  try {
    const response = await fetch(standingsUrl, { method: "GET" });

    console.log("API Response Status:", response.status);
    if (!response.ok) {
      throw new Error(`Failed to fetch standings: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Fetched Data:", JSON.stringify(data, null, 2));

    return NextResponse.json(data); // Return the filtered standings data
  } catch (error: any) {
    console.error("Error during fetch:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred while fetching standings." },
      { status: 500 }
    );
  }
}
