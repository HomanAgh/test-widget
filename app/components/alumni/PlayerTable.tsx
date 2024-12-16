import React from 'react';
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
            <th className="border border-gray-300 px-4 py-2 text-left">Player ifiodfojiefojiefojieojiefojiefojiefojief</th>
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
