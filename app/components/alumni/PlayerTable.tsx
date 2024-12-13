import React from 'react';
import { AlumniPlayer } from '@/app/types/player';

interface PlayerTableProps {
  players: AlumniPlayer[];
}

/* const PlayerTable: React.FC<PlayerTableProps> = ({ players }) => {
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
}; */

/* const PlayerTable = ({ players }: { players: AlumniPlayer[] }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Player</th>
          <th>Birth Year</th>
          <th>Draft Pick</th>
          <th>Teams</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player) => (
          <tr key={player.id}>
            <td>{player.name}</td>
            <td>{player.birthYear}</td>
            <td>{player.draftPick}</td>
            <td>{player.teams || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}; */
const PlayerTable: React.FC<PlayerTableProps> = ({ players }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-zinc-800 text-white">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Player</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Birth Year</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Draft Pick</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Teams</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr
              key={player.id}
              className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
            >
              <td className="border border-gray-300 px-4 py-2">{player.name}</td>
              <td className="border border-gray-300 px-4 py-2">{player.birthYear}</td>
              <td className="border border-gray-300 px-4 py-2">{player.draftPick}</td>
              <td className="border border-gray-300 px-4 py-2">{player.teams}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default PlayerTable;
