import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const playerId = searchParams.get("playerId");

  // Log the incoming request
  console.log("Incoming Request URL:", req.url);
  console.log("Extracted Player ID:", playerId);

  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL;

  // Log the environment variables
  console.log("API Key:", apiKey ? "Present" : "Missing");
  console.log("API Base URL:", apiBaseUrl);

  // Check for missing playerId
  if (!playerId) {
    console.error("Error: Player ID is missing");
    return NextResponse.json(
      { error: "Player ID is required" },
      { status: 400 }
    );
  }

  // Check for missing environment variables
  if (!apiKey || !apiBaseUrl) {
    console.error("Error: API key or base URL is missing");
    return NextResponse.json(
      { error: "API key or base URL is missing" },
      { status: 500 }
    );
  }

  try {
    // Construct the external API URL
    const apiUrl = `${apiBaseUrl}/v1/players/${playerId}?apiKey=${apiKey}`;
    console.log("Constructed API URL:", apiUrl);

    // Fetch data from the external API
    const response = await fetch(apiUrl, { method: "GET" });

    // Log the response status
    console.log("External API Response Status:", response.status);

    // If the response is not OK, log and throw an error
    if (!response.ok) {
      const errorText = await response.text();
      console.error("External API Error Response:", errorText);
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }

    // Parse and log the response data
    const data = await response.json();
    console.log("Fetched Data from External API:", data);

    // Return the response to the client
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    // Log the error message
    console.error("Error during fetch:", err.message);

    // Return a 500 error with a custom message
    return NextResponse.json(
      {
        error: "An internal server error occurred while fetching player data. Please try again later.",
      },
      { status: 500 }
    );
  }
}
