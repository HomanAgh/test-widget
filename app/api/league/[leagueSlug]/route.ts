import {NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, props: { params: Promise<{ leagueSlug: string }> }) {

  const params = await props.params;
  const leagueSlug: string = await params.leagueSlug;

  const { searchParams } = new URL(req.url);
  const season = searchParams.get("season");

  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!leagueSlug) {
    console.log("Missing leagueSlug param");
    return NextResponse.json(
      { error: "League slug is required in the path" },
      { status: 400 }
    );
  }

  if (!season) {
    console.log("Missing season query parameter");
    return NextResponse.json(
      { error: "Season is required" },
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
    "teamLogo.small",
    "team.league.logo.url",
  ].join(",");

  const standingsUrl = `${apiBaseUrl}/leagues/${leagueSlug}/standings?season=${season}&fields=${leagueField}&apiKey=${apiKey}`;
  console.log("Fetching league standings from:", standingsUrl);

  try {
    const response = await fetch(standingsUrl, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Failed to fetch standings: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error during fetch:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred while fetching standings." },
      { status: 500 }
    );
  }
}
