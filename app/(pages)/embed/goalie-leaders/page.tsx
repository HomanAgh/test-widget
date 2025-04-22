import React from "react";
import GoalieLeaders from "@/app/components/league/GoalieLeaders";
import ClientWrapper from "@/app/components/embed/ClientWrapper";

interface PageProps {
  searchParams: {
    leagueSlug?: string;
    season?: string;
    backgroundColor?: string;
    textColor?: string;
    tableBackgroundColor?: string;
    headerTextColor?: string;
    nameTextColor?: string;
    nationality?: string;
  };
}

const EmbedGoalieLeaders = async ({ searchParams }: PageProps) => {
  const {
    leagueSlug,
    season = "2024-2025",
    backgroundColor = "#052D41",
    textColor = "#000000",
    tableBackgroundColor = "#FFFFFF",
    headerTextColor = "#FFFFFF",
    nameTextColor = "#0D73A6",
    nationality = "all",
  } = searchParams;

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
          nationalityFilter={nationality}
        />
      </div>
    </ClientWrapper>
  );
};

export default EmbedGoalieLeaders;
