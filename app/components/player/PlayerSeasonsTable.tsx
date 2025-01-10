import React from "react";
import type { SeasonStats, PlayerType } from "@/app/types/player";

interface SeasonsTableProps {
  playerType: PlayerType;
  seasons: SeasonStats[];
  backgroundColor?: string; // NEW
  textColor?: string;       // NEW
}

const SeasonsTable: React.FC<SeasonsTableProps> = ({
  playerType,
  seasons,
  backgroundColor = "#FFFFFF",
  textColor = "#000000",
}) => {
  const displayedYears: Set<string> = new Set();

  return (
    <div
      className="mt-8 p-4 rounded-md"
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      <h2 className="text-2xl font-bold mb-4" style={{ color: textColor }}>
        Season Statistics
      </h2>

      <table
        className="min-w-full shadow-md rounded-lg overflow-hidden"
        style={{
          backgroundColor,
          color: textColor,
          border: "1px solid #ccc",
        }}
      >
        <thead
          style={{
            filter: "brightness(90%)",
            backgroundColor,
            color: textColor,
          }}
        >
          <tr>
            <th className="py-2 px-4 text-left">S</th>
            <th className="py-2 px-4 text-left">Team</th>
            <th className="py-2 px-4 text-left">League</th>
            <th className="py-2 px-4 text-center">GP</th>
            {playerType === "GOALTENDER" ? (
              <>
                <th className="py-2 px-4 text-center">GAA</th>
                <th className="py-2 px-4 text-center">SV%</th>
                <th className="py-2 px-4 text-center">SO</th>
              </>
            ) : (
              <>
                <th className="py-2 px-4 text-center">G</th>
                <th className="py-2 px-4 text-center">A</th>
                <th className="py-2 px-4 text-center">TP</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {seasons.map((season, index) => {
            const isYearDisplayed = displayedYears.has(season.season);
            if (!isYearDisplayed) {
              displayedYears.add(season.season);
            }

            return (
              <tr
                key={index}
                className="border-t"
                style={{
                  backgroundColor,
                  color: textColor,
                }}
              >
                <td className="py-2 px-4 text-left">{isYearDisplayed ? "" : season.season}</td>
                <td className="py-2 px-4 text-left">
                  <a
                    href={`https://www.eliteprospects.com/team/${season.teamId}/${encodeURIComponent(
                      season.teamName
                    )}/${season.season}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: textColor,
                      textDecoration: "underline",
                    }}
                  >
                    {season.teamName}
                  </a>
                </td>
                <td className="py-2 px-4 text-left">
                  <a
                    href={`https://www.eliteprospects.com/league/${season.league}/stats/${season.season}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: textColor,
                      textDecoration: "underline",
                    }}
                  >
                    {season.league}
                  </a>
                </td>
                <td className="py-2 px-4 text-center">{season.gamesPlayed}</td>
                {playerType === "GOALTENDER" ? (
                  <>
                    <td className="py-2 px-4 text-center">
                      {season.goalsAgainstAverage || "N/A"}
                    </td>
                    <td className="py-2 px-4 text-center">{season.savePercentage || "N/A"}</td>
                    <td className="py-2 px-4 text-center">{season.shutouts || 0}</td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-4 text-center">{season.goals || 0}</td>
                    <td className="py-2 px-4 text-center">{season.assists || 0}</td>
                    <td className="py-2 px-4 text-center">{season.points || 0}</td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SeasonsTable;
