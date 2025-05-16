import React, { useState } from "react";
import { PlayerType, SeasonStats } from "@/app/types/player";
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
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { formatSavePercentage } from '@/app/utils/formatSVP';
interface PlayerSeasonsTableProps {
  playerType: PlayerType;
  seasons: SeasonStats[];
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
}

const PlayerSeasonsTable: React.FC<PlayerSeasonsTableProps> = ({
  playerType,
  seasons,
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  },
}) => {
  const [showAllSeasons, setShowAllSeasons] = useState(false);
  const isGoaltender = playerType === "GOALTENDER";
  const isCustomColor =
    customColors.tableBackgroundColor.toLowerCase() !== "#ffffff" &&
    customColors.tableBackgroundColor.toLowerCase() !== "#fff";

  // Sort seasons by most recent first (assuming season format is "YYYY-YYYY")
  const sortedSeasons = [...seasons].sort((a, b) => {
    const yearA = parseInt(a.season.split("-")[0]);
    const yearB = parseInt(b.season.split("-")[0]);
    return yearB - yearA;
  });

  const displayedSeasons = showAllSeasons
    ? sortedSeasons
    : sortedSeasons.slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto rounded-lg -mt-4">
      {/* <h2
        className="max-w-lgtext-xl font-bold mb-2 font-montserrat"
        style={{ color: customColors.textColor }}
      >
        Seasons
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
                Season
              </TableCell>
              <TableCell isHeader align="left">
                Team
              </TableCell>
              <TableCell isHeader align="left">
                League
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
            {displayedSeasons.map((season, index) => (
              <TableRow
                key={`${season.season}-${season.teamId}`}
                bgColor={
                  isCustomColor
                    ? customColors.tableBackgroundColor
                    : index % 2 === 0
                    ? "#F3F4F6"
                    : "#FFFFFF"
                }
              >
                <TableCell align="left">{season.season}</TableCell>
                <TableCell align="left">
                  <Link
                    href={`https://www.eliteprospects.com/team/${season.teamId}/${season.teamName}`}
                    style={{ color: customColors.nameTextColor }}
                  >
                    {season.teamName}
                  </Link>
                </TableCell>
                <TableCell align="left">{season.league}</TableCell>
                <TableCell align="center">{season.gamesPlayed}</TableCell>
                {isGoaltender ? (
                  <>
                    <TableCell align="center"> {season.goalsAgainstAverage}</TableCell>
                    <TableCell align="center">{formatSavePercentage(season.savePercentage)}</TableCell>
                    <TableCell align="center">{season.shutouts}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell align="center">{season.goals}</TableCell>
                    <TableCell align="center">{season.assists}</TableCell>
                    <TableCell align="center">{season.points}</TableCell>
                    <TableCell align="center">{season.plusMinus}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {seasons.length > 3 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowAllSeasons(!showAllSeasons)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors font-montserrat"
            style={{
              backgroundColor: customColors.backgroundColor,
              color: customColors.headerTextColor,
            }}
          >
            {showAllSeasons ? (
              <>
                Show Less <FaChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show All Seasons <FaChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
      <PoweredBy />
    </div>
  );
};

export default PlayerSeasonsTable;
