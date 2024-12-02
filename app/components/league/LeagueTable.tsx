import React from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation

/* interface LeagueTableProps {
  standings: any;
}

const LeagueTable: React.FC<LeagueTableProps> = ({ standings }) => {
  const { t } = useTranslation(); // Hook for translations

  if (!standings || !standings.data) return null;

  const firstSeason = standings.data[0]?.season?.slug || t("UnknownSeason");

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">
        {firstSeason} {standings.data[0]?.leagueName || t("League")}
      </h1>
      <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-red-600 text-white">
            <th className="border border-gray-300 px-2 py-1 text-center">{t("Rank")}</th>
            <th className="border border-gray-300 px-2 py-1 text-left">{t("Team")}</th>
            <th className="border border-gray-300 px-2 py-1 text-center">{t("GP")}</th>
            <th className="border border-gray-300 px-2 py-1 text-center">{t("Wins")}</th>
            <th className="border border-gray-300 px-2 py-1 text-center">{t("Losses")}</th>
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
    </div>
  );
};

export default LeagueTable;
 */

interface LeagueTableProps {
  standings: any;
  backgroundColor?: string; // New prop
}

const LeagueTable: React.FC<LeagueTableProps> = ({ standings, backgroundColor }) => {
  const { t } = useTranslation();

  if (!standings || !standings.data) return null;

  const firstSeason = standings.data[0]?.season?.slug || t("UnknownSeason");

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">
        {firstSeason} {standings.data[0]?.leagueName || t("League")}
      </h1>
      <table
        className="table-auto border-collapse border border-gray-300 w-full text-sm"
        style={{ backgroundColor }} // Apply dynamic background color
      >
        <thead>
          <tr className="bg-red-600 text-white">
            <th className="border border-gray-300 px-2 py-1 text-center">{t("Rank")}</th>
            <th className="border border-gray-300 px-2 py-1 text-left">{t("Team")}</th>
            <th className="border border-gray-300 px-2 py-1 text-center">{t("GP")}</th>
            <th className="border border-gray-300 px-2 py-1 text-center">{t("Wins")}</th>
            <th className="border border-gray-300 px-2 py-1 text-center">{t("Losses")}</th>
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
    </div>
  );
};

export default LeagueTable;
