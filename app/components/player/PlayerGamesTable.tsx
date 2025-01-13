"use client"; // Use this if you're in Next.js 13+ with server-side rendering

import React from "react";
import { GameLog, PlayerType, GoaltenderSummary, SkaterSummary } from "@/app/types/player";
import Table from "../common/style/Table";
import TableHeader from "../common/style/TableHeader";
import TableTitel from "../common/style/TableTitle";
import TableWrapper from "../common/style/TableWrapper";

interface GamesTableProps {
  lastFiveGames: GameLog[];
  playerType: PlayerType;
  backgroundColor?: string;
  textColor?: string;  
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
    <div>
      <TableTitel align="left">{showSummary ? `Summary Last ${gameLimit} Games` : `Last ${gameLimit} Games`}</TableTitel>
      <TableWrapper backgroundColor={backgroundColor} textColor={textColor}>
        <table className="min-w-full shadow-md rounded-lg overflow-hidden mt-4">
          <thead style={{ filter: "brightness(90%)" }}>
            <tr>
              <TableHeader align="center">Date</TableHeader>
              {playerType === "GOALTENDER" ? (
                <>
                  <TableHeader align="center">GA</TableHeader>
                  <TableHeader align="center">SA</TableHeader>
                  <TableHeader align="center">SV</TableHeader>
                  <TableHeader align="center">SV%</TableHeader>
                </>
              ) : (
                <>
                  <TableHeader align="center">G</TableHeader>
                  <TableHeader align="center">A</TableHeader>
                  <TableHeader align="center">TP</TableHeader>
                  <TableHeader align="center">+/-</TableHeader>
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
                <Table align="center">Summary</Table>
                {playerType === "GOALTENDER" ? (
                  <>
                    <Table align="center">{(summary as GoaltenderSummary).goalsAgainst}</Table>
                    <Table align="center">{(summary as GoaltenderSummary).shotsAgainst}</Table>
                    <Table align="center">{(summary as GoaltenderSummary).saves}</Table>
                    <Table align="center">{(summary as GoaltenderSummary).savePercentage.toFixed(2)}%</Table>
                  </>
                ) : (
                  <>
                    <Table align="center">{(summary as SkaterSummary).goals}</Table>
                    <Table align="center">{(summary as SkaterSummary).assists}</Table>
                    <Table align="center">{(summary as SkaterSummary).points}</Table>
                    <Table align="center">{(summary as SkaterSummary).plusMinusRating}</Table>
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
                  <Table align="center">{game.date}</Table>
                  {playerType === "GOALTENDER" ? (
                    <>
                      <Table align="center">{game.goalsAgainst || 0}</Table>
                      <Table align="center">{game.shotsAgainst || 0}</Table>
                      <Table align="center">{game.saves || 0}</Table>
                      <Table align="center">{game.savePercentage?.toFixed(2) || "0.00"}%</Table>
                    </>
                  ) : (
                    <>
                      <Table align="center">{game.goals || 0}</Table>
                      <Table align="center">{game.assists || 0}</Table>
                      <Table align="center">{game.points || 0}</Table>
                      <Table align="center">{game.plusMinusRating || 0}</Table>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableWrapper>
    </div>
  );
};

export default GamesTable;
