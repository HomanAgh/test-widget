import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const leagueSlug = searchParams.get("leagueSlug");

  if (!leagueSlug) {
    return NextResponse.json(
      { error: "League slug is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!apiKey || !apiBaseUrl) {
    return NextResponse.json(
      { error: "API key or base URL is missing in environment variables" },
      { status: 500 }
    );
  }

  try {
    // Generate seasons for the last 100 years
    const currentYear = new Date().getFullYear();
    const seasons = [];
    
    // Generate last 100 seasons
    for (let i = 0; i < 100; i++) {
      const startYear = currentYear - i;
      const endYear = startYear + 1;
      seasons.push(`${startYear}-${endYear}`);
    }

    return NextResponse.json({ seasons });
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
} 