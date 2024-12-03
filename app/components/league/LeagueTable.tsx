"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface LeagueTableProps {
  standings: {
    data: {
      id: number;
      group?: string; // Optional group field
      team: {
        name: string;
        league: {
          name: string;
        };
        links?: { eliteprospectsUrl?: string };
      };
      season: {
        slug: string;
      };
      stats?: {
        GP?: number;
        W?: number;
        L?: number;
        PTS?: number;
      };
    }[];
  };
  backgroundColor?: string; // Prop for dynamic background color
}

const LeagueTable: React.FC<LeagueTableProps> = ({ standings, backgroundColor }) => {
  const { t } = useTranslation();

  if (!standings || !standings.data) return null;

  // Extract league name and season title
  const leagueName = standings.data[0]?.team.league.name || t("UnknownLeague");
  const seasonTitle = standings.data[0]?.season.slug || t("UnknownSeason");

  // Check if any team has group data
  const hasGroups = standings.data.some((team) => team.group);

  // Group teams by `group`
  const groups: { [key: string]: any[] } = standings.data.reduce(
    (acc: { [key: string]: any[] }, team: any) => {
      const groupName = team.group || t("UnknownGroup");
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(team);
      return acc;
    },
    {}
  );

  return (
    <div>
      {/* League Title */}
      <h1 className="text-lg font-semibold mb-4 text-center">
        {leagueName} {t("Season")}: {seasonTitle}
      </h1>

      {/* Render without groups if no team has group data */}
      {!hasGroups ? (
        <table
          className="table-auto border-collapse border border-gray-300 w-full text-sm"
          style={{ backgroundColor }}
        >
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="border border-gray-300 px-2 py-1 text-center">{t("#")}</th>
              <th className="border border-gray-300 px-2 py-1 text-left">{t("Team")}</th>
              <th className="border border-gray-300 px-2 py-1 text-center">{t("GP")}</th>
              <th className="border border-gray-300 px-2 py-1 text-center">{t("W")}</th>
              <th className="border border-gray-300 px-2 py-1 text-center">{t("L")}</th>
              <th className="border border-gray-300 px-2 py-1 text-center">{t("PTS")}</th>
            </tr>
          </thead>
          <tbody>
            {standings.data.map((team: any, index: number) => (
              <tr
                key={team.id || `team-${index}`}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="border border-gray-300 px-2 py-1 text-center">{index + 1}</td>
                <td className="border border-gray-300 px-2 py-1 text-left">
                  <a
                    href={team.team.links?.eliteprospectsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {team.team.name || t("UnknownTeam")}
                  </a>
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">{team.stats?.GP || 0}</td>
                <td className="border border-gray-300 px-2 py-1 text-center">{team.stats?.W || 0}</td>
                <td className="border border-gray-300 px-2 py-1 text-center">{team.stats?.L || 0}</td>
                <td className="border border-gray-300 px-2 py-1 text-center">{team.stats?.PTS || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        Object.entries(groups).map(([groupName, teams]: [string, any[]]) => (
          <div key={groupName} className="mb-6">
            <h2 className="text-md font-bold bg-blue-600 text-white p-2">{groupName}</h2>
            <table
              className="table-auto border-collapse border border-gray-300 w-full text-sm"
              style={{ backgroundColor }}
            >
              <thead>
                <tr className="bg-red-600 text-white">
                  <th className="border border-gray-300 px-2 py-1 text-center">{t("#")}</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">{t("Team")}</th>
                  <th className="border border-gray-300 px-2 py-1 text-center">{t("GP")}</th>
                  <th className="border border-gray-300 px-2 py-1 text-center">{t("W")}</th>
                  <th className="border border-gray-300 px-2 py-1 text-center">{t("L")}</th>
                  <th className="border border-gray-300 px-2 py-1 text-center">{t("PTS")}</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team: any, index: number) => (
                  <tr
                    key={team.id || `team-${index}`}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    <td className="border border-gray-300 px-2 py-1 text-center">{index + 1}</td>
                    <td className="border border-gray-300 px-2 py-1 text-left">
                      <a
                        href={team.team.links?.eliteprospectsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {team.team.name || t("UnknownTeam")}
                      </a>
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">{team.stats?.GP || 0}</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">{team.stats?.W || 0}</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">{team.stats?.L || 0}</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">{team.stats?.PTS || 0}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default LeagueTable;
