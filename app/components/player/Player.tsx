"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface GameLog {
  date: string;
  teamName: string;
  opponentName: string;
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
  imageUrl: string;
  lastFiveGames: GameLog[];
  team?: { id: number; name: string };
  league?: { slug: string; name: string };
  nationality: string;
  jerseyNumber: string;
}

interface PlayerProps {
  playerId: string;
}

const Player: React.FC<PlayerProps> = ({ playerId }) => {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("bg-blue-100"); // Default background
  const [showSummary, setShowSummary] = useState(false); // Toggle between table and summary

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const response = await fetch(
          `/api/player?playerId=${encodeURIComponent(playerId)}`
        );
        const data = await response.json();

        setPlayerStats({
          id: playerId,
          name: data.playerInfo.name || "Unknown Player",
          imageUrl: data.playerInfo.imageUrl || "/default-image.jpg",
          lastFiveGames: data.lastFiveGames || [],
          team: data.playerInfo.team,
          league: data.playerInfo.league,
          nationality: data.playerInfo.nationality || "Unknown Nationality",
          jerseyNumber: data.playerInfo.jerseyNumber || "N/A",
        });
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, [playerId]);

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error)
    return <div className="text-center text-red-600">Error: {error}</div>;

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

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBackgroundColor(e.target.value);
  };

  const toggleSummaryView = () => {
    setShowSummary((prev) => !prev);
  };

  return (
    <div
      className={`max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-lg ${backgroundColor}`}
    >
      {/* Background Color Selector */}
      <div className="mb-6 text-center">
        <label
          htmlFor="color-picker"
          className="block text-sm font-medium text-gray-800 dark:text-gray-100"
        >
          Change Background Color:
        </label>
        <select
          id="color-picker"
          value={backgroundColor}
          onChange={handleBackgroundChange}
          className="mt-2 p-2 border rounded-md dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="bg-blue-100">Blue</option>
          <option value="bg-gray-50">Light Gray</option>
          <option value="bg-gray-800 text-white">Dark Gray</option>
          <option value="bg-green-100">Green</option>
          <option value="bg-yellow-100">Yellow</option>
        </select>
      </div>

      {/* Player Info Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
        {/* Player Image */}
        <div className="w-40 h-40 rounded-lg overflow-hidden shadow-md border border-gray-300">
          <Image
            src={playerStats?.imageUrl || "/default-image.jpg"}
            alt={playerStats?.name || "Player Image"}
            width={160}
            height={160}
            className="object-cover"
          />
        </div>

        {/* Player Details */}
        <div className="mt-4 md:mt-0 text-center md:text-left">
          {/* Name and Nationality Row */}
          <div className="flex items-center space-x-2">
            <a
              href={`https://www.eliteprospects.com/player/${playerStats?.id}/${playerStats?.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-semibold text-gray-800 dark:text-gray-100 hover:underline"
            >
              {playerStats?.name}
            </a>
            <span className="text-xl">{playerStats?.nationality}</span> {/* Replace with nationality flag */}
          </div>

          {/* Jersey, Team, and League Row */}
          <div className="mt-2">
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
              <span>#{playerStats?.jerseyNumber || "N/A"} </span>
              {playerStats?.team ? (
                <a
                  href={`https://www.eliteprospects.com/team/${playerStats.team.id}/${playerStats.team.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-1xl font-semibold text-gray-800 dark:text-gray-100 hover:underline"
                >
                  {playerStats.team.name}
                </a>
              ) : (
                "Unknown Team"
              )}
              {" / "}
              {playerStats?.league ? (
                <a
                  href={`https://www.eliteprospects.com/league/${playerStats.league.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-1xl font-semibold text-gray-800 dark:text-gray-100 hover:underline"
                >
                  {playerStats.league.name}
                </a>
              ) : (
                "Unknown League"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Last 5 Games Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {showSummary ? "Last 5 Games Summary" : "Last 5 Games"}
          </h3>
          <button
            onClick={toggleSummaryView}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600"
          >
            {showSummary ? "5 Games" : "Summarize"}
          </button>
        </div>

        {/* Summary View */}
        {showSummary ? (
          <table className="w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-800 text-sm font-semibold">
                <th className="py-2 px-4 text-left border border-gray-300">
                  Games
                </th>
                <th className="py-2 px-4 text-center border border-gray-300">
                  Goals
                </th>
                <th className="py-2 px-4 text-center border border-gray-300">
                  Assists
                </th>
                <th className="py-2 px-4 text-center border border-gray-300">
                  Points
                </th>
                <th className="py-2 px-4 text-center border border-gray-300">
                  +/- Rating
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-blue-100 text-gray-800 text-sm">
                <td className="py-2 px-4 border border-gray-300">
                  Last 5 Games
                </td>
                <td className="py-2 px-4 text-center border border-gray-300">
                  {summary?.goals || 0}
                </td>
                <td className="py-2 px-4 text-center border border-gray-300">
                  {summary?.assists || 0}
                </td>
                <td className="py-2 px-4 text-center border border-gray-300">
                  {summary?.points || 0}
                </td>
                <td className="py-2 px-4 text-center border border-gray-300">
                  {summary?.plusMinusRating || 0}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          // Table View
          <table className="w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-800 text-sm font-semibold">
                <th className="py-2 px-4 text-left border border-gray-300">
                  Date
                </th>
                <th className="py-2 px-4 text-left border border-gray-300">
                  Opponent
                </th>
                <th className="py-2 px-4 text-center border border-gray-300">
                  Goals
                </th>
                <th className="py-2 px-4 text-center border border-gray-300">
                  Assists
                </th>
                <th className="py-2 px-4 text-center border border-gray-300">
                  Points
                </th>
                <th className="py-2 px-4 text-center border border-gray-300">
                  +/- Rating
                </th>
              </tr>
            </thead>
            <tbody>
              {playerStats?.lastFiveGames.map((game, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-blue-100" : "bg-white"
                  } text-gray-800 text-sm`}
                >
                  <td className="py-2 px-4 border border-gray-300">{game.date}</td>
                  <td className="py-2 px-4 border border-gray-300">
                    {game.opponentName}
                  </td>
                  <td className="py-2 px-4 text-center border border-gray-300">
                    {game.goals}
                  </td>
                  <td className="py-2 px-4 text-center border border-gray-300">
                    {game.assists}
                  </td>
                  <td className="py-2 px-4 text-center border border-gray-300">
                    {game.points}
                  </td>
                  <td className="py-2 px-4 text-center border border-gray-300">
                    {game.plusMinusRating}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Player;
