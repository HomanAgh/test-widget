import React from "react";
import { PlayerType, Goalie, Skater } from "@/app/types/player";

interface PlayerStatsTableProps {
  playerType: PlayerType;
  stats: Goalie | Skater;
  backgroundColor?: string; // NEW
  textColor?: string;       // NEW
}

const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({
  playerType,
  stats,
  backgroundColor = "#FFFFFF",
  textColor = "#000000",
}) => {
  const isGoaltender = playerType === "GOALTENDER"; 

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Statistics</h2>
      <table
        className="min-w-full shadow-md rounded-lg overflow-hidden"
        style={{ backgroundColor, color: textColor, border: "1px solid #ccc" }}
      >
        {/* If you want a slightly darker header row, we can keep filter: brightness(90%). */}
        <thead
          style={{
            filter: "brightness(90%)",
            backgroundColor,
            color: textColor,
          }}
        >
          <tr>
            <th className="py-2 px-4 text-center">GP</th>
            {isGoaltender ? (
              <>
                <th className="py-2 px-4 text-center">GA</th>
                <th className="py-2 px-4 text-center">SA</th>
                <th className="py-2 px-4 text-center">SV</th>
                <th className="py-2 px-4 text-center">SV%</th>
              </>
            ) : (
              <>
                <th className="py-2 px-4 text-center">G</th>
                <th className="py-2 px-4 text-center">A</th>
                <th className="py-2 px-4 text-center">TP</th>
                <th className="py-2 px-4 text-center">+/-</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 text-center">{(stats as Goalie).gamesPlayed}</td>
            {isGoaltender ? (
              <>
                <td className="py-2 px-4 text-center">{(stats as Goalie).goalsAgainst}</td>
                <td className="py-2 px-4 text-center">{(stats as Goalie).shotsAgainst}</td>
                <td className="py-2 px-4 text-center">{(stats as Goalie).saves}</td>
                <td className="py-2 px-4 text-center">
                  {((stats as Goalie).savePercentage || 0).toFixed(2)}%
                </td>
              </>
            ) : (
              <>
                <td className="py-2 px-4 text-center">{(stats as Skater).goals}</td>
                <td className="py-2 px-4 text-center">{(stats as Skater).assists}</td>
                <td className="py-2 px-4 text-center">{(stats as Skater).points}</td>
                <td className="py-2 px-4 text-center">{(stats as Skater).plusMinusRating}</td>
              </>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PlayerStatsTable;
