"use client";

import React, { Suspense } from "react";
import Player from "../../../components/player/Player";
import { useSearchParams } from "next/navigation";
import ResizeObserver from "@/app/components/embed/ResizeObserver";

const EmbedPlayer = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlayerPageContent />
    </Suspense>
  );
};

const PlayerPageContent = () => {
  const searchParams = useSearchParams();

  const playerId = searchParams.get("playerId") || "";
  const gameLimit = parseInt(searchParams.get("gameLimit") || "5", 10);
  const backgroundColor = searchParams.get("backgroundColor") || "#052D41";
  const textColor = searchParams.get("textColor") || "#000000";
  const tableBackgroundColor = searchParams.get("tableBackgroundColor") || "#FFFFFF";
  const headerTextColor = searchParams.get("headerTextColor") || "#FFFFFF";
  const nameTextColor = searchParams.get("nameTextColor") || "#0D73A6";

  const viewModeParam = searchParams.get("viewMode");
  const viewMode =
    viewModeParam === "seasons" ||
    viewModeParam === "games" ||
    viewModeParam === "career" ||
    viewModeParam === "stats"
      ? viewModeParam
      : "stats";

  const showSummary = searchParams.get("showSummary") === "true";

  if (!playerId) {
    return <div>Missing player ID</div>;
  }

  return (
    <ResizeObserver>
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
    </ResizeObserver>
  );
};

export default EmbedPlayer;
