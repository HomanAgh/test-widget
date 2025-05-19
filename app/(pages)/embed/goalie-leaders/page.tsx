import React from "react";
import GoalieLeaders from "@/app/components/league/GoalieLeaders";
import ClientWrapper from "@/app/components/iframe/IframeClientWrapper";

interface PageProps {
  searchParams: Promise<{
    leagueSlug?: string;
    season?: string;
    backgroundColor?: string;
    textColor?: string;
    tableBackgroundColor?: string;
    headerTextColor?: string;
    nameTextColor?: string;
    nationality?: string;
    statsType?: string;
  }>;
}

const EmbedGoalieLeaders = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const {
    leagueSlug,
    season = "2024-2025",
    backgroundColor = "#052D41",
    textColor = "#000000",
    tableBackgroundColor = "#FFFFFF",
    headerTextColor = "#FFFFFF",
    nameTextColor = "#0D73A6",
    nationality = "all",
  } = params;

  const statsType =
    params.statsType === "postseason" ? "postseason" : "regular";

  if (!leagueSlug) {
    return <div>Error: League slug is required</div>;
  }

  return (
    <ClientWrapper>
      <div style={{ overflow: "auto" }}>
        <GoalieLeaders
          leagueSlug={leagueSlug}
          season={season}
          customColors={{
            backgroundColor,
            textColor,
            tableBackgroundColor,
            headerTextColor,
            nameTextColor,
          }}
          hideSeasonSelector={true}
          hideStatsTypeSelector={true}
          nationalityFilter={nationality}
          defaultStatsType={statsType as "regular" | "postseason"}
        />
      </div>
    </ClientWrapper>
  );
};

export default EmbedGoalieLeaders;
