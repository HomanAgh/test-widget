import React from "react";
import { SeasonStats, PlayerType } from "@/app/types/player";
import { TableContainer, Table,TableHead,TableBody,TableRow,TableCell,Link, PoweredBy } from "@/app/components/common/style";

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
  // Track displayed years so we can merge repeated years into one cell
  const displayedYears: Set<string> = new Set();

  return (
    <div>
      {/* Replace old TableTitle with a simple heading (or your own styling) */}
      <h2 className="text-xl font-bold mb-2">Season Statistics</h2>

      {/* Use TableContainer to wrap everything, applying background/text color */}
      <TableContainer>
        <Table>
          {/* TableHead replaces <thead> */}
          <TableHead className="filter brightness-90">
            <TableRow>
              <TableCell isHeader align="left">S</TableCell>
              <TableCell isHeader align="left">Team</TableCell>
              <TableCell isHeader align="left">League</TableCell>
              <TableCell isHeader align="center">GP</TableCell>

              {playerType === "GOALTENDER" ? (
                <>
                  <TableCell isHeader align="center">GAA</TableCell>
                  <TableCell isHeader align="center">SV%</TableCell>
                  <TableCell isHeader align="center">SO</TableCell>
                </>
              ) : (
                <>
                  <TableCell isHeader align="center">G</TableCell>
                  <TableCell isHeader align="center">A</TableCell>
                  <TableCell isHeader align="center">TP</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>

          {/* TableBody replaces <tbody> */}
          <TableBody>
            {seasons.map((season, index) => {
              // Only show the season year the first time it appears
              const isYearDisplayed = displayedYears.has(season.season);
              if (!isYearDisplayed) {
                displayedYears.add(season.season);
              }

              return (
                // TableRow replaces <tr>
                <TableRow
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  {/* If we've seen this season year before, show an empty cell */}
                  <TableCell align="left">
                    {isYearDisplayed ? "" : season.season}
                  </TableCell>

                  {/* Team name (optionally use your custom Link) */}
                  <TableCell align="left">
                    <Link
                      href={`https://www.eliteprospects.com/team/${season.teamId}/${encodeURIComponent(
                        season.teamName
                      )}/${season.season}`}
                    >
                      {season.teamName}
                    </Link>
                  </TableCell>

                  {/* League (again optionally a custom Link) */}
                  <TableCell align="left">
                    <Link
                      href={`https://www.eliteprospects.com/league/${season.league}/stats/${season.season}`}
                    >
                      {season.league}
                    </Link>
                  </TableCell>

                  {/* Games Played */}
                  <TableCell align="center">{season.gamesPlayed}</TableCell>

                  {/* Conditional columns for goalie vs. skater */}
                  {playerType === "GOALTENDER" ? (
                    <>
                      <TableCell align="center">
                        {season.goalsAgainstAverage ?? "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {season.savePercentage ?? "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {season.shutouts ?? 0}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell align="center">{season.goals ?? 0}</TableCell>
                      <TableCell align="center">{season.assists ?? 0}</TableCell>
                      <TableCell align="center">{season.points ?? 0}</TableCell>
                    </>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <PoweredBy/>
    </div>
  );
};

export default SeasonsTable;
