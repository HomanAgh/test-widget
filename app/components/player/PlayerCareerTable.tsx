import React from "react";
import { CareerStats, PlayerType } from "@/app/types/player";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  PoweredBy,
} from "@/app/components/common/style";

// Format save percentage to display as .XXX
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

interface PlayerCareerTableProps {
  careers: CareerStats[];
  playerType: PlayerType;
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
}

const PlayerCareerTable: React.FC<PlayerCareerTableProps> = ({
  careers,
  playerType,
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
    <div className="max-w-lg mx-auto rounded-lg -mt-4">
      {/* <h2
        className="text-xl font-bold mb-2 font-montserrat"
        style={{ color: customColors.textColor }}
      >
        Career Statistics
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
              <TableCell isHeader align="left">
                League
              </TableCell>
              <TableCell isHeader align="center">
                Seasons
              </TableCell>
              <TableCell isHeader align="center">
                GP
              </TableCell>
              {isGoaltender ? (
                <>
                  <TableCell isHeader align="center">
                    GAA
                  </TableCell>
                  <TableCell isHeader align="center">
                    SV%
                  </TableCell>
                  <TableCell isHeader align="center">
                    SO
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
            {careers.map((career, index) => (
              <TableRow
                key={career.league}
                bgColor={
                  isCustomColor
                    ? customColors.tableBackgroundColor
                    : index % 2 === 0
                    ? "#F3F4F6"
                    : "#FFFFFF"
                }
              >
                <TableCell align="left">
                  <Link
                    href={`https://www.eliteprospects.com/league/${career.league}`}
                    style={{ color: customColors.nameTextColor }}
                  >
                    {career.league}
                  </Link>
                </TableCell>
                <TableCell align="center">{career.numberOfSeasons}</TableCell>
                <TableCell align="center">{career.gamesPlayed}</TableCell>
                {isGoaltender ? (
                  <>
                    <TableCell align="center">{career.goalsAgainstAverage}</TableCell>
                    <TableCell align="center">{formatSavePercentage(career.savePercentage)}</TableCell>
                    <TableCell align="center">{career.shutouts}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell align="center">{career.goals}</TableCell>
                    <TableCell align="center">{career.assists}</TableCell>
                    <TableCell align="center">{career.points}</TableCell>
                    <TableCell align="center">{career.plusMinus}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PoweredBy />
    </div>
  );
};

export default PlayerCareerTable;
