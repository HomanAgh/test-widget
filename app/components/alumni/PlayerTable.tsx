/* import React from 'react';
import { AlumniPlayer } from '@/app/types/player';

interface PlayerTableProps {
  players: AlumniPlayer[];
}

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
 */

import React from 'react';
import { AlumniPlayer } from '@/app/types/player';

interface PlayerTableProps {
  players: AlumniPlayer[];
}

const PlayerTable: React.FC<PlayerTableProps> = ({ players }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
      <table className="min-w-full table-auto border-collapse">
        {/* Table Header */}
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider">
              Player
            </th>
            <th className="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider">
              Birth Year
            </th>
            <th className="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider">
              Draft Pick
            </th>
            <th className="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider">
              Teams
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-200">
          {players.map((player, index) => (
            <tr key={player.id} className="hover:bg-gray-100">
              <td className="px-6 py-4 text-center text-gray-800">
                {player.name}
              </td>
              <td className="px-6 py-4 text-center text-gray-800">
                {player.birthYear}
              </td>
              <td className="px-6 py-4 text-center text-gray-800">
                {player.draftPick || 'N/A'}
              </td>
              <td className="px-6 py-4 text-center text-gray-800">
                {Array.isArray(player.teams)
                  ? player.teams.join(', ')
                  : player.teams || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable;
