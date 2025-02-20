import { NextResponse } from "next/server";

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Please provide a team name query." }, { status: 400 });
  }

  try {
    const fields = "id,name,league.name,logoUrl";
    const url = `${apiBaseUrl}/teams?q=${encodeURIComponent(query)}&offset=0&limit=30&sort=name&fields=${fields}&apiKey=${apiKey}`;
    
    console.log("Fetching teams from:", url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch teams: ${response.statusText}`);
    }

    const data = await response.json();
    const teams = data.data.map((team: any) => ({
      id: team.id,
      name: team.name,
      league: team.league?.name || "N/A",
      logo: team.logoUrl || null,
    }));

    return NextResponse.json({ teams });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json({ error: "Failed to fetch teams." }, { status: 500 });
  }
}
