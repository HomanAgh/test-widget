import React from "react";
import { PlayerType, Goalie, Skater } from "@/app/types/player";

interface PlayerStatsTableProps {
  playerType: PlayerType; // Player type: "GOALTENDER" or "SKATER"
  stats: Goalie | Skater; // Stats data// Number of games played
}

const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({ playerType, stats}) => {
  const isGoaltender = playerType === "GOALTENDER";

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800">Statistics</h3>
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-800 font-semibold">
            <th className="py-2 px-4 border">Games Played (GP)</th>
            {isGoaltender ? (
              <>
                <th className="py-2 px-4 border">Shots Against</th>
                <th className="py-2 px-4 border">Saves</th>
                <th className="py-2 px-4 border">Goals Against</th>
                <th className="py-2 px-4 border">Save Percentage</th>
              </>
            ) : (
              <>
                <th className="py-2 px-4 border">Goals</th>
                <th className="py-2 px-4 border">Assists</th>
                <th className="py-2 px-4 border">Points</th>
                <th className="py-2 px-4 border">Plus/Minus</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white text-gray-800">
            <td className="py-2 px-4 border">{(stats as Goalie ).gamesPlayed}</td>
            {isGoaltender ? (
              <>
                <td className="py-2 px-4 border">{(stats as Goalie).shotsAgainst}</td>
                <td className="py-2 px-4 border">{(stats as Goalie).saves}</td>
                <td className="py-2 px-4 border">{(stats as Goalie).goalsAgainst}</td>
                <td className="py-2 px-4 border">
                  {((stats as Goalie).savePercentage || 0).toFixed(2)}%
                </td>
              </>
            ) : (
              <>
                <td className="py-2 px-4 border">{(stats as Skater).goals}</td>
                <td className="py-2 px-4 border">{(stats as Skater).assists}</td>
                <td className="py-2 px-4 border">{(stats as Skater).points}</td>
                <td className="py-2 px-4 border">{(stats as Skater).plusMinusRating}</td>
              </>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PlayerStatsTable;
