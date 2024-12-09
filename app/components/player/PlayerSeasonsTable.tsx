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
          <th className="py-2 px-4 text-left">Season</th>
          <th className="py-2 px-4 text-left">Team</th>
          <th className="py-2 px-4 text-left">League</th>
          <th className="py-2 px-4 text-left">Games Played</th>
          {playerType === "GOALTENDER" ? (
            <>
              <th className="py-2 px-4 text-left">GAA</th>
              <th className="py-2 px-4 text-left">Save %</th>
              <th className="py-2 px-4 text-left">Shutouts</th>
            </>
          ) : (
            <>
              <th className="py-2 px-4 text-left">Goals</th>
              <th className="py-2 px-4 text-left">Assists</th>
              <th className="py-2 px-4 text-left">Points</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {seasons.map((season, index) => (
          <tr key={index} className="border-t">
            <td className="py-2 px-4">{season.season}</td>
            <td className="py-2 px-4">{season.team}</td>
            <td className="py-2 px-4">{season.league}</td>
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