"use client";

import React, { useState, CSSProperties } from "react";
import Image from "next/image";
import { RosterPlayer } from "@/app/types/team";

// 1) Import the icons from react-icons
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

// Example styled components from your code
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
} from "@/app/components/common/style";

/**
 * Utility function for age calculation
 */
const calculateAge = (dateOfBirth: string): number | "-" => {
  if (!dateOfBirth) return "-";
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  // Decrement age if the birth month/day hasn't been reached yet this year
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
  backgroundColor?: string;
  textColor?: string;
}

const collapsibleContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "24px",
  paddingBottom: "12px",
  alignSelf: "stretch",
};

type SectionKey = "goaltenders" | "defensemen" | "forwards";

const RosterTable: React.FC<RosterTableProps> = ({
  roster,
  backgroundColor = "#FFFFFF",
  textColor = "#000000",
}) => {
  // Early return if no roster
  if (!roster || roster.length === 0) {
    return <p>No Roster</p>;
  }

  // Group players by position
  const goaltenders = roster
    .filter((player) => player.position === "G")
    .sort((a, b) => +a.jerseyNumber - +b.jerseyNumber);

  const defensemen = roster
    .filter((player) => player.position === "D")
    .sort((a, b) => +a.jerseyNumber - +b.jerseyNumber);

  const forwards = roster
    .filter((player) => player.position !== "G" && player.position !== "D")
    .sort((a, b) => +a.jerseyNumber - +b.jerseyNumber);

  // Track open/closed state per section
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    goaltenders: false,
    defensemen: false,
    forwards: false,
  });

  // Toggle a section by key
  const toggleSection = (section: SectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Renders a single player's row
  const renderPlayerRow = (player: RosterPlayer, index: number) => (
    <TableRow
      key={player.id}
      className={
        (index % 2 === 0 ? "bg-gray-100" : "bg-white") 
      
      }
    >
      <TableCell align="left">#{player.jerseyNumber}</TableCell>
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
        >
          {player.firstName} {player.lastName} ({player.position})
        </Link>
      </TableCell>
      <TableCell align="center">{calculateAge(player.dateOfBirth)}</TableCell>
      <TableCell align="center">
        {player.dateOfBirth
          ? new Date(player.dateOfBirth).getFullYear()
          : "N/A"}
      </TableCell>
    </TableRow>
  );

  /**
   * Renders a collapsible block for a given position group.
   * - "title": string for the label (e.g. "Goaltenders")
   * - "sectionKey": used to toggle open/closed
   * - "players": array of players for that position
   */
  const renderCollapsibleSection = (
    title: string,
    sectionKey: SectionKey,
    players: RosterPlayer[]
  ) => {
    if (players.length === 0) return null; // skip if no players in that group

    const isOpen = openSections[sectionKey];

    return (
      <div key={sectionKey} style={collapsibleContainerStyle}>
        {/* The "header" row that toggles the section */}
        <div
          onClick={() => toggleSection(sectionKey)}
           className="cursor-pointer flex items-center gap-2 border-b border-gray-300 pb-[24px] w-full"
        >
          <span className="font-bold uppercase">{title}</span>
          {/* 2) Use FaChevronUp and FaChevronDown */}
          {isOpen ? (
            <FaChevronUp className="w-4 h-4" />
          ) : (
            <FaChevronDown className="w-4 h-4" />
          )}
        </div>

       
        {isOpen && (
          <Table
          className="
            border-separate 
            border-spacing-0 
            w-full 
            rounded-lg
            border 
            border-customGrayMedium
          "
        >
          <TableHead className="bg-blue-600 text-white">
            <TableRow>
              <TableCell isHeader align="left" className="rounded-tl-lg">#</TableCell>
              <TableCell isHeader align="left">PLAYER</TableCell>
              <TableCell isHeader align="center">A</TableCell>
              <TableCell isHeader align="center" className="rounded-tr-lg">BY</TableCell>
            </TableRow>
          </TableHead>
            <TableBody>{players.map(renderPlayerRow)}</TableBody>
          </Table>
        )}
      </div>
    );
  };

  return (
    <>
    <TableContainer noBorder>
      {renderCollapsibleSection("Goaltenders", "goaltenders", goaltenders)}
      {renderCollapsibleSection("Defensemen", "defensemen", defensemen)}
      {renderCollapsibleSection("Forwards", "forwards", forwards)}
    </TableContainer>
    <div className="flex flex-col items-center justify-center mt-4">
      <div className="flex items-center space-x-1">
        <span className="text-[12px] font-montserrat font-medium text-black lowercase">
          powered by
        </span>
        <a
          href="https://www.eliteprospects.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="h-[14px] w-[97.075px] cursor-pointer"
            alt="EliteProspects"
            src="/images/Group.svg"
            width={97.075}
            height={14}
          />
        </a>
      </div>
    </div>
  </>
  );
};

export default RosterTable;
