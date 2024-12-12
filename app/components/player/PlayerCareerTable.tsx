import React from "react";
import type { CareerStats } from "@/app/types/player";

interface CareerTableProps {
  careers: CareerStats[];
}

const PlayerCareerTable: React.FC<CareerTableProps> = ({ careers }) => {
  const isGoalie = careers.some((career) => career.goalsAgainstAverage !== undefined);

  return (
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          <th className="py-2 px-4 text-left">League</th>
          <th className="py-2 px-4 text-left">Number of Seasons</th>
          <th className="py-2 px-4 text-left">Games Played</th>
          {isGoalie ? (
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
        {careers.map((career, index) => (
          <tr key={index} className="border-t">
            <td className="py-2 px-4">
              <a
              href={`https://www.eliteprospects.com/league/${career.league.toLowerCase().replace(/\s+/g, "-")}/stats/all-time`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              >
              {career.league}
              </a>
            </td>
            <td className="py-2 px-4">{career.numberOfSeasons}</td>
            <td className="py-2 px-4">{career.gamesPlayed}</td>
            {isGoalie ? (
              <>
                <td className="py-2 px-4">{career.goalsAgainstAverage || "N/A"}</td>
                <td className="py-2 px-4">{career.savePercentage || "N/A"}</td>
                <td className="py-2 px-4">{career.shutouts || 0}</td>
              </>
            ) : (
              <>
                <td className="py-2 px-4">{career.goals || 0}</td>
                <td className="py-2 px-4">{career.assists || 0}</td>
                <td className="py-2 px-4">{career.points || 0}</td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PlayerCareerTable;
