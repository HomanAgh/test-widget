"use client"; // For Next.js 13+ client components

import React from "react";
import {
  GameLog,
  PlayerType,
  GoaltenderSummary,
  SkaterSummary,
} from "@/app/types/player";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  PoweredBy,
} from "@/app/components/common/style";
import { formatSavePercentage } from '@/app/utils/formatSVP';
import Tooltip from "@/app/components/common/Tooltip";

interface GamesTableProps {
  lastFiveGames: GameLog[];
  playerType: PlayerType;
  gameLimit: number;
  showSummary: boolean;
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
}

const GamesTable: React.FC<GamesTableProps> = ({
  lastFiveGames,
  playerType,
  gameLimit,
  showSummary,
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  },
}) => {
  // Summaries for skaters or goaltenders
  let summary: GoaltenderSummary | SkaterSummary;
  const isCustomColor =
    customColors.tableBackgroundColor.toLowerCase() !== "#ffffff" &&
    customColors.tableBackgroundColor.toLowerCase() !== "#fff";

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

  /* const titleText = showSummary
    ? `Summary Last ${gameLimit} Games`
    : `Last ${gameLimit} Games`; */

  const renderGameTeams = (game: GameLog) => {
    if (!game.homeTeam || !game.awayTeam) return null;

    const tooltipText = `${game.date}\n${game.homeTeam.name} ${game.score?.home} - ${game.score?.away} ${game.awayTeam.name}\n${game.isHomeGame ? 'Home Game' : 'Away Game'}`;

    return (
      <div className="flex items-center justify-between w-full">
        <Tooltip tooltip={tooltipText} position="right">
          <img 
            src={game.homeTeam.logo} 
            alt={game.homeTeam.name} 
            width={20}
            height={20}
          />
        </Tooltip>
        <span>vs</span>
        <Tooltip tooltip={tooltipText} position="right">
          <img 
            src={game.awayTeam.logo} 
            alt={game.awayTeam.name} 
            width={20}
            height={20}
          />
        </Tooltip>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto rounded-lg -mt-4">
      <TableContainer>
        <Table
          tableBgColor={customColors.tableBackgroundColor}
          tableTextColor={customColors.textColor}
        >
          <TableHead
            bgColor={customColors.backgroundColor}
            textColor={customColors.headerTextColor}
          >
            <TableRow bgColor={customColors.backgroundColor}>
              <TableCell isHeader align="center">
                Game
              </TableCell>
              {playerType === "GOALTENDER" ? (
                <>
                  <TableCell isHeader align="center">
                    GA
                  </TableCell>
                  <TableCell isHeader align="center">
                    SA
                  </TableCell>
                  <TableCell isHeader align="center">
                    SV
                  </TableCell>
                  <TableCell isHeader align="center">
                    SV%
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell isHeader align="center">
                    G
                  </TableCell>
                  <TableCell isHeader align="center">
                    A
                  </TableCell>
                  <TableCell isHeader align="center">
                    TP
                  </TableCell>
                  <TableCell isHeader align="center">
                    +/-
                  </TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {showSummary ? (
              <TableRow
                bgColor={
                  isCustomColor ? customColors.tableBackgroundColor : "#F3F4F6"
                }
              >
                <TableCell align="center">{`Last ${gameLimit} Games`}</TableCell>
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
                      {formatSavePercentage((summary as GoaltenderSummary).savePercentage)}
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
              lastFiveGames.map((game, index) => (
                <TableRow
                  key={index}
                  bgColor={
                    isCustomColor
                      ? customColors.tableBackgroundColor
                      : index % 2 === 0
                      ? "#F3F4F6"
                      : "#FFFFFF"
                  }
                >
                  <TableCell align="center">
                    {renderGameTeams(game)}
                  </TableCell>
                  {playerType === "GOALTENDER" ? (
                    <>
                      <TableCell align="center">
                        {game.goalsAgainst || 0}
                      </TableCell>
                      <TableCell align="center">
                        {game.shotsAgainst || 0}
                      </TableCell>
                      <TableCell align="center">{game.saves || 0}</TableCell>
                      <TableCell align="center">
                        {formatSavePercentage(game.savePercentage)}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell align="center">{game.goals || 0}</TableCell>
                      <TableCell align="center">{game.assists || 0}</TableCell>
                      <TableCell align="center">{game.points || 0}</TableCell>
                      <TableCell align="center">
                        {game.plusMinusRating || 0}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PoweredBy />
    </div>
  );
};

export default GamesTable;
