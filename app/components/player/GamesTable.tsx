import React, { useState } from "react";

interface GameLog {
  date: string;
  opponentName: string;
  goals: number;
  assists: number;
  points: number;
  plusMinusRating: number;
}

interface GamesTableProps {
  lastFiveGames: GameLog[];
}

const GamesTable: React.FC<GamesTableProps> = ({ lastFiveGames }) => {
  const [showSummary, setShowSummary] = useState(false);

  const summary = lastFiveGames.reduce(
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
    <div className="mt-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {showSummary ? "Last 5 Games Summary" : "Last 5 Games"}
        </h3>
        <button
          onClick={() => setShowSummary((prev) => !prev)}
          className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600"
        >
          {showSummary ? "5 Games" : "Summarize"}
        </button>
      </div>

      <table className="w-full mt-4 border-collapse border border-gray-300">
        {/* Static Headers */}
        <thead>
          <tr className="bg-gray-200 text-gray-800 text-sm font-semibold">
            <th className="py-2 px-4 text-left border border-gray-300">Games</th>
            <th className="py-2 px-4 text-center border border-gray-300">Goals</th>
            <th className="py-2 px-4 text-center border border-gray-300">Assists</th>
            <th className="py-2 px-4 text-center border border-gray-300">Points</th>
            <th className="py-2 px-4 text-center border border-gray-300">
              +/- Rating
            </th>
          </tr>
        </thead>
        <tbody>
          {showSummary ? (
            // Summary View
            <tr className="bg-blue-100 text-gray-800 text-sm">
              <td className="py-2 px-4 border border-gray-300">Last 5 Games</td>
              <td className="py-2 px-4 text-center border border-gray-300">
                {summary.goals}
              </td>
              <td className="py-2 px-4 text-center border border-gray-300">
                {summary.assists}
              </td>
              <td className="py-2 px-4 text-center border border-gray-300">
                {summary.points}
              </td>
              <td className="py-2 px-4 text-center border border-gray-300">
                {summary.plusMinusRating}
              </td>
            </tr>
          ) : (
            // Detailed View
            lastFiveGames.map((game, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-blue-100" : "bg-white"
                } text-gray-800 text-sm`}
              >
                <td className="py-2 px-4 border border-gray-300">{game.date}</td>
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GamesTable;
