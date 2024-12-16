"use client";
import React from "react";

interface RosterTableProps {
  roster: any[];
  backgroundColor?: string;
}
//lol
const RosterTable: React.FC<RosterTableProps> = ({ roster, backgroundColor }) => {

  if (!roster || roster.length === 0) {
    return <p>{"No Roster"}</p>;
  }

  return (
    <table
      className="table-auto border-collapse border border-gray-300 w-full text-sm"
      style={{ backgroundColor }}
    >
      <thead>
        <tr className="bg-blue-600 text-white">
          <th className="border border-gray-300 px-2 py-1 text-center">{"#"}</th>
          <th className="border border-gray-300 px-2 py-1 text-left">{"Name"}</th>
          <th className="border border-gray-300 px-2 py-1 text-center">{"Position"}</th>
          <th className="border border-gray-300 px-2 py-1 text-center">{"JerseyNumber"}</th>
          <th className="border border-gray-300 px-2 py-1 text-center">{"Nationality"}</th>
        </tr>
      </thead>
      <tbody>
        {roster.map((player: any, index: number) => (
          <tr
            key={player.id || `player-${index}`}
            className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
          >
            <td className="border border-gray-300 px-2 py-1 text-center">{index + 1}</td>
            <td className="border border-gray-300 px-2 py-1 text-left">
              <a
                href={`https://www.eliteprospects.com/player/${player.id}/${player.firstName} ${player.lastName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {`${player.firstName} ${player.lastName}`}
              </a>
            </td>
            <td className="border border-gray-300 px-2 py-1 text-center">{player.position}</td>
            <td className="border border-gray-300 px-2 py-1 text-center">{player.jerseyNumber}</td>
            <td className="border border-gray-300 px-2 py-1 text-center">{player.nationality}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RosterTable;
