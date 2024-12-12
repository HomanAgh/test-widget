/* import React from "react";

interface Player {
  name: string;
  birthYear: number;
  juniorTeam?: string;
  collegeTeam?: string;
  proTeam?: string;
}

interface PlayerTableProps {
  players: Player[];
}

const PlayerTable: React.FC<PlayerTableProps> = ({ players }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-zinc-800 text-white">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">PLAYER</th>
            <th className="border border-gray-300 px-4 py-2 text-left">BIRTH YEAR</th>
            <th className="border border-gray-300 px-4 py-2 text-left">JUNIOR</th>
            <th className="border border-gray-300 px-4 py-2 text-left">COLLEGE</th>
            <th className="border border-gray-300 px-4 py-2 text-left">PRO</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="border border-gray-300 px-4 py-2">
                {player.name || "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {player.birthYear || "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {player.juniorTeam || "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {player.collegeTeam || "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {player.proTeam || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable;


 */

/* import React from "react";

interface Player {
  name: string;
  birthYear: number;
}

interface PlayerTableProps {
  players: Player[];
}

const PlayerTable: React.FC<PlayerTableProps> = ({ players }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-zinc-800 text-white">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">PLAYER</th>
            <th className="border border-gray-300 px-4 py-2 text-left">BIRTH YEAR</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="border border-gray-300 px-4 py-2">{player.name || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">{player.birthYear || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable; */

import React from 'react';

interface Player {
  name: string;
  birthYear: number;
  draftPick?: string; // New column for draft pick
}

interface PlayerTableProps {
  players: Player[];
}

const PlayerTable: React.FC<PlayerTableProps> = ({ players }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-zinc-800 text-white">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">PLAYER</th>
            <th className="border border-gray-300 px-4 py-2 text-left">BIRTH YEAR</th>
            <th className="border border-gray-300 px-4 py-2 text-left">DRAFT PICK</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="border border-gray-300 px-4 py-2">{player.name || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">{player.birthYear || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">
                {player.draftPick !== "N/A"
                  ? player.draftPick
                  : <span className="text-gray-500 italic">Not Drafted</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable;
