"use client";

import React from "react";
import Image from "next/image";
import { RosterPlayer } from "@/app/types/team";
import { TableContainer, Table,TableHead,TableBody,TableRow,TableCell,Link } from "@/app/components/common/style";


// Utility function for age calculation
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

const RosterTable: React.FC<RosterTableProps> = ({
  roster,
  backgroundColor = "#FFFFFF",
  textColor = "#000000",
}) => {
  if (!roster || roster.length === 0) {
    return <p>{"No Roster"}</p>;
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

  // Renders one player's row
  const renderPlayerRow = (player: RosterPlayer, index: number) => (
    <TableRow key={player.id} 
    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
    >
      <TableCell align="left">#{player.jerseyNumber}</TableCell>
      <TableCell align="left">
        {player.flagUrl && (
          <Image
            src={player.flagUrl}
            alt="Flag"
            width={18}
            height={12}
            className="inline-block mr-2"
          />
        )}
        <Link
          href={`https://www.eliteprospects.com/player/${player.id}/${player.firstName} ${player.lastName}`}
        >
          {`${player.firstName} ${player.lastName} (${player.position})`}
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

  // Renders a header row for a position group (e.g. "GOALTENDERS")
  const renderPositionHeader = (label: string) => (
    <TableRow>
      <TableCell
        className="bg-blue-200 text-left px-2 py-1 font-bold uppercase"
      >
        {label}
      </TableCell>
    </TableRow>
  );

  return (
    <TableContainer>
      <Table className="table-auto border-collapse border border-gray-300 w-full text-sm">
        {/* TableHead replaces <thead> */}
        <TableHead className="bg-blue-600">
          <TableRow>
            <TableCell isHeader align="left">#</TableCell>
            <TableCell isHeader align="left">PLAYER</TableCell>
            <TableCell isHeader align="center">A</TableCell>
            <TableCell isHeader align="center">BORN</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {goaltenders.length > 0 && (
            <>
              {renderPositionHeader("Goaltenders")}
              {goaltenders.map(renderPlayerRow)}
            </>
          )}
          {defensemen.length > 0 && (
            <>
              {renderPositionHeader("Defensemen")}
              {defensemen.map(renderPlayerRow)}
            </>
          )}
          {forwards.length > 0 && (
            <>
              {renderPositionHeader("Forwards")}
              {forwards.map(renderPlayerRow)}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RosterTable;
