import React from "react";
import Player from "../../../components/player/Player";
import ClientWrapper from "@/app/components/embed/ClientWrapper";

interface PageProps {
  searchParams: Promise<{
    playerId?: string;
    gameLimit?: string;
    backgroundColor?: string;
    textColor?: string;
    tableBackgroundColor?: string;
    headerTextColor?: string;
    nameTextColor?: string;
    viewMode?: string;
    showSummary?: string;
  }>;
}

const EmbedPlayer = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const playerId = params.playerId || "";
  const gameLimit = parseInt(params.gameLimit || "5", 10);
  const backgroundColor = params.backgroundColor || "#052D41";
  const textColor = params.textColor || "#000000";
  const tableBackgroundColor = params.tableBackgroundColor || "#FFFFFF";
  const headerTextColor = params.headerTextColor || "#FFFFFF";
  const nameTextColor = params.nameTextColor || "#0D73A6";

  const viewModeParam = params.viewMode;
  const viewMode =
    viewModeParam === "seasons" ||
    viewModeParam === "games" ||
    viewModeParam === "career" ||
    viewModeParam === "stats"
      ? viewModeParam
      : "stats";

  const showSummary = params.showSummary === "true";

  if (!playerId) {
    return <div>Missing player ID</div>;
  }

  return (
    <ClientWrapper>
      <div className="max-w-[768px] mx-auto px-0" style={{ background: "none" }}>
        <Player
          playerId={playerId}    
          gameLimit={gameLimit}
          viewMode={viewMode}
          showSummary={showSummary}
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

export default EmbedPlayer;
