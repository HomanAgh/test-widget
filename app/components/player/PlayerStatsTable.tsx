import React from "react";
import { PlayerType, Goalie, Skater } from "@/app/types/player";
import { TableContainer, Table,TableHead,TableBody,TableRow,TableCell } from "@/app/components/common/style";

interface PlayerStatsTableProps {
  playerType: PlayerType;
  stats: Goalie | Skater;
  backgroundColor?: string;
  textColor?: string;
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
      {/* Replace your old TableTitle with a simple heading or your new Title component */}
      <h2 className="text-xl font-bold mb-2">Statistics</h2>

      {/* TableContainer replaces TableWrapper, applying your background/text colors */}
      <TableContainer>
        {/* Table replaces the <table> tag */}
        <Table>
          {/* TableHead replaces <thead> */}
          <TableHead className="filter brightness-90">
            <TableRow>
              {/* TableCell with isHeader replaces TableHeader */}
              <TableCell isHeader align="center">GP</TableCell>
              {isGoaltender ? (
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

          {/* TableBody replaces <tbody> */}
          <TableBody>
            {/* One row showing either goalie stats or skater stats */}
            <TableRow>
              <TableCell align="center">
                {(stats as Goalie).gamesPlayed}
              </TableCell>
              {isGoaltender ? (
                <>
                  <TableCell align="center">
                    {(stats as Goalie).goalsAgainst}
                  </TableCell>
                  <TableCell align="center">
                    {(stats as Goalie).shotsAgainst}
                  </TableCell>
                  <TableCell align="center">
                    {(stats as Goalie).saves}
                  </TableCell>
                  <TableCell align="center">
                    {((stats as Goalie).savePercentage || 0).toFixed(2)}%
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell align="center">
                    {(stats as Skater).goals}
                  </TableCell>
                  <TableCell align="center">
                    {(stats as Skater).assists}
                  </TableCell>
                  <TableCell align="center">
                    {(stats as Skater).points}
                  </TableCell>
                  <TableCell align="center">
                    {(stats as Skater).plusMinusRating}
                  </TableCell>
                </>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PlayerStatsTable;
