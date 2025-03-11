"use client";

import React, { useState } from "react";
import Image from "next/image";
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
import { HiMiniChevronUpDown, HiMiniChevronUp, HiMiniChevronDown } from "react-icons/hi2";

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
}

type SortKey =
  | "number"
  | "player"
  | "position"
  | "age"
  | "birthYear"
  | "birthPlace"
  | "weight"
  | "height"
  | "shootOrCatch";

// Helper function to get position priority (goaltenders first)
const getPositionPriority = (position: string): number => {
  if (position === "G") return 1;
  if (position === "D") return 2;
  return 3; // Forwards
};

const RosterTable: React.FC<RosterTableProps> = ({ 
  roster,
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6"
  }
}) => {
  const [sortColumn, setSortColumn] = useState<SortKey>("position");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">("asc");

  if (!roster || roster.length === 0) {
    return <p>No Roster</p>;
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
      return <HiMiniChevronUpDown className="w-4 h-4 inline-block text-gray-300" />;
    }
    switch (sortDirection) {
      case "asc":
        return <HiMiniChevronDown className="w-4 h-4 inline-block text-gray-300" />;
      case "desc":
        return <HiMiniChevronUp className="w-4 h-4 inline-block text-gray-300" />;
      case "none":
      default:
        return <HiMiniChevronUpDown className="w-4 h-4 inline-block text-gray-300" />;
    }
  };
  
  // Sort all players
  const sortedPlayers = sortDirection === "none" ? roster : [...roster].sort((a, b) => {
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
        res = getPositionPriority(a.position) - getPositionPriority(b.position);
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
        const yearA = a.dateOfBirth ? new Date(a.dateOfBirth).getFullYear() : 0;
        const yearB = b.dateOfBirth ? new Date(b.dateOfBirth).getFullYear() : 0;
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
      case "shootOrCatch": {
        const statA = a.position === "G" ? a.catches : a.shoots;
        const statB = b.position === "G" ? b.catches : b.shoots;
        res = (statA || "").localeCompare(statB || "");
        break;
      }
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
      bgColor={isCustomColor ? customColors.tableBackgroundColor : index % 2 === 0 ? "#F3F4F6" : "#FFFFFF"}
    >
      <TableCell align="center">{player.jerseyNumber || "-"}</TableCell>
      <TableCell align="left">
        {player.flagUrl && (
          <Image
            src={player.flagUrl}
            alt="Flag"
            width={16}
            height={12}
            className="inline-block mr-2"
          />
        )}
        <Link 
          href={`https://www.eliteprospects.com/player/${player.id}/${encodeURIComponent(
            player.firstName
          )}-${encodeURIComponent(player.lastName)}`}
          style={{ color: customColors.nameTextColor }}
        >
          {player.firstName} {player.lastName} ({player.position}){" "}
          {player.playerRole &&
            player.playerRole !== null &&
            ` "${player.playerRole}"`}
        </Link>
      </TableCell>
      <TableCell align="center">{calculateAge(player.dateOfBirth)}</TableCell>
      <TableCell align="center">
        {player.dateOfBirth
          ? new Date(player.dateOfBirth).getFullYear()
          : "N/A"}
      </TableCell>
      <TableCell align="center">{player.placeOfBirth}</TableCell>
      <TableCell align="center">{player.weight} kg</TableCell>
      <TableCell align="center">{player.height} cm</TableCell>
      <TableCell align="center">
        {player.position === "G" ? player.catches : player.shoots}
      </TableCell>
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
          <TableHead bgColor={customColors.backgroundColor} textColor={customColors.headerTextColor}>
            <TableRow bgColor={customColors.backgroundColor}>
              <TableCell
                isHeader
                align="left"
                className="rounded-tl-lg cursor-pointer"
                onClick={() => handleSort("number")}
              >
                # {renderSortArrow("number")}
              </TableCell>
              <TableCell
                isHeader
                align="left"
                className="cursor-pointer"
                onClick={() => handleSort("player")}
              >
                PLAYER {renderSortArrow("player")}
              </TableCell>
              <TableCell
                isHeader
                align="center"
                className="cursor-pointer"
                onClick={() => handleSort("age")}
              >
                A {renderSortArrow("age")}
              </TableCell>
              <TableCell
                isHeader
                align="center"
                className="cursor-pointer"
                onClick={() => handleSort("birthYear")}
              >
                BY {renderSortArrow("birthYear")}
              </TableCell>
              <TableCell
                isHeader
                align="center"
                className="cursor-pointer"
                onClick={() => handleSort("birthPlace")}
              >
                BIRTHPLACE {renderSortArrow("birthPlace")}
              </TableCell>
              <TableCell
                isHeader
                align="center"
                className="cursor-pointer"
                onClick={() => handleSort("weight")}
              >
                WT {renderSortArrow("weight")}
              </TableCell>
              <TableCell
                isHeader
                align="center"
                className="cursor-pointer"
                onClick={() => handleSort("height")}
              >
                HT {renderSortArrow("height")}
              </TableCell>
              <TableCell
                isHeader
                align="center"
                className="rounded-tr-lg cursor-pointer"
                onClick={() => handleSort("shootOrCatch")}
              >
                S {renderSortArrow("shootOrCatch")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPlayers.map(renderPlayerRow)}
          </TableBody>
        </Table>
      </TableContainer>
      <PoweredBy />
    </>
  );
};

export default RosterTable;