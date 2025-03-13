import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim() || "";

  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!apiKey || !apiBaseUrl) {
    return NextResponse.json(
      { error: "Missing API key or base URL" },
      { status: 500 }
    );
  }

  if (!query) {
    // If no query, you could either return all tournaments or just an empty array
    return NextResponse.json({ tournaments: [] });
  }

  // This endpoint might differ depending on how partial matching is supported by EliteProspects.
  // If ?q= works for partial matching, use it:
  // e.g. `/leagues?leagueLevel=tournament&q=${query}`
  // Otherwise, you might need to fetch all tournaments and filter locally.
  
  const url = `${apiBaseUrl}/leagues?leagueLevel=tournament&offset=0&limit=100&sort=name&q=${encodeURIComponent(
    query
  )}&fields=id,slug,name,leagueLevel,country,logo,logoUrl,imageUrl&apiKey=${apiKey}`;

  console.log("URL:", url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch tournaments: ${response.statusText}`);
    }
    const data = await response.json();
    // data.data should contain an array of leagues with leagueLevel = "tournament"
    return NextResponse.json({ tournaments: data.data || [] });
  } catch (err: any) {
    console.error("TournamentSearch error:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch tournaments." },
      { status: 500 }
    );
  }
}
