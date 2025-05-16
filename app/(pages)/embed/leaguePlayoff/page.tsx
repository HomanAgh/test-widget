import React from "react";
import LeaguePlayoff from "@/app/components/leaguePlayoff/LeaguePlayoff";
import ClientWrapper from "@/app/components/iframe/IframeClientWrapper";

interface PageProps {
  searchParams: Promise<{
    leagueId?: string;
    season?: string;
    backgroundColor?: string;
    textColor?: string;
    tableBackgroundColor?: string;
    headerTextColor?: string;
    nameTextColor?: string;
  }>;
}

const EmbedLeaguePlayoff = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const leagueId = params.leagueId || "";
  const season = params.season || "";
  const backgroundColor = params.backgroundColor || "#FFFFFF";
  const textColor = params.textColor || "#000000";
  const tableBackgroundColor = params.tableBackgroundColor || "#FFFFFF";
  const headerTextColor = params.headerTextColor || "#FFFFFF";
  const nameTextColor = params.nameTextColor || "#0D73A6";

  if (!leagueId) {
    return <div>Missing leagueId parameter</div>;
  }

  return (
    <ClientWrapper>
      <div style={{ overflow: "auto" }}>
        <LeaguePlayoff
          leagueId={leagueId}
          season={season}
          customColors={{
            backgroundColor,
            textColor,
            tableBackgroundColor,
            headerTextColor,
            nameTextColor
          }}
          hideSeasonSelector={true}
        />
      </div>
    </ClientWrapper>
  );
};

export default EmbedLeaguePlayoff;
