"use client";

import React from "react";
import Player from "../../../components/player/Player";
import { useSearchParams } from "next/navigation";

const EmbedPlayer = () => {
  const searchParams = useSearchParams();

  const playerId = searchParams.get("playerId") || ""; 
  const backgroundColor = searchParams.get("backgroundColor") || "#FFFFFF"; 
  const gameLimit = parseInt(searchParams.get("gameLimit") || "5", 10);
  const showCurrentSeasonStats = searchParams.get("showCurrentSeasonStats") === "true"; 

  if (!playerId) {
    return <div>Missing player ID</div>;
  }

  return (
    <div style={{ height: "100vh", overflow: "auto" }}>
      <Player
        playerId={playerId}
        backgroundColor={backgroundColor}
        gameLimit={gameLimit}
        showCurrentSeasonStats={showCurrentSeasonStats} // Pass dynamically
      />
    </div>
  );
};

export default EmbedPlayer;
