/* 'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

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
  imageUrl: string;
  lastFiveGames: GameLog[];
}

interface PlayerProps {
  playerId: string;
}

const Player: React.FC<PlayerProps> = ({ playerId }) => {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const response = await fetch(`/api/player?playerId=${encodeURIComponent(playerId)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch player stats: ${response.statusText}`);
        }

        const data = await response.json();

        // Map the external API data to your component's state
        setPlayerStats({
          name: data.playerInfo.name || 'Unknown Player',
          firstName: data.playerInfo.firstName || 'Unknown First Name',
          biographyAsHTML: data.playerInfo.biographyAsHTML || 'No biography available',
          imageUrl: data.playerInfo.imageUrl || '/default-image.jpg',
          lastFiveGames: data.lastFiveGames || [],
        });
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, [playerId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gradient-to-r from-teal-200 to-teal-800 bg-pattern-checkerboard">
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row">
        <div className="w-24 h-24 rounded-full overflow-hidden">
          <Image
            src={playerStats?.imageUrl || '/default-image.jpg'}
            alt="Player Image"
            width={96}
            height={96}
            className="object-cover"
          />
        </div>
        <div className="ml-4 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold">{playerStats?.name}</h2>
          <p className="text-sm text-gray-500">First Name: {playerStats?.firstName}</p>
          <div
            className="text-sm text-gray-600 mt-2"
            dangerouslySetInnerHTML={{ __html: playerStats?.biographyAsHTML || '' }}
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">Last 5 Games</h3>
        {playerStats?.lastFiveGames?.length ? (
          <table className="w-full mt-4 table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Team</th>
                <th className="py-2 px-4 border-b">Opponent</th>
                <th className="py-2 px-4 border-b">Score</th>
                <th className="py-2 px-4 border-b">Goals</th>
                <th className="py-2 px-4 border-b">Assists</th>
                <th className="py-2 px-4 border-b">Points</th>
              </tr>
            </thead>
            <tbody>
              {playerStats.lastFiveGames.map((game, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{game.date}</td>
                  <td className="py-2 px-4 border-b">{game.teamName}</td>
                  <td className="py-2 px-4 border-b">{game.opponentName}</td>
                  <td className="py-2 px-4 border-b">
                    {game.teamScore} - {game.opponentScore} ({game.outcome})
                  </td>
                  <td className="py-2 px-4 border-b">{game.goals}</td>
                  <td className="py-2 px-4 border-b">{game.assists}</td>
                  <td className="py-2 px-4 border-b">{game.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recent games available.</p>
        )}
      </div>
    </div>
  );
};

export default Player;
 */

"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

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
  plusMinusRating: number;
}

interface PlayerStats {
  id: string;
  name: string;
  firstName: string;
  biographyAsHTML: string;
  imageUrl: string;
  lastFiveGames: GameLog[];
}

interface PlayerProps {
  playerId: string;
}

const Player: React.FC<PlayerProps> = ({ playerId }) => {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const response = await fetch(`/api/player?playerId=${encodeURIComponent(playerId)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch player stats: ${response.statusText}`);
        }

        const data = await response.json();

        // Map the external API data to your component's state
        setPlayerStats({
          id: playerId,
          name: data.playerInfo.name || 'Unknown Player',
          firstName: data.playerInfo.firstName || 'Unknown First Name',
          biographyAsHTML: data.playerInfo.biographyAsHTML || 'No biography available',
          imageUrl: data.playerInfo.imageUrl || '/default-image.jpg',
          lastFiveGames: data.lastFiveGames || [],
        });
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, [playerId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Calculate the summary for the last five games
  const summary = playerStats?.lastFiveGames.reduce(
    (acc, game) => {
      acc.goals += game.goals;
      acc.assists += game.assists;
      acc.points += game.points;
      acc.plusMinusRating += game.plusMinusRating;
      return acc;
    },
    { goals: 0, assists: 0, points: 0, plusMinusRating: 0 }
  );

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gradient-to-r from-teal-200 to-teal-800 bg-pattern-checkerboard">
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row">
        <div className="w-24 h-24 rounded-full overflow-hidden">
          <Image
            src={playerStats?.imageUrl || '/default-image.jpg'}
            alt="Player Image"
            width={96}
            height={96}
            className="object-cover"
          />
        </div>
        <div className="ml-4 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold">
          <a
              href={`https://www.eliteprospects.com/player/${playerStats?.id}/${playerStats?.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-inherit"
            >
              {playerStats?.name}
            </a>
          </h2>
          {/* <p className="text-sm text-gray-500">First Name: {playerStats?.firstName}</p> */}
          <div
            /* className="text-sm text-gray-600 mt-2"
            dangerouslySetInnerHTML={{ __html: playerStats?.biographyAsHTML || '' }} */
          />
        </div>
      </div>

      {/* Summary Table */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Last 5 Games Summary</h3>
        {summary ? (
          <table className="w-full mt-4 table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Games</th>
                <th className="py-2 px-4 border-b">Total Goals</th>
                <th className="py-2 px-4 border-b">Total Assists</th>
                <th className="py-2 px-4 border-b">Total Points</th>
                <th className="py-2 px-4 border-b">Total +/-</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b text-center">Last 5 games</td>
                <td className="py-2 px-4 border-b text-center">{summary.goals}</td>
                <td className="py-2 px-4 border-b text-center">{summary.assists}</td>
                <td className="py-2 px-4 border-b text-center">{summary.points}</td>
                <td className="py-2 px-4 border-b text-center">{summary.plusMinusRating}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No recent games available for summary.</p>
        )}
      </div>

      {/* Detailed Table */}
      {/* <div className="mt-6">
        <h3 className="text-xl font-semibold">Last 5 Games Details</h3>
        {playerStats?.lastFiveGames?.length ? (
          <table className="w-full mt-4 table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Team</th>
                <th className="py-2 px-4 border-b">Opponent</th>
                <th className="py-2 px-4 border-b">Score</th>
                <th className="py-2 px-4 border-b">Goals</th>
                <th className="py-2 px-4 border-b">Assists</th>
                <th className="py-2 px-4 border-b">Points</th>
              </tr>
            </thead>
            <tbody>
              {playerStats.lastFiveGames.map((game, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{game.date}</td>
                  <td className="py-2 px-4 border-b">{game.teamName}</td>
                  <td className="py-2 px-4 border-b">{game.opponentName}</td>
                  <td className="py-2 px-4 border-b">
                    {game.teamScore} - {game.opponentScore} ({game.outcome})
                  </td>
                  <td className="py-2 px-4 border-b">{game.goals}</td>
                  <td className="py-2 px-4 border-b">{game.assists}</td>
                  <td className="py-2 px-4 border-b">{game.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recent games available.</p>
        )}
      </div> */}
    </div>
  );
};

export default Player;
