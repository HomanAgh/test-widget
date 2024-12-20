/* import React from 'react';
import { AlumniPlayer } from '@/app/types/player';

interface PlayerTableProps {
  players: AlumniPlayer[];
  teamColors?: string[]; // Prop to receive team colors
}

const PlayerTable: React.FC<PlayerTableProps> = ({ players, teamColors }) => {
  const backgroundColor = teamColors?.[0] || 'white'; // Second color for row backgrounds
  const textColor = teamColors?.[1] || 'black'; // Third color for text

  return (
    <div
      className="overflow-x-auto bg-white shadow-lg rounded-lg"
      style={{
        padding: '1rem', // Single padding applied
        backgroundColor: teamColors?.[2] || 'white', // Outer container background color
      }}
    >
      <table className="min-w-full table-auto border-collapse">
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

        <tbody className="divide-y divide-gray-200">
          {players.map((player, index) => (
            <tr
              key={player.id}
              style={{
                backgroundColor, // Row background color
                color: textColor, // Row text color
              }}
            >
              <td className="px-6 py-4 text-center">{player.name}</td>
              <td className="px-6 py-4 text-center">{player.birthYear}</td>
              <td className="px-6 py-4 text-center">{player.draftPick || 'N/A'}</td>
              <td className="px-6 py-4 text-center">
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



 */

import React from 'react';
import { AlumniPlayer } from '@/app/types/player';

interface PlayerTableProps {
  players: AlumniPlayer[];
  teamColors?: string[];
  hasMore: boolean; // Prop to track if there are more players
  fetchMore: () => void; // Function to fetch more players
}

const PlayerTable: React.FC<PlayerTableProps> = ({ players, teamColors, hasMore, fetchMore }) => {
  const backgroundColor = teamColors?.[0] || 'white';
  const textColor = teamColors?.[1] || 'black';

  return (
    <div
      className="overflow-x-auto bg-white shadow-lg rounded-lg"
      style={{
        padding: '1rem',
        backgroundColor: teamColors?.[2] || 'white',
      }}
    >
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider">Player</th>
            <th className="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider">Birth Year</th>
            <th className="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider">Draft Pick</th>
            <th className="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider">Teams</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {players.map((player) => (
            <tr
              key={player.id}
              style={{
                backgroundColor,
                color: textColor,
              }}
            >
              <td className="px-6 py-4 text-center">{player.name}</td>
              <td className="px-6 py-4 text-center">{player.birthYear}</td>
              <td className="px-6 py-4 text-center">{player.draftPick || 'N/A'}</td>
              <td className="px-6 py-4 text-center">
                {Array.isArray(player.teams) ? player.teams.join(', ') : player.teams || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {hasMore && (
        <button
          onClick={fetchMore}
          className="mt-4 px-4 py-2 bg-blue-700 text-white font-bold rounded"
        >
          Show More
        </button>
      )}
    </div>
  );
};

export default PlayerTable;
