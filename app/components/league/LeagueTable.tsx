/* import React from "react";

interface LeagueTableProps {
  standings: any;
}

const LeagueTable: React.FC<LeagueTableProps> = ({ standings }) => {
  if (!standings || !standings.data) return null;

  const firstSeason = standings.data[0]?.season?.slug || "Unknown Season";

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4 bg-blue-900 text-white px-4 py-2 rounded-t-md">
        {firstSeason} {standings.data[0]?.leagueName || "League"} Standings
      </h1>
      <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-red-600 text-white">
            <th className="border border-gray-300 px-2 py-1 text-center">#</th>
            <th className="border border-gray-300 px-2 py-1 text-left">Team</th>
            <th className="border border-gray-300 px-2 py-1 text-center">GP</th>
            <th className="border border-gray-300 px-2 py-1 text-center">W</th>
            <th className="border border-gray-300 px-2 py-1 text-center">L</th>
            <th className="border border-gray-300 px-2 py-1 text-center">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.data.map((team: any, index: number) => (
            <tr
              key={team.id || `team-${index}`}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="border border-gray-300 px-2 py-1 text-center">
                {index + 1}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-left">
                <a
                  href={team.team.links?.eliteprospectsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {team.team.name || "Unknown Team"}
                </a>
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {team.stats?.GP || 0}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {team.stats?.W || 0}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {team.stats?.L || 0}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {team.stats?.PTS || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeagueTable;
 */

import React from "react";

interface LeagueTableProps {
  standings: any;
}

const LeagueTable: React.FC<LeagueTableProps> = ({ standings }) => {
  if (!standings || !standings.data) return null;

  const firstSeason = standings.data[0]?.season?.slug || "Unknown Season";

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">
        {firstSeason} {standings.data[0]?.leagueName || "League"} Standings
      </h1>
      <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-red-600 text-white">
            <th className="border border-gray-300 px-2 py-1 text-center">#</th>
            <th className="border border-gray-300 px-2 py-1 text-left">Team</th>
            <th className="border border-gray-300 px-2 py-1 text-center">GP</th>
            <th className="border border-gray-300 px-2 py-1 text-center">W</th>
            <th className="border border-gray-300 px-2 py-1 text-center">L</th>
            <th className="border border-gray-300 px-2 py-1 text-center">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.data.map((team: any, index: number) => (
            <tr
              key={team.id || `team-${index}`}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="border border-gray-300 px-2 py-1 text-center">
                {index + 1}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-left">
                <a
                  href={team.team.links?.eliteprospectsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {team.team.name || "Unknown Team"}
                </a>
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {team.stats?.GP || 0}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {team.stats?.W || 0}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {team.stats?.L || 0}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {team.stats?.PTS || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeagueTable;
