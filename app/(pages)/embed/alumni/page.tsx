import React from "react";
import Alumni from "@/app/components/alumni/Alumni";
import ClientWrapper from "@/app/components/iframe/IframeClientWrapper";

interface PageProps {
  searchParams: Promise<{
    teamIds?: string;
    leagues?: string;
    status?: string;
    backgroundColor?: string;
    textColor?: string;
    tableBackgroundColor?: string;
    headerTextColor?: string;
    nameTextColor?: string;
    teams?: string;
    isPaginationEnabled?: string;
  }>;
}

const EmbedAlumni = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const teamIdsStr = params.teamIds || "";
  const leaguesStr = params.leagues || "";
  const statusStr = params.status || "";
  const backgroundColor = params.backgroundColor || "#FFFFFF";
  const textColor = params.textColor || "#000000";
  const headerTextColor = params.headerTextColor || "#FFFFFF";
  const tableBackgroundColor = params.tableBackgroundColor || "#FFFFFF";
  const nameTextColor = params.nameTextColor || "#0D73A6";
  const youthTeam = params.teams || "";
  const isPaginationEnabled = params.isPaginationEnabled !== "false";

  const teamIds = teamIdsStr
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const selectedLeagues = leaguesStr
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);

  const selectedStatus = statusStr
    .split(",")
    .map((s) => s.trim())
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
          selectedStatus={selectedStatus}
          customColors={{
            backgroundColor,
            textColor,
            headerTextColor,
            tableBackgroundColor,
            nameTextColor
          }}
          includeYouth={true}
          isPaginationEnabled={isPaginationEnabled}
        />
      </div>
    </ClientWrapper>
  );
};

export default EmbedAlumni;
