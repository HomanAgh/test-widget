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
      <h3 className="text-xl font-semibold" style={{ color: textColor }}>
        {showSummary ? `Summary Last ${gameLimit} Games` : `Last ${gameLimit} Games`}
      </h3>

      {/* 
        We'll remove classes like "bg-gray-200" or "bg-white" from the table
        so it doesn't override backgroundColor.
      */}
      <table
        className="w-full mt-4 border-collapse"
        style={{
          backgroundColor,
          color: textColor,
          border: "1px solid #ccc",
        }}
      >
        <thead style={{ filter: "brightness(90%)" }}>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Date</th>
            {playerType === "GOALTENDER" ? (
              <>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>GA</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>SA</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>SV</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>SV%</th>
              </>
            ) : (
              <>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>G</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>A</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>TP</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>+/-</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {showSummary ? (
            <tr style={{ backgroundColor, color: textColor }}>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Summary</td>
              {playerType === "GOALTENDER" ? (
                <>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {(summary as GoaltenderSummary).goalsAgainst}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {(summary as GoaltenderSummary).shotsAgainst}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {(summary as GoaltenderSummary).saves}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {(summary as GoaltenderSummary).savePercentage.toFixed(2)}%
                  </td>
                </>
              ) : (
                <>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {(summary as SkaterSummary).goals}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {(summary as SkaterSummary).assists}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {(summary as SkaterSummary).points}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {(summary as SkaterSummary).plusMinusRating}
                  </td>
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
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{game.date}</td>
                {playerType === "GOALTENDER" ? (
                  <>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      {game.goalsAgainst || 0}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      {game.shotsAgainst || 0}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      {game.saves || 0}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      {game.savePercentage?.toFixed(2) || "0.00"}%
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      {game.goals || 0}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      {game.assists || 0}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      {game.points || 0}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      {game.plusMinusRating || 0}
                    </td>
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
