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
  statsType?: "regular" | "postseason";
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
  statsType = "regular",
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

  // Helper function to get the correct stats based on statsType
  const getPlayerStats = (player: RosterPlayer) => {
    return statsType === "postseason"
      ? player.stats?.postseason
      : player.stats?.regular;
  };

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
            case "games":
              res =
                (getPlayerStats(a)?.gamesPlayed || 0) -
                (getPlayerStats(b)?.gamesPlayed || 0);
              break;
            case "goals":
              res =
                (getPlayerStats(a)?.goals || 0) -
                (getPlayerStats(b)?.goals || 0);
              break;
            case "assists":
              res =
                (getPlayerStats(a)?.assists || 0) -
                (getPlayerStats(b)?.assists || 0);
              break;
            case "points":
              res =
                (getPlayerStats(a)?.points || 0) -
                (getPlayerStats(b)?.points || 0);
              break;
            default:
              break;
          }
          return sortDirection === "asc" ? res : -res;
        });

  const isCustomColor =
    customColors.tableBackgroundColor.toLowerCase() !== "#ffffff" &&
    customColors.tableBackgroundColor.toLowerCase() !== "#fff";

  // Determine visible columns for header
  const visibleColumns = [];
  if (selectedColumns.number) visibleColumns.push("number");
  visibleColumns.push("name");
  if (selectedColumns.age) visibleColumns.push("age");
  if (selectedColumns.birthYear) visibleColumns.push("birthYear");
  if (selectedColumns.birthPlace) visibleColumns.push("birthPlace");
  if (selectedColumns.weight) visibleColumns.push("weight");
  if (selectedColumns.height) visibleColumns.push("height");
  if (selectedColumns.shootsCatches) visibleColumns.push("shootsCatches");
  if (selectedColumns.games) visibleColumns.push("games");
  if (selectedColumns.goals) visibleColumns.push("goals");
  if (selectedColumns.assists) visibleColumns.push("assists");
  if (selectedColumns.points) visibleColumns.push("points");

  // Check if any stats columns are visible
  const hasStatColumns =
    selectedColumns.games ||
    selectedColumns.goals ||
    selectedColumns.assists ||
    selectedColumns.points;

  const renderPlayerRow = (player: RosterPlayer, index: number) => {
    const playerStats = getPlayerStats(player);

    return (
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
          <TableCell align="center">
            {calculateAge(player.dateOfBirth)}
          </TableCell>
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
          <TableCell align="center">
            {player.height ? `${player.height} cm` : "-"}
          </TableCell>
        )}
        {selectedColumns.shootsCatches && (
          <TableCell align="center">
            {player.position === "G" ? player.catches : player.shoots}
          </TableCell>
        )}
        {selectedColumns.games && (
          <TableCell align="center">
            {player.position === "G" ? "-" : playerStats?.gamesPlayed || 0}
          </TableCell>
        )}
        {selectedColumns.goals && (
          <TableCell align="center">
            {player.position === "G" ? "-" : playerStats?.goals || 0}
          </TableCell>
        )}
        {selectedColumns.assists && (
          <TableCell align="center">
            {player.position === "G" ? "-" : playerStats?.assists || 0}
          </TableCell>
        )}
        {selectedColumns.points && (
          <TableCell align="center">
            {player.position === "G" ? "-" : playerStats?.points || 0}
          </TableCell>
        )}
      </TableRow>
    );
  };

  return (
    <div>
      <TableContainer>
        <Table
          tableBgColor={customColors.tableBackgroundColor}
          tableTextColor={customColors.textColor}
        >
          <TableHead
            bgColor={customColors.backgroundColor}
            textColor={customColors.headerTextColor}
          >
            <TableRow key="header-row" bgColor={customColors.backgroundColor}>
              {visibleColumns.map((col) => (
                <TableCell
                  key={`header-${col}`}
                  isHeader
                  align={
                    col === "name" || col === "birthPlace" ? "left" : "center"
                  }
                  className="cursor-pointer"
                  onClick={() => handleSort(col as SortKey)}
                >
                  <span>
                    {
                      COLUMN_DISPLAY_NAMES[
                        col as keyof typeof COLUMN_DISPLAY_NAMES
                      ]
                    }
                  </span>{" "}
                  {renderSortArrow(col as SortKey)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPlayers.map((player, index) =>
              renderPlayerRow(player, index)
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PoweredBy />
    </div>
  );
};

export default RosterTable;
