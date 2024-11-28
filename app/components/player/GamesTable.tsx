import React, { useState } from "react";

interface GameLog {
  date: string;
  // Skater stats
  goals?: number;
  assists?: number;
  points?: number;
  plusMinusRating?: number;
  // Goaltender stats
  shotsAgainst?: number;
  saves?: number;
  goalsAgainst?: number;
  savePercentage?: number;
}

// Accumulator types for explicit type safety
interface GoaltenderSummary {
  shotsAgainst: number;
  saves: number;
  goalsAgainst: number;
  savePercentage: number;
}

interface SkaterSummary {
  goals: number;
  assists: number;
  points: number;
  plusMinusRating: number;
}

interface GamesTableProps {
  lastFiveGames: GameLog[];
  playerType: "SKATER" | "GOALTENDER";
}

const GamesTable: React.FC<GamesTableProps> = ({ lastFiveGames, playerType }) => {
  const [showSummary, setShowSummary] = useState(false);

  // Summary calculation with type narrowing
  let summary: GoaltenderSummary | SkaterSummary;

  if (playerType === "GOALTENDER") {
    summary = lastFiveGames.reduce<GoaltenderSummary>(
      (acc, game) => {
        acc.shotsAgainst += game.shotsAgainst || 0;
        acc.saves += game.saves || 0;
        acc.goalsAgainst += game.goalsAgainst || 0;
        acc.savePercentage += game.savePercentage || 0;
        return acc;
      },
      { shotsAgainst: 0, saves: 0, goalsAgainst: 0, savePercentage: 0 }
    );

    // Average save percentage for goaltenders
    if (lastFiveGames.length > 0) {
      summary.savePercentage /= lastFiveGames.length;
    }
  } else {
    summary = lastFiveGames.reduce<SkaterSummary>(
      (acc, game) => {
        acc.goals += game.goals || 0;
        acc.assists += game.assists || 0;
        acc.points += game.points || 0;
        acc.plusMinusRating += game.plusMinusRating || 0;
        return acc;
      },
      { goals: 0, assists: 0, points: 0, plusMinusRating: 0 }
    );
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">
          {showSummary ? "Summary of Last 5 Games" : "Last 5 Games"}
        </h3>
        <button
          onClick={() => setShowSummary((prev) => !prev)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {showSummary ? "View Details" : "View Summary"}
        </button>
      </div>
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-800 font-semibold">
            <th className="py-2 px-4 border">Date</th>
            {playerType === "GOALTENDER" ? (
              <>
                <th className="py-2 px-4 border">Shots Against</th>
                <th className="py-2 px-4 border">Saves</th>
                <th className="py-2 px-4 border">Goals Against</th>
                <th className="py-2 px-4 border">Save %</th>
              </>
            ) : (
              <>
                <th className="py-2 px-4 border">Goals</th>
                <th className="py-2 px-4 border">Assists</th>
                <th className="py-2 px-4 border">Points</th>
                <th className="py-2 px-4 border">+/- Rating</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {showSummary ? (
            <tr className="bg-blue-100">
              <td className="py-2 px-4 border">Summary</td>
              {playerType === "GOALTENDER" ? (
                <>
                  <td className="py-2 px-4 border">{(summary as GoaltenderSummary).shotsAgainst}</td>
                  <td className="py-2 px-4 border">{(summary as GoaltenderSummary).saves}</td>
                  <td className="py-2 px-4 border">{(summary as GoaltenderSummary).goalsAgainst}</td>
                  <td className="py-2 px-4 border">
                    {(summary as GoaltenderSummary).savePercentage.toFixed(2)}%
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 px-4 border">{(summary as SkaterSummary).goals}</td>
                  <td className="py-2 px-4 border">{(summary as SkaterSummary).assists}</td>
                  <td className="py-2 px-4 border">{(summary as SkaterSummary).points}</td>
                  <td className="py-2 px-4 border">{(summary as SkaterSummary).plusMinusRating}</td>
                </>
              )}
            </tr>
          ) : (
            lastFiveGames.map((game, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-blue-100" : "bg-white"}`}
              >
                <td className="py-2 px-4 border">{game.date}</td>
                {playerType === "GOALTENDER" ? (
                  <>
                    <td className="py-2 px-4 border">{game.shotsAgainst || 0}</td>
                    <td className="py-2 px-4 border">{game.saves || 0}</td>
                    <td className="py-2 px-4 border">{game.goalsAgainst || 0}</td>
                    <td className="py-2 px-4 border">{game.savePercentage?.toFixed(2) || "0.00"}%</td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-4 border">{game.goals || 0}</td>
                    <td className="py-2 px-4 border">{game.assists || 0}</td>
                    <td className="py-2 px-4 border">{game.points || 0}</td>
                    <td className="py-2 px-4 border">{game.plusMinusRating || 0}</td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GamesTable;
