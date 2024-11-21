"use client";

import React, { useEffect, useState } from "react";

interface PlayerStats {
  name: string;
  score: number;
  gamesPlayed: number;
}

interface PlayerWidgetProps {
  playerId: string;
}

const PlayerWidget: React.FC<PlayerWidgetProps> = ({ playerId }) => {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const response = await fetch(`/api/proxy?playerId=${playerId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch player stats: ${response.statusText}`);
        }

        const data = await response.json();
        setPlayerStats(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, [playerId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>{playerStats?.name}</h2>
      <p>Score: {playerStats?.score}</p>
      <p>Games Played: {playerStats?.gamesPlayed}</p>
    </div>
  );
};

export default PlayerWidget;