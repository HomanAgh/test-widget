import React from "react";
import { CareerStats } from "@/app/types/player";
import { TableContainer, Table,TableHead,TableBody,TableRow,TableCell,Link, PoweredBy } from "@/app/components/common/style";

interface PlayerCareerTableProps {
  careers: CareerStats[];
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
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6"
  }
}) => {
  const isGoaltender = careers[0]?.goalsAgainstAverage !== undefined;
  const isCustomColor =
    customColors.tableBackgroundColor.toLowerCase() !== "#ffffff" &&
    customColors.tableBackgroundColor.toLowerCase() !== "#fff";

  return (
    <div>
      <h2 className="text-xl font-bold mb-2" style={{ color: customColors.textColor }}>Career Statistics</h2>
      <TableContainer>
        <Table tableBgColor={customColors.tableBackgroundColor} tableTextColor={customColors.textColor}>
          <TableHead bgColor={customColors.backgroundColor} textColor={customColors.headerTextColor}>
            <TableRow bgColor={customColors.backgroundColor}>
              <TableCell isHeader align="left">League</TableCell>
              <TableCell isHeader align="center">Seasons</TableCell>
              <TableCell isHeader align="center">GP</TableCell>
              {isGoaltender ? (
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
                  <TableCell isHeader align="center">+/-</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {careers.map((career, index) => (
              <TableRow 
                key={career.league}
                bgColor={isCustomColor ? customColors.tableBackgroundColor : index % 2 === 0 ? "#F3F4F6" : "#FFFFFF"}
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
                    <TableCell align="center">{career.savePercentage}</TableCell>
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
      <PoweredBy/>
    </div>
  );
};

export default PlayerCareerTable;
