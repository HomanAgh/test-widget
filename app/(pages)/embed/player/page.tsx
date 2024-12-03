'use client';

import React from "react";
import Player from "../../../components/player/Player"; // Adjust import path based on your project
import { useSearchParams } from "next/navigation";

const EmbedPlayer = () => {
  const searchParams = useSearchParams();

  const playerId = searchParams.get("playerId") || ""; // Fetch playerId from query string
  const backgroundColor = searchParams.get("backgroundColor") || "#FFFFFF"; // Default background color
  const gameLimit = parseInt(searchParams.get("gameLimit") || "5", 10); // Default game limit

  if (!playerId) {
    return <div>Missing player ID</div>;
  }

  return (
    <div style={{ height: "100vh", overflow: "auto" }}>
      <Player
        playerId={playerId}
        backgroundColor={backgroundColor}
        gameLimit={gameLimit}
      />
    </div>
  );
};

export default EmbedPlayer;
