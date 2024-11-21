'use client';

import React, { useEffect, useState } from 'react';

interface PlayerStats {
  name: string;
  score: number;
  gamesPlayed: number;
  // Add other relevant fields here
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
        // Retrieve API key and base URL from environment variables
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; 
        
        if (!apiKey || !apiBaseUrl) {
          throw new Error("API key or base URL is missing. Check your .env.local file.");
        }

        // Construct the API URL
        const url = `${apiBaseUrl}/Player/${playerId}`;

        // Make the API request
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${apiKey}`, 
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch player stats: ${response.statusText}`);
        }

        const data = await response.json();
        setPlayerStats(data); // Save player stats in state
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
      {/* Add more stats as needed */}
    </div>
  );
};

export default PlayerWidget;
