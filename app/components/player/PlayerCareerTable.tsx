"use client";

import React from "react";
import type { CareerStats } from "@/app/types/player";

interface CareerTableProps {
  careers: CareerStats[];
  backgroundColor?: string;
  textColor?: string;
}

const PlayerCareerTable: React.FC<CareerTableProps> = ({
  careers,
  backgroundColor = "#FFFFFF",
  textColor = "#000000",
}) => {
  const isGoalie = careers.some((career) => career.goalsAgainstAverage !== undefined);

  return (
    <table
      className="min-w-full shadow-md rounded-lg overflow-hidden"
      style={{
        backgroundColor,
        color: textColor, // This will apply to the entire table unless overridden below
      }}
    >
      {/* If you want a slightly darker header row, we can keep filter: brightness(90%). */}
      <thead
        style={{
          filter: "brightness(90%)",
          backgroundColor,
          color: textColor,
        }}
      >
        <tr>
          <th className="py-2 px-4 text-left" style={{ color: textColor }}>
            League
          </th>
          <th className="py-2 px-4 text-left" style={{ color: textColor }}>
            Years
          </th>
          <th className="py-2 px-4 text-left" style={{ color: textColor }}>
            GP
          </th>
          {isGoalie ? (
            <>
              <th className="py-2 px-4 text-left" style={{ color: textColor }}>
                GAA
              </th>
              <th className="py-2 px-4 text-left" style={{ color: textColor }}>
                SV%
              </th>
              <th className="py-2 px-4 text-left" style={{ color: textColor }}>
                SO
              </th>
            </>
          ) : (
            <>
              <th className="py-2 px-4 text-left" style={{ color: textColor }}>
                G
              </th>
              <th className="py-2 px-4 text-left" style={{ color: textColor }}>
                A
              </th>
              <th className="py-2 px-4 text-left" style={{ color: textColor }}>
                TP
              </th>
            </>
          )}
        </tr>
      </thead>

      <tbody>
        {careers.map((career, index) => (
          <tr
            key={index}
            className="border-t"
            style={{
              backgroundColor,
              color: textColor,
            }}
          >
            <td className="py-2 px-4" style={{ color: textColor }}>
              <a
                href={`https://www.eliteprospects.com/league/${career.league
                  .toLowerCase()
                  .replace(/\s+/g, "-")}/stats/all-time`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: textColor, textDecoration: "underline" }}
              >
                {career.league}
              </a>
            </td>
            <td className="py-2 px-4" style={{ color: textColor }}>
              {career.numberOfSeasons}
            </td>
            <td className="py-2 px-4" style={{ color: textColor }}>
              {career.gamesPlayed}
            </td>
            {isGoalie ? (
              <>
                <td className="py-2 px-4" style={{ color: textColor }}>
                  {career.goalsAgainstAverage ?? "N/A"}
                </td>
                <td className="py-2 px-4" style={{ color: textColor }}>
                  {career.savePercentage ?? "N/A"}
                </td>
                <td className="py-2 px-4" style={{ color: textColor }}>
                  {career.shutouts ?? 0}
                </td>
              </>
            ) : (
              <>
                <td className="py-2 px-4" style={{ color: textColor }}>
                  {career.goals ?? 0}
                </td>
                <td className="py-2 px-4" style={{ color: textColor }}>
                  {career.assists ?? 0}
                </td>
                <td className="py-2 px-4" style={{ color: textColor }}>
                  {career.points ?? 0}
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PlayerCareerTable;
