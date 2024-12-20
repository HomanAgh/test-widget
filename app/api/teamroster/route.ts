import { NextRequest, NextResponse } from "next/server";

// Helper function to fetch the flag URL based on nationality slug
const fetchCountryFlag = async (slug: string, apiKey: string, apiBaseUrl: string) => {
  try {
    const response = await fetch(`${apiBaseUrl}/countries/${slug}?apiKey=${apiKey}`);
    if (response.ok) {
      const countryData = await response.json();
      return countryData.data.flagUrl?.small || null; // Return the small flag URL
    }
  } catch {
    console.warn(`Failed to fetch flag for ${slug}`);
  }
  return null;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId");

  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL;

  // Validate teamId
  if (!teamId) {
    console.log("Missing teamId query parameter");
    return NextResponse.json(
      { error: "Team ID is required" },
      { status: 400 }
    );
  }

  // Validate environment variables
  if (!apiKey || !apiBaseUrl) {
    console.log("Missing API key or base URL");
    return NextResponse.json(
      { error: "API key or base URL is missing in environment variables" },
      { status: 500 }
    );
  }

  try {
    // Update the roster fetch URL to include nationality slug and dateOfBirth
    const fields = "player.id,player.firstName,player.lastName,player.position,jerseyNumber,player.nationality.slug,player.dateOfBirth";
    const rosterUrl = `${apiBaseUrl}/teams/${teamId}/roster?fields=${fields}&apiKey=${apiKey}`;
    console.log("Fetching roster from URL:", rosterUrl);

    const response = await fetch(rosterUrl);

    // Check response status
    console.log("Roster API Response Status:", response.status);
    if (!response.ok) {
      throw new Error(`Failed to fetch roster: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Fetched Roster Data:", data);

    if (!data.data || data.data.length === 0) {
      return NextResponse.json(
        { error: "No roster data available for the team." },
        { status: 404 }
      );
    }

    // Transform roster data with flagUrl and dateOfBirth
    const roster = await Promise.all(
      data.data.map(async (entry: any) => {
        const flagUrl = entry.player?.nationality?.slug
          ? await fetchCountryFlag(entry.player.nationality.slug, apiKey, apiBaseUrl)
          : null;

        return {
          id: entry.player?.id || "Unknown ID",
          firstName: entry.player?.firstName || "Unknown",
          lastName: entry.player?.lastName || "Unknown",
          position: entry.player?.position || "Unknown",
          jerseyNumber: entry.jerseyNumber || "N/A",
          dateOfBirth: entry.player?.dateOfBirth || "N/A",
          flagUrl: flagUrl || null, // Add fetched flag URL
        };
      })
    );

    console.log("Transformed roster data:", JSON.stringify(roster, null, 2));
    return NextResponse.json(roster);
  } catch (error: any) {
    console.error("Error during roster fetch:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred while fetching the roster." },
      { status: 500 }
    );
  }
}
