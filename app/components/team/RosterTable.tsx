"use client";

import React, { useState } from "react";
import { RosterPlayer } from "@/app/types/team";
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
import {
  HiMiniChevronUpDown,
  HiMiniChevronUp,
  HiMiniChevronDown,
} from "react-icons/hi2";
import {
  TeamColumnOptions,
  DEFAULT_COLUMNS,
  SortKey,
  getPositionPriority,
  COLUMN_DISPLAY_NAMES,
} from "./TeamColumnDefinitions";

// Existing helper
const calculateAge = (dateOfBirth: string): number | "-" => {
  if (!dateOfBirth) return "-";
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthday =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());
  if (!hasHadBirthday) {
    age -= 1;
  }
  return age;
};

interface RosterTableProps {
  roster: RosterPlayer[];
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
  selectedColumns?: TeamColumnOptions;
}

const RosterTable: React.FC<RosterTableProps> = ({
  roster,
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  },
  selectedColumns = DEFAULT_COLUMNS,
}) => {
  const [sortColumn, setSortColumn] = useState<SortKey>("points");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(
    "desc"
  );

  if (!roster || roster.length === 0) {
    return <p>No Roster</p>;
  }

  // Filter out goalies if the excludeGoalies option is selected
  const filteredRoster = selectedColumns.excludeGoalies
    ? roster.filter((player) => player.position !== "G")
    : roster;

  if (filteredRoster.length === 0) {
    return <p>No players match the current filters</p>;
  }

  const handleSort = (col: SortKey) => {
    if (sortColumn === col) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : prev === "desc" ? "none" : "asc"
      );
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  };

  const renderSortArrow = (col: SortKey) => {
    if (sortColumn !== col) {
      return (
        <HiMiniChevronUpDown className="w-4 h-4 inline-block text-gray-300" />
      );
    }
    switch (sortDirection) {
      case "asc":
        return (
          <HiMiniChevronDown className="w-4 h-4 inline-block text-gray-300" />
        );
      case "desc":
        return (
          <HiMiniChevronUp className="w-4 h-4 inline-block text-gray-300" />
        );
      case "none":
      default:
        return (
          <HiMiniChevronUpDown className="w-4 h-4 inline-block text-gray-300" />
        );
    }
  };

  // Sort all players
  const sortedPlayers =
    sortDirection === "none"
      ? filteredRoster
      : [...filteredRoster].sort((a, b) => {
          let res = 0;
          switch (sortColumn) {
            case "number":
              res = +a.jerseyNumber - +b.jerseyNumber;
              break;
            case "player":
              res =
                a.firstName.localeCompare(b.firstName) ||
                a.lastName.localeCompare(b.lastName);
              break;
            case "position":
              res =
                getPositionPriority(a.position) -
                getPositionPriority(b.position);
              if (res === 0) {
                // If same position type, sort by jersey number
                res = +a.jerseyNumber - +b.jerseyNumber;
              }
              break;
            case "age": {
              const ageA = calculateAge(a.dateOfBirth);
              const ageB = calculateAge(b.dateOfBirth);
              res =
                (typeof ageA === "number" ? ageA : 0) -
                (typeof ageB === "number" ? ageB : 0);
              break;
            }
            case "birthYear": {
              const yearA = a.dateOfBirth
                ? new Date(a.dateOfBirth).getFullYear()
                : 0;
              const yearB = b.dateOfBirth
                ? new Date(b.dateOfBirth).getFullYear()
                : 0;
              res = yearA - yearB;
              break;
            }
            case "birthPlace":
              res = (a.placeOfBirth || "").localeCompare(b.placeOfBirth || "");
              break;
            case "weight":
              res = (parseFloat(a.weight) || 0) - (parseFloat(b.weight) || 0);
              break;
            case "height":
              res = (parseFloat(a.height) || 0) - (parseFloat(b.height) || 0);
              break;
            case "shootsCatches": {
              const statA = a.position === "G" ? a.catches : a.shoots;
              const statB = b.position === "G" ? b.catches : b.shoots;
              res = (statA || "").localeCompare(statB || "");
              break;
            }
            case "goals":
              res = (a.stats?.goals || 0) - (b.stats?.goals || 0);
              break;
            case "assists":
              res = (a.stats?.assists || 0) - (b.stats?.assists || 0);
              break;
            case "points":
              res = (a.stats?.points || 0) - (b.stats?.points || 0);
              break;
            default:
              break;
          }
          return sortDirection === "asc" ? res : -res;
        });

  const isCustomColor =
    customColors.tableBackgroundColor.toLowerCase() !== "#ffffff" &&
    customColors.tableBackgroundColor.toLowerCase() !== "#fff";

  const renderPlayerRow = (player: RosterPlayer, index: number) => (
    <TableRow
      key={player.id}
      bgColor={
        isCustomColor
          ? customColors.tableBackgroundColor
          : index % 2 === 0
          ? "#F3F4F6"
          : "#FFFFFF"
      }
    >
      {selectedColumns.number && (
        <TableCell align="center">{player.jerseyNumber || "-"}</TableCell>
      )}
      <TableCell align="left">
        {player.flagUrl && (
          <img
            src={player.flagUrl}
            alt="Flag"
            width={16}
            height={12}
            className="inline-block mr-2"
          />
        )}
        <Link
          href={`https://www.eliteprospects.com/player/${
            player.id
          }/${encodeURIComponent(player.firstName)}-${encodeURIComponent(
            player.lastName
          )}`}
          style={{ color: customColors.nameTextColor }}
        >
          {player.firstName} {player.lastName}{" "}
          {selectedColumns.position && `(${player.position})`}{" "}
          {player.playerRole &&
            player.playerRole !== null &&
            ` "${player.playerRole}"`}
        </Link>
      </TableCell>
      {selectedColumns.age && (
        <TableCell align="center">{calculateAge(player.dateOfBirth)}</TableCell>
      )}
      {selectedColumns.birthYear && (
        <TableCell align="center">
          {player.dateOfBirth
            ? new Date(player.dateOfBirth).getFullYear()
            : "N/A"}
        </TableCell>
      )}
      {selectedColumns.birthPlace && (
        <TableCell align="center">{player.placeOfBirth}</TableCell>
      )}
      {selectedColumns.weight && (
        <TableCell align="center">{player.weight} kg</TableCell>
      )}
      {selectedColumns.height && (
        <TableCell align="center">{player.height} cm</TableCell>
      )}
      {selectedColumns.shootsCatches && (
        <TableCell align="center">
          {player.position === "G" ? player.catches : player.shoots}
        </TableCell>
      )}
      {selectedColumns.goals && (
        <TableCell align="center">
          {player.position === "G" ? "-" : player.stats?.goals || 0}
        </TableCell>
      )}
      {selectedColumns.assists && (
        <TableCell align="center">
          {player.position === "G" ? "-" : player.stats?.assists || 0}
        </TableCell>
      )}
      {selectedColumns.points && (
        <TableCell align="center">
          {player.position === "G" ? "-" : player.stats?.points || 0}
        </TableCell>
      )}
    </TableRow>
  );

  return (
    <>
      <TableContainer noBorder>
        <Table
          className="
          border-separate 
          border-spacing-0 
          w-full 
          rounded-lg
          border 
          border-customGrayMedium
        "
          tableBgColor={customColors.tableBackgroundColor}
          tableTextColor={customColors.textColor}
        >
          <TableHead
            bgColor={customColors.backgroundColor}
            textColor={customColors.headerTextColor}
          >
            <TableRow bgColor={customColors.backgroundColor}>
              {selectedColumns.number && (
                <TableCell
                  isHeader
                  align="left"
                  className={`${
                    !selectedColumns.number ? "rounded-tl-lg" : ""
                  } cursor-pointer`}
                  onClick={() => handleSort("number")}
                >
                  {COLUMN_DISPLAY_NAMES.number} {renderSortArrow("number")}
                </TableCell>
              )}
              <TableCell
                isHeader
                align="left"
                className={`${
                  !selectedColumns.number ? "rounded-tl-lg" : ""
                } cursor-pointer`}
                onClick={() => handleSort("player")}
              >
                PLAYER {renderSortArrow("player")}
              </TableCell>
              {selectedColumns.age && (
                <TableCell
                  isHeader
                  align="center"
                  className="cursor-pointer"
                  onClick={() => handleSort("age")}
                >
                  {COLUMN_DISPLAY_NAMES.age} {renderSortArrow("age")}
                </TableCell>
              )}
              {selectedColumns.birthYear && (
                <TableCell
                  isHeader
                  align="center"
                  className="cursor-pointer"
                  onClick={() => handleSort("birthYear")}
                >
                  BY {renderSortArrow("birthYear")}
                </TableCell>
              )}
              {selectedColumns.birthPlace && (
                <TableCell
                  isHeader
                  align="center"
                  className="cursor-pointer"
                  onClick={() => handleSort("birthPlace")}
                >
                  BIRTHPLACE {renderSortArrow("birthPlace")}
                </TableCell>
              )}
              {selectedColumns.weight && (
                <TableCell
                  isHeader
                  align="center"
                  className="cursor-pointer"
                  onClick={() => handleSort("weight")}
                >
                  {COLUMN_DISPLAY_NAMES.weight} {renderSortArrow("weight")}
                </TableCell>
              )}
              {selectedColumns.height && (
                <TableCell
                  isHeader
                  align="center"
                  className="cursor-pointer"
                  onClick={() => handleSort("height")}
                >
                  {COLUMN_DISPLAY_NAMES.height} {renderSortArrow("height")}
                </TableCell>
              )}
              {selectedColumns.shootsCatches && (
                <TableCell
                  isHeader
                  align="center"
                  className="cursor-pointer"
                  onClick={() => handleSort("shootsCatches")}
                >
                  {COLUMN_DISPLAY_NAMES.shootsCatches.charAt(0)}{" "}
                  {renderSortArrow("shootsCatches")}
                </TableCell>
              )}
              {selectedColumns.goals && (
                <TableCell
                  isHeader
                  align="center"
                  className="cursor-pointer"
                  onClick={() => handleSort("goals")}
                >
                  {COLUMN_DISPLAY_NAMES.goals} {renderSortArrow("goals")}
                </TableCell>
              )}
              {selectedColumns.assists && (
                <TableCell
                  isHeader
                  align="center"
                  className="cursor-pointer"
                  onClick={() => handleSort("assists")}
                >
                  {COLUMN_DISPLAY_NAMES.assists} {renderSortArrow("assists")}
                </TableCell>
              )}
              {selectedColumns.points && (
                <TableCell
                  isHeader
                  align="center"
                  className={`${
                    !selectedColumns.points ? "rounded-tr-lg" : ""
                  } cursor-pointer`}
                  onClick={() => handleSort("points")}
                >
                  {COLUMN_DISPLAY_NAMES.points} {renderSortArrow("points")}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>{sortedPlayers.map(renderPlayerRow)}</TableBody>
        </Table>
      </TableContainer>
      <PoweredBy />
    </>
  );
};

export default RosterTable;
