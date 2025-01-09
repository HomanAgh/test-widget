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
      <h3 style={{ color: textColor, fontSize: "1.25rem", fontWeight: "600" }}>Statistics</h3>
      <table
        className="w-full mt-4 border-collapse"
        style={{ backgroundColor, color: textColor, border: "1px solid #ccc" }}
      >
        <thead style={{ filter: "brightness(90%)" }}>
          <tr>
            <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>GP</th>
            {isGoaltender ? (
              <>
                <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>GA</th>
                <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>SA</th>
                <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>SV</th>
                <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>SV%</th>
              </>
            ) : (
              <>
                <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>G</th>
                <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>A</th>
                <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>TP</th>
                <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>+/-</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          <tr style={{ border: "1px solid #ccc" }}>
            <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
              {(stats as Goalie).gamesPlayed}
            </td>
            {isGoaltender ? (
              <>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
                  {(stats as Goalie).goalsAgainst}
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
                  {(stats as Goalie).shotsAgainst}
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
                  {(stats as Goalie).saves}
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
                  {((stats as Goalie).savePercentage || 0).toFixed(2)}%
                </td>
              </>
            ) : (
              <>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
                  {(stats as Skater).goals}
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
                  {(stats as Skater).assists}
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
                  {(stats as Skater).points}
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
                  {(stats as Skater).plusMinusRating}
                </td>
              </>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PlayerStatsTable;
