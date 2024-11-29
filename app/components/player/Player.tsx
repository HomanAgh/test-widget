"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import PlayerInfo from "./PlayerInfo";
import GamesTable from "./GamesTable";
import type { Player } from "@/app/types/player";
import type { PlayerType } from "@/app/types/player";
import type { GameLog } from "@/app/types/player";

interface PlayerStats {
  player: Player;
  lastFiveGames: GameLog[];
  playerType: PlayerType;
}

interface PlayerProps {
  playerId: string;
  backgroundColor: string; 
}

const Player: React.FC<PlayerProps> = ({ playerId, backgroundColor }) => {
  const { t } = useTranslation(); // Hook for translations
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const response = await fetch(
          `/api/player?playerId=${encodeURIComponent(playerId)}`
        );
        const data = await response.json();

        setPlayerStats({
          player: {
            id: data.playerInfo.id,
            name: data.playerInfo.name || t("UnknownPlayer"),
            imageUrl: data.playerInfo.imageUrl || "/default-image.jpg",
            team: data.playerInfo.team,
            league: data.playerInfo.league,
            nationality: data.playerInfo.nationality || t("UnknownNationality"),
            jerseyNumber: data.playerInfo.jerseyNumber || t("JerseyNA"),
            views: data.playerInfo.views,
          },
          lastFiveGames: data.lastFiveGames || [],
          playerType: data.playerInfo.playerType,
        });
      } catch (err: any) {
        setError(err.message || t("ErrorOccurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, [playerId, t]);

  if (loading) return <div className="text-center text-gray-600">{t("Loading")}</div>;
  if (error) return <div className="text-center text-red-600">{t("ErrorOccurred")}: {error}</div>;

  return (
    <div
      className={`max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-lg`}
      style={{ backgroundColor }}
    >
      {playerStats && <PlayerInfo player={playerStats.player} />}
      {playerStats && (
        <GamesTable
          lastFiveGames={playerStats.lastFiveGames}
          playerType={playerStats.playerType}
        />
      )}
    </div>
  );
};

export default Player;
