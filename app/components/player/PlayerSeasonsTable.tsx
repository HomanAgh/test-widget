import React from "react";
import type { SeasonStats, PlayerType } from "@/app/types/player";

interface SeasonsTableProps {
  playerType: PlayerType;
  seasons: SeasonStats[];
}

const SeasonsTable: React.FC<SeasonsTableProps> = ({ playerType, seasons }) => {
  return (
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          <th className="py-2 px-4 text-left">S</th>
          <th className="py-2 px-4 text-left">Team</th>
          <th className="py-2 px-4 text-left">League</th>
          <th className="py-2 px-4 text-left">GP</th>
          {playerType === "GOALTENDER" ? (
            <>
              <th className="py-2 px-4 text-left">GAA</th>
              <th className="py-2 px-4 text-left">SV%</th>
              <th className="py-2 px-4 text-left">SO</th>
            </>
          ) : (
            <>
              <th className="py-2 px-4 text-left">G</th>
              <th className="py-2 px-4 text-left">A</th>
              <th className="py-2 px-4 text-left">TP</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {seasons.map((season, index) => (
          <tr key={index} className="border-t">
            <td className="py-2 px-4">{season.season}</td>
            <td className="py-2 px-4">
              <a
                href={`https://www.eliteprospects.com/team/${season.teamId}/${encodeURIComponent(
                  season.teamName
                )}/${season.season}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {season.teamName}
              </a>
            </td>
            <td className="py-2 px-4">
              <a
                href={`https://www.eliteprospects.com/league/${season.league}/stats/${season.season}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {season.league}
              </a>
            </td>
            <td className="py-2 px-4">{season.gamesPlayed}</td>
            {playerType === "GOALTENDER" ? (
              <>
                <td className="py-2 px-4">{season.goalsAgainstAverage || "N/A"}</td>
                <td className="py-2 px-4">{season.savePercentage || "N/A"}</td>
                <td className="py-2 px-4">{season.shutouts || 0}</td>
              </>
            ) : (
              <>
                <td className="py-2 px-4">{season.goals || 0}</td>
                <td className="py-2 px-4">{season.assists || 0}</td>
                <td className="py-2 px-4">{season.points || 0}</td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SeasonsTable;
