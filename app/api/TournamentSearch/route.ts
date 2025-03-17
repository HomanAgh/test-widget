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
      return NextResponse.json({ tournaments: [] });
    }
  
    // Define the league levels you want to search
    const leagueLevels = ["tournament", "midget"];
    
    try {
      // Make separate API calls for each league level
      const tournamentPromises = leagueLevels.map(async (level) => {
        const url = `${apiBaseUrl}/leagues?leagueLevel=${encodeURIComponent(level)}&offset=0&limit=100&sort=name&q=${encodeURIComponent(query)}&fields=id,slug,name,leagueLevel,country,logo,logoUrl,imageUrl&apiKey=${apiKey}`;
        
        console.log(`Fetching ${level} leagues:`, url);
        const response = await fetch(url);
        
        if (!response.ok) {
          console.warn(`Failed to fetch ${level} leagues: ${response.statusText}`);
          return [];
        }
        
        const data = await response.json();
        return data.data || [];
      });
  
      // Wait for all requests to complete
      const results = await Promise.all(tournamentPromises);
      
      // Combine all results into a single array
      const allTournaments = results.flat();
      
      return NextResponse.json({ tournaments: allTournaments });
    } catch (err: any) {
      console.error("TournamentSearch error:", err.message);
      return NextResponse.json(
        { error: "Failed to fetch tournaments." },
        { status: 500 }
      );
    }
  }