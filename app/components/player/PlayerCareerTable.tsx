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
          <th className="py-2 px-4 text-left">Years</th>
          <th className="py-2 px-4 text-left">GP</th>
          {isGoalie ? (
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
        {careers.map((career, index) => (
          <tr key={index} className="border-t">
            <td className="py-2 px-4">
              <a
              href={`https://www.eliteprospects.com/league/${career.league.toLowerCase().replace(/\s+/g, "-")}/stats/all-time`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline hover:text-blue-800"
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
