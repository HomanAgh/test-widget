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
  gameLimit: number;
  viewMode: "stats" | "seasons" | "career" | "games";
  showSummary: boolean;
}

// fetcher for SWR
const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch player data");
    }
    return res.json();
  });

const Player: React.FC<PlayerProps> = ({
  playerId,
  gameLimit,
  viewMode,
  showSummary
}) => {
  const { data, error } = useSWR(
    `/api/player/${encodeURIComponent(playerId)}?limit=${gameLimit}`,
    fetcher
  );

  if (!data && !error) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error.message}</div>;
  }

  const playerStats: PlayerStats = {
    player: {
      id: data.playerInfo.id,
      name: data.playerInfo.name || "UnknownPlayer",
      team: data.playerInfo.team,
      league: data.playerInfo.league,
      jerseyNumber: data.playerInfo.jerseyNumber || "N/A",
      views: data.playerInfo.views || 0,
      weightMet: data.playerInfo.weightMet || "",  
      weightImp: data.playerInfo.weightImp || "",    
      heightMet: data.playerInfo.heightMet || "",    
      heightImp: data.playerInfo.heightImp || "",  
      capHit: data.playerInfo.capHit,
      age: data.playerInfo.age || 0,
      placeOfBirth: data.playerInfo.placeOfBirth,
      flagUrls: data.playerInfo.flagUrls || { primary: null, secondary: null },
      teamLogo: data.playerInfo.teamLogo.small || null,
      season: data.playerInfo.season || { slug: "" },
    },
    lastGames: data.lastGames || [],
    playerType: data.playerInfo.playerType,
  };

  return (
    <div>
      <div>
        <PlayerInfo player={playerStats.player} />
      </div>

      {/* Player Stats View */}
      <div>
        {viewMode === "stats" && <PlayerStat playerId={playerId} />}
        {viewMode === "seasons" && <PlayerSeasons playerId={playerId} />}
        {viewMode === "career" && <PlayerCareers playerId={playerId} />}
        {viewMode === "games" && (
          <GamesTable
            lastFiveGames={playerStats.lastGames}
            playerType={playerStats.playerType}
            gameLimit={gameLimit}
            showSummary={showSummary}
          />
        )}
      </div>
    </div>
  );
};

export default Player;
