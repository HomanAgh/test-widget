import React from "react";
import LocalAlumni from "@/app/components/alumni/LocalAlumni";
import ClientWrapper from "@/app/components/embed/ClientWrapper";

interface PageProps {
  searchParams: Promise<{
    tournaments?: string;
    leagues?: string;
    backgroundColor?: string;
    textColor?: string;
    tableBackgroundColor?: string;
    headerTextColor?: string;
    nameTextColor?: string;
  }>;
}

async function getTournamentData(tournaments: string, leagues: string) {
  try {
    // Ensure we have an absolute URL by checking for a protocol
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    
    // If we don't have a base URL with a protocol, we need to construct an absolute URL
    if (!baseUrl || !baseUrl.startsWith('http')) {
      // In server components, we need an absolute URL
      baseUrl = process.env.VERCEL_URL ? 
        `https://${process.env.VERCEL_URL}` : 
        'http://localhost:3000';
    }
    
    const url = `${baseUrl}/api/tournament-alumni?tournaments=${encodeURIComponent(tournaments)}&league=${encodeURIComponent(leagues)}`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return data.players || [];
  } catch (err) {
    console.error("Tournament fetch error:", err);
    return [];
  }
}

const EmbedTournament = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const tournamentsStr = params.tournaments || "";
  const leaguesStr = params.leagues || "";
  const backgroundColor = params.backgroundColor || "#052D41";
  const textColor = params.textColor || "#000000";
  const tableBackgroundColor = params.tableBackgroundColor || "#FFFFFF";
  const headerTextColor = params.headerTextColor || "#FFFFFF";
  const nameTextColor = params.nameTextColor || "#0D73A6";

  let finalPlayers = [];
  if (tournamentsStr && leaguesStr) {
    finalPlayers = await getTournamentData(tournamentsStr, leaguesStr);
  }

  return (
    <ClientWrapper>
      <div style={{ overflow: "auto" }}>
        {finalPlayers.length === 0 ? (
          <p className="flex justify-center pt-3 font-montserrat font-semibold">No data available</p>
        ) : (
          <LocalAlumni 
            players={finalPlayers} 
            customColors={{
              backgroundColor,
              textColor,
              tableBackgroundColor,
              headerTextColor,
              nameTextColor,
            }} 
          />
        )}
      </div>
    </ClientWrapper>
  );
};

export default EmbedTournament;