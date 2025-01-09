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
      "league.slug",
      "league.name",
      "league.country.name",
    ].join(",");
  
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
  
      if (!searchData.data || !searchData.data.league) {
        return NextResponse.json({ leagues: [] });
      }
  
      const leagues = await Promise.all(
        searchData.data.league.map(async (l: any) => {
          const slug = l?.slug || "Unknown Slug";
  
          const leagueDetailsUrl = `${apiBaseUrl}/leagues/${slug}?apiKey=${apiKey}`;
          try {
            const leagueDetailsResponse = await fetch(leagueDetailsUrl, { method: "GET" });
            const leagueDetails = await leagueDetailsResponse.json();
  
            return {
              slug,
              name: l?.name || "Unknown Name",
              country: l?.name === "NHL" ? "North Americas" : l?.country?.name || "Unknown Country",
              fullName: leagueDetails.data?.fullName || "Unknown Full Name",
            };
          } catch {
            return {
              slug,
              name: l?.name || "Unknown Name",
              country: l?.name === "NHL" ? "North America" : l?.country?.name || "Unknown Country",
              fullName: "Full name not available",
            };
          }
        })
      );
  
      return NextResponse.json({ leagues });
    } catch (error : any) {
        console.error("Error during search fetch:", error.message);
      return NextResponse.json(
        { message: "An internal server error occurred." },
        { status: 500 }
      );
    }
  }
  
  