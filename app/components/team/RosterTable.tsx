"use client";
import React from "react";
import Image from "next/image";
import { RosterPlayer } from "@/app/types/team";

interface RosterTableProps {
  roster: RosterPlayer[];
  backgroundColor?: string;
}

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

const RosterTable: React.FC<RosterTableProps> = ({ roster, backgroundColor }) => {
  if (!roster || roster.length === 0) {
    return <p>{"No Roster"}</p>;
  }

  // Group players into Goaltenders, Defensemen, and Forwards
  const goaltenders = roster.filter((player) => player.position === "G").sort((a, b) => +a.jerseyNumber - +b.jerseyNumber);
  const defensemen = roster.filter((player) => player.position === "D").sort((a, b) => +a.jerseyNumber - +b.jerseyNumber);
  const forwards = roster
    .filter((player) => player.position !== "G" && player.position !== "D")
    .sort((a, b) => +a.jerseyNumber - +b.jerseyNumber);

  const renderPlayerRow = (player: RosterPlayer, index: number) => (
    <tr key={player.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
      <td className="border border-gray-300 px-2 py-1 text-center">#{player.jerseyNumber}</td>
      <td className="border border-gray-300 px-2 py-1 text-left">
        {player.flagUrl && (
          <Image
            src={player.flagUrl}
            alt="Flag"
            width={18}
            height={12}
            className="inline-block mr-2"
          />
        )}
        <a
          href={`https://www.eliteprospects.com/player/${player.id}/${player.firstName} ${player.lastName}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline hover:text-blue-800"
        >
          {`${player.firstName} ${player.lastName} (${player.position})`}
        </a>
      </td>
      <td className="border border-gray-300 px-2 py-1 text-center">{calculateAge(player.dateOfBirth)}</td>
      <td className="border border-gray-300 px-2 py-1 text-center">
        {player.dateOfBirth ? new Date(player.dateOfBirth).getFullYear() : "N/A"}
      </td>
    </tr>
  );

  return (
    <table
      className="table-auto border-collapse border border-gray-300 w-full text-sm"
      style={{ backgroundColor }}
    >
      <thead>
        <tr className="bg-blue-600 text-white">
          <th className="border border-gray-300 px-2 py-1 text-center">{"#"}</th>
          <th className="border border-gray-300 px-2 py-1 text-left">{"PLAYER"}</th>
          <th className="border border-gray-300 px-2 py-1 text-center">{"A"}</th>
          <th className="border border-gray-300 px-2 py-1 text-center">{"BORN"}</th>
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
              <td colSpan={4} className="bg-blue-200 text-left px-2 py-1 font-bold uppercase">
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
