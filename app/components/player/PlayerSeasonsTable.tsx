import React from "react";
import { SeasonStats, PlayerType } from "@/app/types/player";
import Table from "../common/style/Table";
import TableHeader from "../common/style/TableHeader";
import TableTitel from "../common/style/TableTitle";
import TableWrapper from "../common/style/TableWrapper"; // Import TableWrapper

interface SeasonsTableProps {
  playerType: PlayerType;
  seasons: SeasonStats[];
  backgroundColor?: string;
  textColor?: string;
}

const SeasonsTable: React.FC<SeasonsTableProps> = ({
  playerType,
  seasons,
  backgroundColor = "#FFFFFF",
  textColor = "#000000",
}) => {
  const displayedYears: Set<string> = new Set();

  return (
    <div>
      <TableTitel align="left">Season Statistics</TableTitel>
      <TableWrapper backgroundColor={backgroundColor} textColor={textColor}>
      <table className="min-w-full shadow-md rounded-lg overflow-hidden">
        <thead style={{ filter: "brightness(90%)" }}>
          <tr>
            <TableHeader align="left">S</TableHeader>
            <TableHeader align="left">Team</TableHeader>
            <TableHeader align="left">League</TableHeader>
            <TableHeader align="center">GP</TableHeader>
            {playerType === "GOALTENDER" ? (
              <>
                <TableHeader align="center">GAA</TableHeader>
                <TableHeader align="center">SV%</TableHeader>
                <TableHeader align="center">SO</TableHeader>
              </>
            ) : (
              <>
                <TableHeader align="center">G</TableHeader>
                <TableHeader align="center">A</TableHeader>
                <TableHeader align="center">TP</TableHeader>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {seasons.map((season, index) => {
            const isYearDisplayed = displayedYears.has(season.season);
            if (!isYearDisplayed) {
              displayedYears.add(season.season);
            }

            return (
              <tr
                key={index}
                className="border-t"
                style={{
                  backgroundColor,
                  color: textColor,
                }}
              >
                <Table align="left">{isYearDisplayed ? "" : season.season}</Table>
                <Table align="left">
                  <a
                    href={`https://www.eliteprospects.com/team/${season.teamId}/${encodeURIComponent(
                      season.teamName
                    )}/${season.season}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: textColor,
                      textDecoration: "underline",
                    }}
                  >
                    {season.teamName}
                  </a>
                </Table>
                <Table align="left">
                  <a
                    href={`https://www.eliteprospects.com/league/${season.league}/stats/${season.season}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: textColor,
                      textDecoration: "underline",
                    }}
                  >
                    {season.league}
                  </a>
                </Table>
                <Table align="center">{season.gamesPlayed}</Table>
                {playerType === "GOALTENDER" ? (
                  <>
                    <Table align="center">{season.goalsAgainstAverage || "N/A"}</Table>
                    <Table align="center">{season.savePercentage || "N/A"}</Table>
                    <Table align="center">{season.shutouts || 0}</Table>
                  </>
                ) : (
                  <>
                    <Table align="center">{season.goals || 0}</Table>
                    <Table align="center">{season.assists || 0}</Table>
                    <Table align="center">{season.points || 0}</Table>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableWrapper>
    </div>
  );
};

export default SeasonsTable;
