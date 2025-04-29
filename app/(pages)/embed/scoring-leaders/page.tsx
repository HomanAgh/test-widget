import React from "react";
import ScoringLeaders from "@/app/components/league/ScoringLeaders";
import ClientWrapper from "@/app/components/embed/ClientWrapper";

interface PageProps {
  searchParams: Promise<{
    leagueSlug?: string;
    season?: string;
    backgroundColor?: string;
    textColor?: string;
    tableBackgroundColor?: string;
    headerTextColor?: string;
    nameTextColor?: string;
    positionFilter?: string;
    nationalityFilter?: string;
    statsType?: string;
  }>;
}

const EmbedScoringLeaders = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const leagueSlug = params.leagueSlug || "";
  const season = params.season || "";
  const backgroundColor = params.backgroundColor || "#052D41";
  const textColor = params.textColor || "#000000";
  const tableBackgroundColor = params.tableBackgroundColor || "#FFFFFF";
  const headerTextColor = params.headerTextColor || "#FFFFFF";
  const nameTextColor = params.nameTextColor || "#0D73A6";
  const positionFilter = params.positionFilter || "all";
  const nationalityFilter = params.nationalityFilter || "all";
  const statsType =
    params.statsType === "postseason" ? "postseason" : "regular";

  if (!leagueSlug) {
    return <div>Missing leagueSlug parameter</div>;
  }

  return (
    <ClientWrapper>
      <div style={{ overflow: "auto" }}>
        <ScoringLeaders
          leagueSlug={leagueSlug}
          season={season}
          customColors={{
            backgroundColor,
            textColor,
            tableBackgroundColor,
            headerTextColor,
            nameTextColor,
          }}
          positionFilter={positionFilter}
          nationalityFilter={nationalityFilter}
          defaultStatsType={statsType as "regular" | "postseason"}
          hideSeasonSelector={true}
          hideStatsTypeSelector={true}
        />
      </div>
    </ClientWrapper>
  );
};

export default EmbedScoringLeaders;
