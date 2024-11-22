/* "use client";

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

export default PlayerWidget; */

"use client";

import React, { useEffect, useState } from "react";

interface GameLog {
  date: string;
  teamName: string;
  opponentName: string;
  gameType: string;
  teamScore: number;
  opponentScore: number;
  outcome: string;
  goals: number;
  assists: number;
  points: number;
}


interface PlayerStats {
  name: string;
  firstName: string;
  biographyAsHTML: string;
  lastFiveGames: GameLog[];
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
        
        // Map the external API data to your component's state
        setPlayerStats({
          name: data?.data?.name || "Unknown Player",
          firstName: data?.data?.firstName || "Unknown First Name",
          biographyAsHTML: data?.data?.biographyAsHTML || "No biography available",
          lastFiveGames: data.lastFiveGames || [],
        });
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
      <h2>Player Name: {playerStats?.name}</h2>
      <p>First Name: {playerStats?.firstName}</p>
      <p>Biography: {playerStats?.biographyAsHTML}</p>
      <h3>Last 5 Games</h3>
      {playerStats && playerStats.lastFiveGames && playerStats.lastFiveGames.length > 0 ? (
        <ul>
          {playerStats.lastFiveGames.map((game, index) => (
            <li key={index}>
              <p>Date: {game.date}</p>
              <p>Team: {game.teamName}</p>
              <p>Opponent: {game.opponentName}</p>
              <p>Game Type: {game.gameType}</p>
              <p>Score: {game.teamScore} - {game.opponentScore} ({game.outcome})</p>
              <p>Goals: {game.goals}</p>
              <p>Assists: {game.assists}</p>
              <p>Total Points: {game.points}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent games available.</p>
      )}
    </div>
  );
};


export default PlayerWidget;
