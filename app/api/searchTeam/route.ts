import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
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

  // Specify the fields to fetch for teams
  const searchFields = [
    "team.id",
    "team.name",
    "team.league.name",
    "team.country.name",
  ].join(",");

  // Construct the search URL
  const searchUrl = `${apiBaseUrl}/search?q=${encodeURIComponent(query)}&apiKey=${apiKey}&fields=${encodeURIComponent(searchFields)}`;

  try {
    const searchResponse = await fetch(searchUrl, { method: "GET" });
    
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error(`External API error: ${errorText}`);
      return NextResponse.json(
        { error: "Failed to fetch team data." },
        { status: searchResponse.status }
      );
    }
  
    const searchData = await searchResponse.json();
    console.log("API Response:", JSON.stringify(searchData, null, 2));
  
    if (!searchData.data || !searchData.data.team) {
      console.error("No team data found in API response");
      return NextResponse.json({ teams: [] });
    }
  
    const teams = searchData.data.team.map((t: any) => ({
      id: t?.id || "Unknown ID",
      name: t?.name || "Unknown Team",
      league: t?.league?.name || "Unknown League",
      country: t?.country?.name || "Unknown Country",
    }));
  
    return NextResponse.json({ teams });
  } catch (error: any) {
    console.error("Error during API fetch:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
  
}
