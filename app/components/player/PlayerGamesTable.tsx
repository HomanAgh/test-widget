import React from "react";
import { PlayerType, GoaltenderSummary, SkaterSummary } from "@/app/types/player";

interface GamesTableProps {
  playerType: PlayerType;
  showSummary: boolean;
  gameLimit: number;
  lastFiveGames: any[]; // Type it based on your actual data structure
  summary: GoaltenderSummary | SkaterSummary;
  backgroundColor?: string;
  textColor?: string;
}

const GamesTable: React.FC<GamesTableProps> = ({
  playerType,
  showSummary,
  gameLimit,
  lastFiveGames,
  summary,
  backgroundColor = "#FFFFFF",
  textColor = "#000000",
}) => {
  return (
    <div
      className="mt-8 p-4 rounded-md"
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      <h2 className="text-2xl font-bold mb-4" style={{ color: textColor }}>
        {showSummary ? `Summary Last ${gameLimit} Games` : `Last ${gameLimit} Games`}
      </h2>

      <table
        className="min-w-full shadow-md rounded-lg overflow-hidden mt-4"
        style={{
          backgroundColor,
          color: textColor,
          border: "1px solid #ccc",
        }}
      >
        <thead
          style={{
            filter: "brightness(90%)",
            backgroundColor,
            color: textColor,
          }}
        >
          <tr>
            <th className="py-2 px-4 text-left">Date</th>
            {playerType === "GOALTENDER" ? (
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
          {showSummary ? (
            <tr
              style={{
                backgroundColor,
                color: textColor,
                border: "1px solid #ccc",
              }}
            >
              <td className="py-2 px-4 text-center">Summary</td>
              {playerType === "GOALTENDER" ? (
                <>
                  <td className="py-2 px-4 text-center">{(summary as GoaltenderSummary).goalsAgainst}</td>
                  <td className="py-2 px-4 text-center">{(summary as GoaltenderSummary).shotsAgainst}</td>
                  <td className="py-2 px-4 text-center">{(summary as GoaltenderSummary).saves}</td>
                  <td className="py-2 px-4 text-center">
                    {(summary as GoaltenderSummary).savePercentage.toFixed(2)}%
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 px-4 text-center">{(summary as SkaterSummary).goals}</td>
                  <td className="py-2 px-4 text-center">{(summary as SkaterSummary).assists}</td>
                  <td className="py-2 px-4 text-center">{(summary as SkaterSummary).points}</td>
                  <td className="py-2 px-4 text-center">{(summary as SkaterSummary).plusMinusRating}</td>
                </>
              )}
            </tr>
          ) : (
            lastFiveGames.map((game, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? "rgba(0,0,255,0.1)" : backgroundColor,
                  color: textColor,
                  border: "1px solid #ccc",
                }}
              >
                <td className="py-2 px-4 text-left">{game.date}</td>
                {playerType === "GOALTENDER" ? (
                  <>
                    <td className="py-2 px-4 text-center">{game.goalsAgainst || 0}</td>
                    <td className="py-2 px-4 text-center">{game.shotsAgainst || 0}</td>
                    <td className="py-2 px-4 text-center">{game.saves || 0}</td>
                    <td className="py-2 px-4 text-center">{game.savePercentage?.toFixed(2) || "0.00"}%</td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-4 text-center">{game.goals || 0}</td>
                    <td className="py-2 px-4 text-center">{game.assists || 0}</td>
                    <td className="py-2 px-4 text-center">{game.points || 0}</td>
                    <td className="py-2 px-4 text-center">{game.plusMinusRating || 0}</td>
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
