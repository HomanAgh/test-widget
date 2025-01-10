"use client";

import React from "react";
import { GameLog, PlayerType, GoaltenderSummary, SkaterSummary } from "@/app/types/player";

interface GamesTableProps {
  lastFiveGames: GameLog[];
  playerType: PlayerType;
  backgroundColor?: string; // NEW
  textColor?: string;       // NEW
  gameLimit: number;
  showSummary: boolean;
}

const GamesTable: React.FC<GamesTableProps> = ({
  lastFiveGames,
  playerType,
  backgroundColor = "#FFFFFF",
  textColor = "#000000",
  gameLimit,
  showSummary,
}) => {
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
    <div
      className="mt-8 p-4 rounded-md"
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      <h3 className="text-2xl font-bold mb-4" style={{ color: textColor }}>
        {showSummary ? `Summary Last ${gameLimit} Games` : `Last ${gameLimit} Games`}
      </h3>

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
            <th className="py-2 px-4 text-center">Date</th>
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
                <td className="py-2 px-4 text-center">{game.date}</td>
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
