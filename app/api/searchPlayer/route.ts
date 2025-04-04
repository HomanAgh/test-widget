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


  const searchFields = [
    "player.id",
    "player.name",
    "player.latestStats.team.name",
    "player.latestStats.league.name",
    "player.views",
  ].join(",");

  const searchUrl = `${apiBaseUrl}/search?q=${encodeURIComponent(query)}&apiKey=${apiKey}&fields=${encodeURIComponent(searchFields)}`;

  try {
    const searchResponse = await fetch(searchUrl, { method: "GET" });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error(`External API error: ${errorText}`);
      return NextResponse.json(
        { error: `Search failed: ${searchResponse.statusText}` },
        { status: searchResponse.status }
      );
    }

    const searchData = await searchResponse.json();
    console.log("External API Response:", searchData);
    const players = searchData.data?.player
      ?.map((p: any) => ({
        id: p.id,
        name: p.name || "Unknown",
        league: p.latestStats?.league?.name || "Unknown League",
        team: p.latestStats?.team?.name || "Unknown Team",
        views: p.views || 0, 
      }))
      .sort((a: any, b: any) => b.views - a.views) 
      .slice(0, 20) || []; 

    console.log("Parsed Players:", players);

    return NextResponse.json({ players });
  } catch (error: any) {
    console.error("Error during search fetch:", error.message);
    return NextResponse.json(
      { error: "An error occurred during the search." },
      { status: 500 }
    );
  }
}

  
  