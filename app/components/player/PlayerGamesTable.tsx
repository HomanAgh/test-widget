"use client"; // For Next.js 13+ client components

import React from "react";
import {
  GameLog,
  PlayerType,
  GoaltenderSummary,
  SkaterSummary,
} from "@/app/types/player";
import { TableContainer, Table,TableHead,TableBody,TableRow,TableCell, PoweredBy } from "@/app/components/common/style";

interface GamesTableProps {
  lastFiveGames: GameLog[];
  playerType: PlayerType;
  gameLimit: number;
  showSummary: boolean;
}

const GamesTable: React.FC<GamesTableProps> = ({
  lastFiveGames,
  playerType,
  gameLimit,
  showSummary,
}) => {
  // Summaries for skaters or goaltenders
  let summary: GoaltenderSummary | SkaterSummary;

  if (playerType === "GOALTENDER") {
    // Calculate goaltender summary stats
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

    // Average out the save percentage
    if (lastFiveGames.length > 0) {
      summary.savePercentage /= lastFiveGames.length;
    }
  } else {
    // Calculate skater summary stats
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

  const titleText = showSummary
    ? `Summary Last ${gameLimit} Games`
    : `Last ${gameLimit} Games`;

  return (
    <div>
      {/* Title */}
      <h2 className="text-xl font-bold mb-2">{titleText}</h2>

      <TableContainer>
        {/* The main table wrapper */}
        <Table>
          {/* Head (replaces <thead>) */}
          <TableHead className="filter brightness-90">
            <TableRow>
              {/* Example: use `isHeader` or `header` prop if your TableCell supports it */}
              <TableCell isHeader align="center">Date</TableCell>
              {playerType === "GOALTENDER" ? (
                <>
                  <TableCell isHeader align="center">GA</TableCell>
                  <TableCell isHeader align="center">SA</TableCell>
                  <TableCell isHeader align="center">SV</TableCell>
                  <TableCell isHeader align="center">SV%</TableCell>
                </>
              ) : (
                <>
                  <TableCell isHeader align="center">G</TableCell>
                  <TableCell isHeader align="center">A</TableCell>
                  <TableCell isHeader align="center">TP</TableCell>
                  <TableCell isHeader align="center">+/-</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>

          {/* Body (replaces <tbody>) */}
          <TableBody>
            {showSummary ? (
              // Render a single summary row
              <TableRow>
                <TableCell align="center">Summary</TableCell>
                {playerType === "GOALTENDER" ? (
                  <>
                    <TableCell align="center">
                      {(summary as GoaltenderSummary).goalsAgainst}
                    </TableCell>
                    <TableCell align="center">
                      {(summary as GoaltenderSummary).shotsAgainst}
                    </TableCell>
                    <TableCell align="center">
                      {(summary as GoaltenderSummary).saves}
                    </TableCell>
                    <TableCell align="center">
                      {(summary as GoaltenderSummary).savePercentage.toFixed(2)}%
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell align="center">
                      {(summary as SkaterSummary).goals}
                    </TableCell>
                    <TableCell align="center">
                      {(summary as SkaterSummary).assists}
                    </TableCell>
                    <TableCell align="center">
                      {(summary as SkaterSummary).points}
                    </TableCell>
                    <TableCell align="center">
                      {(summary as SkaterSummary).plusMinusRating}
                    </TableCell>
                  </>
                )}
              </TableRow>
            ) : (
              // Render a row for each game
              lastFiveGames.map((game, index) => (
                <TableRow
                  key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <TableCell align="center">{game.date}</TableCell>
                  {playerType === "GOALTENDER" ? (
                    <>
                      <TableCell align="center">{game.goalsAgainst || 0}</TableCell>
                      <TableCell align="center">{game.shotsAgainst || 0}</TableCell>
                      <TableCell align="center">{game.saves || 0}</TableCell>
                      <TableCell align="center">
                        {game.savePercentage?.toFixed(2) || "0.00"}%
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell align="center">{game.goals || 0}</TableCell>
                      <TableCell align="center">{game.assists || 0}</TableCell>
                      <TableCell align="center">{game.points || 0}</TableCell>
                      <TableCell align="center">{game.plusMinusRating || 0}</TableCell>
                    </>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PoweredBy/>
    </div>
  );
};

export default GamesTable;
