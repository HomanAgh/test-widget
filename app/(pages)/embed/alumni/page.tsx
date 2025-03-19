import React from "react";
import Alumni from "@/app/components/alumni/Alumni";
import ClientWrapper from "@/app/components/embed/ClientWrapper";

interface PageProps {
  searchParams: {
    teamIds?: string;
    leagues?: string;
    backgroundColor?: string;
    textColor?: string;
    tableBackgroundColor?: string;
    headerTextColor?: string;
    nameTextColor?: string;
    teams?: string;
  };
}

const EmbedAlumni = async ({ searchParams }: PageProps) => {
  const teamIdsStr = searchParams.teamIds || "";
  const leaguesStr = searchParams.leagues || "";
  const backgroundColor = searchParams.backgroundColor || "#FFFFFF";
  const textColor = searchParams.textColor || "#000000";
  const headerTextColor = searchParams.headerTextColor || "#FFFFFF";
  const tableBackgroundColor = searchParams.tableBackgroundColor || "#FFFFFF";
  const nameTextColor = searchParams.nameTextColor || "#0D73A6";
  const youthTeam = searchParams.teams || "";

  const teamIds = teamIdsStr
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const selectedLeagues = leaguesStr
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);

  const selectedTeams = teamIds.map((id) => ({
    id: parseInt(id, 10) || 0,
    name: youthTeam,
    league: selectedLeagues[0] || "",
  }));

  return (
    <ClientWrapper>
      <div style={{ overflow: "auto" }}>
        <Alumni
          selectedTeams={selectedTeams}
          selectedLeagues={selectedLeagues}
          customColors={{
            backgroundColor,
            textColor,
            headerTextColor,
            tableBackgroundColor,
            nameTextColor
          }}
          includeYouth={true}
        />
      </div>
    </ClientWrapper>
  );
};

export default EmbedAlumni;
