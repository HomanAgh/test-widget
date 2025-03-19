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

const EmbedTournamentAlumni = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const tournamentsStr = params.tournaments || "";
  const leaguesStr = params.leagues || "";
  const backgroundColor = params.backgroundColor || "#FFFFFF";
  const textColor = params.textColor || "#000000";
  const headerTextColor = params.headerTextColor || "#FFFFFF";
  const tableBackgroundColor = params.tableBackgroundColor || "#FFFFFF";
  const nameTextColor = params.nameTextColor || "#0D73A6";

  const tournamentSlugs = tournamentsStr
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);

  const selectedLeagues = leaguesStr
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);

  if (!tournamentSlugs.length) {
    return <div>Missing tournaments parameter</div>;
  }

  return (
    <ClientWrapper>
      <div style={{ overflow: "auto" }}>
        <LocalAlumni
          tournamentSlugs={tournamentSlugs}
          selectedLeagues={selectedLeagues}
          customColors={{
            backgroundColor,
            textColor,
            headerTextColor,
            tableBackgroundColor,
            nameTextColor
          }}
        />
      </div>
    </ClientWrapper>
  );
};

export default EmbedTournamentAlumni;