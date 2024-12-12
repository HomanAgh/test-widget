"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface RosterTableProps {
  roster: any[];
  backgroundColor?: string;
}

const RosterTable: React.FC<RosterTableProps> = ({ roster, backgroundColor }) => {
  const { t } = useTranslation();

  if (!roster || roster.length === 0) {
    return <p>{t("NoRoster")}</p>;
  }

  return (
    <table
      className="table-auto border-collapse border border-gray-300 w-full text-sm"
      style={{ backgroundColor }}
    >
      <thead>
        <tr className="bg-blue-600 text-white">
          <th className="border border-gray-300 px-2 py-1 text-center">{t("#")}</th>
          <th className="border border-gray-300 px-2 py-1 text-left">{t("Name")}</th>
          <th className="border border-gray-300 px-2 py-1 text-center">{t("Position")}</th>
          <th className="border border-gray-300 px-2 py-1 text-center">{t("JerseyNumber")}</th>
          <th className="border border-gray-300 px-2 py-1 text-center">{t("Nationality")}</th>
        </tr>
      </thead>
      <tbody>
        {roster.map((player: any, index: number) => (
          <tr
            key={player.id || `player-${index}`}
            className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
          >
            <td className="border border-gray-300 px-2 py-1 text-center">{index + 1}</td>
            <td className="border border-gray-300 px-2 py-1 text-left">{`${player.firstName} ${player.lastName}`}</td>
            <td className="border border-gray-300 px-2 py-1 text-center">{player.position}</td>
            <td className="border border-gray-300 px-2 py-1 text-center">{player.jerseyNumber}</td>
            <td className="border border-gray-300 px-2 py-1 text-center">{player.nationality}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RosterTable;
