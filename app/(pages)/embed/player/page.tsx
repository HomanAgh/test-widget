"use client";

import React, { Suspense } from "react";
import Player from "../../../components/player/Player";
import { useSearchParams } from "next/navigation";

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
  const backgroundColor = searchParams.get("backgroundColor") || "#FFFFFF";
  const gameLimit = parseInt(searchParams.get("gameLimit") || "5", 10);

  const viewModeParam = searchParams.get("viewMode");
  const viewMode = (viewModeParam === "seasons" ||
    viewModeParam === "games" ||
    viewModeParam === "career" ||
    viewModeParam === "stats")
    ? viewModeParam
    : "stats";

    const showSummary = searchParams.get("showSummary") === "true";

  if (!playerId) {
    return <div>Missing player ID</div>;
  }

  return (
    <div style={{ height: "100vh", overflow: "auto" }}>
      <Player
        playerId={playerId}
        backgroundColor={backgroundColor}
        gameLimit={gameLimit}
        viewMode={viewMode}
        showSummary={showSummary}
      />
    </div>
  );
};

export default EmbedPlayer;
