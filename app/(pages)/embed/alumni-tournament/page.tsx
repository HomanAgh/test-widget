import React from "react";
import AlumniTournament from "@/app/components/alumni/AlumniTournament";
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

const EmbedTournament = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const tournamentsStr = params.tournaments || "";
  const leaguesStr = params.leagues || "";
  const backgroundColor = params.backgroundColor || "#052D41";
  const textColor = params.textColor || "#000000";
  const tableBackgroundColor = params.tableBackgroundColor || "#FFFFFF";
  const headerTextColor = params.headerTextColor || "#FFFFFF";
  const nameTextColor = params.nameTextColor || "#0D73A6";

  const selectedTournaments = tournamentsStr.split(",").filter(Boolean);
  const selectedLeagues = leaguesStr.split(",").filter(Boolean);

  return (
    <ClientWrapper>
      <div style={{ overflow: "auto" }}>
        {selectedTournaments.length === 0 || selectedLeagues.length === 0 ? (
          <p className="flex justify-center pt-3 font-montserrat font-semibold">No data available</p>
        ) : (
          <AlumniTournament
            selectedTournaments={selectedTournaments}
            selectedLeagues={selectedLeagues}
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