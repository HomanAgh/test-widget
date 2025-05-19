import React from "react";
import Alumni from "@/app/components/alumni/Alumni";
import ClientWrapper from "@/app/components/iframe/IframeClientWrapper";

interface PageProps {
  searchParams: Promise<{
    teamIds?: string;
    leagues?: string;
    backgroundColor?: string;
    textColor?: string;
    tableBackgroundColor?: string;
    headerTextColor?: string;
    nameTextColor?: string;
    teams?: string;
  }>;
}

const EmbedAlumni = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const teamIdsStr = params.teamIds || "";
  const leaguesStr = params.leagues || "";
  const backgroundColor = params.backgroundColor || "#FFFFFF";
  const textColor = params.textColor || "#000000";
  const headerTextColor = params.headerTextColor || "#FFFFFF";
  const tableBackgroundColor = params.tableBackgroundColor || "#FFFFFF";
  const nameTextColor = params.nameTextColor || "#0D73A6";
  const youthTeam = params.teams || "";

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
