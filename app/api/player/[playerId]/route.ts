import { NextRequest, NextResponse } from "next/server";

const fetchCountryFlag = async (slug: string, apiKey: string, apiBaseUrl: string) => {
  try {
    const response = await fetch(`${apiBaseUrl}/countries/${slug}?apiKey=${apiKey}`);
    if (response.ok) {
      const countryData = await response.json();
      return countryData.data.flagUrl?.small || null; 
    }
  } catch {
    console.warn(`Failed to fetch flag for ${slug}`);
  }
  return null;
};

const fetchTeamLogo = async (teamId: string, apiKey: string, apiBaseUrl: string) => {
  try {
    const response = await fetch(`${apiBaseUrl}/teams/${teamId}?apiKey=${apiKey}&fields=logo.small`);
    if (response.ok) {
      const teamData = await response.json();
      return teamData.data?.logo?.small || null;
    }
  } catch {
    console.warn(`Failed to fetch logo for team ${teamId}`);
  }
  return null;
};

export async function GET(req: NextRequest, props: { params: Promise<{ playerId: string }> }) {
  const params = await props.params;
  const playerId: string = await params.playerId;

  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5", 10); 

  if (!playerId) {
    return NextResponse.json(
      { error: "Player ID is required" },
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

  const playerInfoField = [
    "id",
    "name",
    "playerType",
    "nationality.slug",
    "secondaryNationality.slug",
    "latestStats.team.id",
    "latestStats.team.name",
    "latestStats.league.slug",
    "latestStats.league.name",
    "latestStats.jerseyNumber",
    "latestStats.teamLogo.small",
    "latestStats.season.slug",
    "weight.metrics",
    "weight.imperial",
    "height.metrics",
    "height.imperial",
    "capHit",
    "age",
    "placeOfBirth",
  ].join(",");

  const gameLogFields = [
    "game.date",
    "game.dateTime",
    "team.id",
    "team.name",
    "opponent.id",
    "opponent.name",
    "gameType",
    "teamScore",
    "opponentScore",
    "stats.G",
    "stats.A",
    "stats.PTS",
    "stats.PM",
    "stats.SA",
    "stats.SV",
    "stats.GA",
    "stats.SVP"
  ].join(",");

  const playerUrl = `${apiBaseUrl}/players/${playerId}?apiKey=${apiKey}&fields=${encodeURIComponent(
    playerInfoField
  )}`;
  const gameLogsUrl = `${apiBaseUrl}/players/${playerId}/game-logs?apiKey=${apiKey}&fields=${encodeURIComponent(
    gameLogFields
  )}&limit=${limit}`;

  try {
    const playerResponse = await fetch(playerUrl, { method: "GET" });
    if (!playerResponse.ok) {
      throw new Error(`Player fetch failed: ${playerResponse.statusText}`);
    }
    const playerData = await playerResponse.json();
    const isGoalie = playerData.data.playerType === "GOALTENDER";

    const gameLogsResponse = await fetch(gameLogsUrl, { method: "GET" });
    if (!gameLogsResponse.ok) {
      throw new Error(`Game logs fetch failed: ${gameLogsResponse.statusText}`);
    }
    const gameLogsData = await gameLogsResponse.json();

    const nationalitySlug = playerData.data.nationality?.slug;
    const secondaryNationalitySlug = playerData.data.secondaryNationality?.slug;
    const [primaryFlagUrl, secondaryFlagUrl] = await Promise.all([
      nationalitySlug ? fetchCountryFlag(nationalitySlug, apiKey, apiBaseUrl) : null,
      secondaryNationalitySlug ? fetchCountryFlag(secondaryNationalitySlug, apiKey, apiBaseUrl) : null,
    ]);

    // Process game logs with team logos
    const lastGames = await Promise.all(gameLogsData.data.map(async (gameEntry: any) => {
      const [homeTeamLogo, awayTeamLogo] = await Promise.all([
        fetchTeamLogo(gameEntry.team.id, apiKey, apiBaseUrl),
        fetchTeamLogo(gameEntry.opponent.id, apiKey, apiBaseUrl)
      ]);

      const stats = gameEntry.stats || {};
      const isHomeGame = gameEntry.gameType === "home";

      return {
        date: gameEntry.game.date || "Unknown Date",
        homeTeam: {
          id: isHomeGame ? gameEntry.team.id : gameEntry.opponent.id,
          name: isHomeGame ? gameEntry.team.name : gameEntry.opponent.name,
          logo: isHomeGame ? homeTeamLogo : awayTeamLogo
        },
        awayTeam: {
          id: isHomeGame ? gameEntry.opponent.id : gameEntry.team.id,
          name: isHomeGame ? gameEntry.opponent.name : gameEntry.team.name,
          logo: isHomeGame ? awayTeamLogo : homeTeamLogo
        },
        score: {
          home: isHomeGame ? gameEntry.teamScore : gameEntry.opponentScore,
          away: isHomeGame ? gameEntry.opponentScore : gameEntry.teamScore
        },
        isHomeGame,
        ...(isGoalie
          ? {
              shotsAgainst: stats.SA || 0,
              saves: stats.SV || 0,
              goalsAgainst: stats.GA || 0,
              savePercentage: stats.SVP || 0,
            }
          : {
              goals: stats.G || 0,
              assists: stats.A || 0,
              points: stats.PTS || 0,
              plusMinusRating: stats.PM || 0,
            }),
      };
    }));

    const playerInfo = {
      id: playerData.data.id,
      name: playerData.data.name,
      playerType: playerData.data.playerType,
      team: playerData.data.latestStats?.team,
      league: playerData.data.latestStats?.league,
      jerseyNumber: playerData.data.latestStats?.jerseyNumber || "",
      weightMet: playerData.data.weight.metrics,
      weightImp: playerData.data.weight.imperial,
      heightMet: playerData.data.height.metrics,
      heightImp: playerData.data.height.imperial,
      capHit: playerData.data.capHit,
      teamLogo: playerData.data.latestStats?.teamLogo || null,
      season: {
        slug: playerData.data.latestStats?.season?.slug || "",
      },      
      age: playerData.data.age,
      placeOfBirth: playerData.data.placeOfBirth,
      flagUrls: {
        primary: primaryFlagUrl,
        secondary: secondaryFlagUrl,
      },
    };

    return NextResponse.json({ playerInfo, lastGames });
  } catch (error: any) {
    console.error("Error during fetch:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred while fetching player data." },
      { status: 500 }
    );
  }
}
