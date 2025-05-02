import React from "react";
import Team from "@/app/components/team/Team";
import ClientWrapper from "@/app/components/embed/ClientWrapper";
import { Metadata } from "next";
import {
  TeamColumnOptions,
  DEFAULT_COLUMNS,
} from "@/app/components/team/TeamColumnDefinitions";

interface PageProps {
  searchParams: Promise<{
    teamId?: string;
    backgroundColor?: string;
    textColor?: string;
    tableBackgroundColor?: string;
    headerTextColor?: string;
    nameTextColor?: string;
    columns?: string;
    selectedColumns?: string;
    statsType?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const teamId = params.teamId || "";

  return {
    title: `Hockey Team Statistics - Team ID: ${teamId}`,
    description: `View comprehensive hockey statistics for team ID: ${teamId}. Includes team performance, player stats, and season records.`,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: `Hockey Team Statistics - Team ID: ${teamId}`,
      description: `View comprehensive hockey statistics for team ID: ${teamId}. Includes team performance, player stats, and season records.`,
      type: "website",
      locale: "en_US",
    },
  };
}

const EmbedTeam = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const teamId = params.teamId || "";
  const backgroundColor = params.backgroundColor || "#052D41";
  const textColor = params.textColor || "#000000";
  const tableBackgroundColor = params.tableBackgroundColor || "#FFFFFF";
  const headerTextColor = params.headerTextColor || "#FFFFFF";
  const nameTextColor = params.nameTextColor || "#0D73A6";
  const statsType =
    params.statsType === "postseason" ? "postseason" : "regular";

  // Parse columns parameter
  const selectedColumns: TeamColumnOptions = { ...DEFAULT_COLUMNS };

  if (params.selectedColumns) {
    // Try to parse the JSON selected columns
    try {
      const parsedColumns = JSON.parse(params.selectedColumns);

      // Apply the parsed columns, ensuring 'name' is always true
      Object.keys(selectedColumns).forEach((key) => {
        if (key in parsedColumns) {
          selectedColumns[key as keyof TeamColumnOptions] =
            key === "name" ? true : parsedColumns[key];
        } else if (key !== "name") {
          selectedColumns[key as keyof TeamColumnOptions] = false;
        }
      });
    } catch (error) {
      console.error("Error parsing selectedColumns:", error);
    }
  } else if (params.columns) {
    // Reset all columns to false first
    Object.keys(selectedColumns).forEach((key) => {
      if (key !== "name") {
        // Name is always true
        selectedColumns[key as keyof TeamColumnOptions] = false;
      }
    });

    // Enable only the selected columns
    const enabledColumns = params.columns.split(",");
    enabledColumns.forEach((col) => {
      if (col in selectedColumns) {
        selectedColumns[col as keyof TeamColumnOptions] = true;
      }
    });
  }

  if (!teamId) {
    return <div>Missing team ID</div>;
  }

  return (
    <ClientWrapper>
      <div style={{ overflow: "auto" }}>
        <Team
          teamId={teamId}
          customColors={{
            backgroundColor,
            textColor,
            tableBackgroundColor,
            headerTextColor,
            nameTextColor,
          }}
          selectedColumns={selectedColumns}
          hideStatsTypeSelector={true}
          defaultStatsType={statsType as "regular" | "postseason"}
        />
      </div>
    </ClientWrapper>
  );
};

export default EmbedTeam;
