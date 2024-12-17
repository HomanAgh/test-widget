"use client";

import React from "react";
import useSWR from "swr";
import PlayerInfo from "./PlayerInfo";
import GamesTable from "./PlayerGamesTable";
import PlayerStat from "./PlayerStat";
import PlayerSeasons from "./PlayerSeasons";
import PlayerCareers from "./PlayerCareer";
import type { Player, PlayerType, GameLog } from "@/app/types/player";

interface PlayerStats {
  player: Player;
  lastGames: GameLog[];
  playerType: PlayerType;
}

interface PlayerProps {
  playerId: string;
  backgroundColor: string;
  gameLimit: number;
  viewMode: "stats" | "seasons" | "career" | "games";
}

// Define a fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch player data");
    }
    return res.json();
  });

const Player: React.FC<PlayerProps> = ({ playerId, backgroundColor, gameLimit, viewMode }) => {

  // Use SWR to fetch data
  const { data, error } = useSWR(
    `/api/player/${encodeURIComponent(playerId)}?limit=${gameLimit}`,
    fetcher
  );

  // Handle loading state
  if (!data && !error) {
    return <div className="text-center text-gray-600">{"Loading..."}</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center text-red-600">{"Error Occurred"}: {error.message}</div>;
  }

  // At this point, `data` is loaded and no error occurred
  // Construct playerStats from `data`
  const playerStats: PlayerStats = {
    player: {
      id: data.playerInfo.id,
      name: data.playerInfo.name || "UnknownPlayer",
      team: data.playerInfo.team,
      league: data.playerInfo.league,
      jerseyNumber: data.playerInfo.jerseyNumber || "JerseyNA",
      views: data.playerInfo.views || 0,
      flagUrls: data.playerInfo.flagUrls,
    },
    lastGames: data.lastGames || [],
    playerType: data.playerInfo.playerType,
  };

  return (
    <div
      className="max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-lg"
      style={{ backgroundColor }}
    >
      <PlayerInfo player={playerStats.player} />
      <div>
        {viewMode === "stats" && (
          <PlayerStat playerId={playerId} backgroundColor={backgroundColor} />
        )}
        {viewMode === "seasons" && (
          <PlayerSeasons playerId={playerId} backgroundColor={backgroundColor} />
        )}
        {viewMode === "career" && (
          <PlayerCareers playerId={playerId} backgroundColor={backgroundColor} />
        )}
        {viewMode === "games" && (
          <GamesTable
            lastFiveGames={playerStats.lastGames}
            playerType={playerStats.playerType}
            gameLimit={gameLimit}
          />
        )}
      </div>
    </div>
  );
};

export default Player;
