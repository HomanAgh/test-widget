import React from "react";
import { PlayerType, Goalie, Skater } from "@/app/types/player";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  PoweredBy,
} from "@/app/components/common/style";

const formatSavePercentage = (savePercentage: number | undefined): string => {
  if (savePercentage === undefined) return '.000';
  
  // Convert to string
  let svpString = savePercentage.toString();
  
  // If the value already contains a decimal point, we need to handle it differently
  if (svpString.includes('.')) {
    // Remove the decimal and ensure 3 digits
    svpString = svpString.replace('.', '');
    // Pad with zeros if needed
    while (svpString.length < 3) {
      svpString = '0' + svpString;
    }
    // If more than 3 digits, truncate to 3
    if (svpString.length > 3) {
      svpString = svpString.substring(0, 3);
    }
  } else {
    // Pad with leading zeros if needed for whole numbers
    while (svpString.length < 3) {
      svpString = '0' + svpString;
    }
  }
  
  // Insert decimal point at the beginning
  return '.' + svpString;
};

interface PlayerStatsTableProps {
  playerType: PlayerType;
  stats: Goalie | Skater;
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
}

const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({
  playerType,
  stats,
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  },
}) => {
  const isGoaltender = playerType === "GOALTENDER";
  const isCustomColor =
    customColors.tableBackgroundColor.toLowerCase() !== "#ffffff" &&
    customColors.tableBackgroundColor.toLowerCase() !== "#fff";

  return (
    <div className="max-w-md mx-auto rounded-lg -mt-4">
      {/* <h2
        className="text-xl font-bold mb-2 font-montserrat"
        style={{ color: customColors.textColor }}
      >
        Statistics
      </h2> */}
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
                GP
              </TableCell>
              {isGoaltender ? (
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
            <TableRow
              bgColor={
                isCustomColor ? customColors.tableBackgroundColor : "#F3F4F6"
              }
            >
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
                    {formatSavePercentage((stats as Goalie).savePercentage)}
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
      <PoweredBy />
    </div>
  );
};

export default PlayerStatsTable;
