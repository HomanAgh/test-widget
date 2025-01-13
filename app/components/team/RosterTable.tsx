"use client";

import React from "react";
import Image from "next/image";
import { RosterPlayer } from "@/app/types/team";
import Table from "../common/style/Table";
import TableHeader from "../common/style/TableHeader";
import Link from "../common/style/Link"; // Import the Link component

const calculateAge = (dateOfBirth: string): number | "N/A" => {
  if (!dateOfBirth) return "N/A";
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())
    ? age
    : age - 1;
};

const RosterTable: React.FC<{ roster: RosterPlayer[], backgroundColor?: string, textColor?: string }> = ({ 
  roster, 
  backgroundColor = "#FFFFFF",
  textColor = "#000000", 
}) => {
  if (!roster || roster.length === 0) {
    return <p>{"No Roster"}</p>;
  }

  // Group players into Goaltenders, Defensemen, and Forwards
  const goaltenders = roster.filter((player) => player.position === "G").sort((a, b) => +a.jerseyNumber - +b.jerseyNumber);
  const defensemen = roster.filter((player) => player.position === "D").sort((a, b) => +a.jerseyNumber - +b.jerseyNumber);
  const forwards = roster
    .filter((player) => player.position !== "G" && player.position !== "D")
    .sort((a, b) => +a.jerseyNumber - +b.jerseyNumber);

  const renderPlayerRow = (player: RosterPlayer) => (
    <tr key={player.id}>
      <Table align="center">#{player.jerseyNumber}</Table>
      <Table align="left">
        {player.flagUrl && (
          <Image
            src={player.flagUrl}
            alt="Flag"
            width={18}
            height={12}
            className="inline-block mr-2"
          />
        )}
        {/* Replace anchor tag with Link component */}
        <Link href={`https://www.eliteprospects.com/player/${player.id}/${player.firstName} ${player.lastName}`}>
          {`${player.firstName} ${player.lastName} (${player.position})`}
        </Link>
      </Table>
      <Table align="center">{calculateAge(player.dateOfBirth)}</Table>
      <Table align="center">{player.dateOfBirth ? new Date(player.dateOfBirth).getFullYear() : "N/A"}</Table>
    </tr>
  );

  return (
    <table
      className="table-auto border-collapse border border-gray-300 w-full text-sm"
      style={{ 
        backgroundColor,
        color: textColor, 
      }}
    >
      <thead >
        <tr className="bg-blue-600 text-white" style={{ color: textColor }}>
          <TableHeader align="center">{"#"}</TableHeader>
          <TableHeader align="left">{"PLAYER"}</TableHeader>
          <TableHeader align="center">{"A"}</TableHeader>
          <TableHeader align="center">{"BORN"}</TableHeader>
        </tr>
      </thead>
      <tbody>
        {/* GOALTENDERS */}
        {goaltenders.length > 0 && (
          <>
            <tr>
              <td colSpan={4} className="bg-blue-200 text-left px-2 py-1 font-bold uppercase">
                {"GOALTENDERS"}
              </td>
            </tr>
            {goaltenders.map(renderPlayerRow)}
          </>
        )}

        {/* DEFENSEMEN */}
        {defensemen.length > 0 && (
          <>
            <tr>
              <td colSpan={4} className="bg-blue-200 text-left px-2 py-1 font-bold uppercase">
                {"DEFENSEMEN"}
              </td>
            </tr>
            {defensemen.map(renderPlayerRow)}
          </>
        )}

        {/* FORWARDS */}
        {forwards.length > 0 && (
          <>
            <tr>
              <td colSpan={4} className="bg-blue-200 text-left px-2 py-1 font-bold uppercase" >
                {"FORWARDS"}
              </td>
            </tr>
            {forwards.map(renderPlayerRow)}
          </>
        )}
      </tbody>
    </table>
  );
};

export default RosterTable;
