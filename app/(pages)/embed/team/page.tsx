import React from "react";
import Team from "@/app/components/team/Team";
import ClientWrapper from "@/app/components/embed/ClientWrapper";
import { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{
    teamId?: string;
    backgroundColor?: string;
    textColor?: string;
    tableBackgroundColor?: string;
    headerTextColor?: string;
    nameTextColor?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
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
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: `Hockey Team Statistics - Team ID: ${teamId}`,
      description: `View comprehensive hockey statistics for team ID: ${teamId}. Includes team performance, player stats, and season records.`,
      type: 'website',
      locale: 'en_US',
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
            nameTextColor
          }}
        />
      </div>
    </ClientWrapper>
  );
};

export default EmbedTeam;
