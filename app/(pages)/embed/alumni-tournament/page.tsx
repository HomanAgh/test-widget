import React from "react";
import AlumniTournament from "@/app/components/alumni/AlumniTournament";
import ClientWrapper from "@/app/components/embed/ClientWrapper";
import { ColumnOptions } from "@/app/components/alumni/ColumnSelector";

interface PageProps {
  searchParams: Promise<{
    tournaments?: string;
    leagues?: string;
    columns?: string;
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
  const columnsStr = params.columns || "";
  const backgroundColor = params.backgroundColor || "#052D41";
  const textColor = params.textColor || "#000000";
  const tableBackgroundColor = params.tableBackgroundColor || "#FFFFFF";
  const headerTextColor = params.headerTextColor || "#FFFFFF";
  const nameTextColor = params.nameTextColor || "#0D73A6";

  const selectedTournaments = tournamentsStr.split(",").filter(Boolean);
  const selectedLeagues = leaguesStr.split(",").filter(Boolean);
  
  // Create the column options from the URL parameters
  const columnsList = columnsStr.split(",").filter(Boolean);
  const defaultColumns: ColumnOptions = {
    name: true, // Name is always included
    birthYear: true,
    draftPick: true,
    tournamentTeam: true,
    tournamentSeason: true,
    juniorTeams: true,
    collegeTeams: true,
    proTeams: true
  };
  
  // If specific columns are provided, use them
  const selectedColumns: ColumnOptions = columnsStr 
    ? {
        // Start with all columns disabled except 'name'
        name: true, 
        birthYear: false,
        draftPick: false,
        tournamentTeam: false,
        tournamentSeason: false,
        juniorTeams: false,
        collegeTeams: false,
        proTeams: false,
        // Then enable the selected columns
        ...Object.fromEntries(columnsList.map(col => [col, true]))
      }
    : defaultColumns;

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
            selectedColumns={selectedColumns}
          />
        )}
      </div>
    </ClientWrapper>
  );
};

export default EmbedTournament;