"use client";

import React from "react";
import { LeagueTableProps } from "@/app/types/league";
import Table from "../common/style/Table";
import TableHeader from "../common/style/TableHeader";
import TableTitel from "../common/style/TableTitle";
import Link from "../common/style/Link";

const LeagueTable: React.FC<LeagueTableProps> = ({ standings, backgroundColor }) => {

  if (!standings || !standings.data) return null;

  // Extract league name and season title
  const leagueName = standings.data[0]?.team.league.name || "Unknown League";
  const seasonTitle = standings.data[0]?.season.slug || "Unknown Season";

  // Check if any team has group data
  const hasGroups = standings.data.some((team) => team.group);

  // Group teams by `group`
  const groups: { [key: string]: any[] } = standings.data.reduce(
    (acc: { [key: string]: any[] }, team: any) => {
      const groupName = team.group || "Unknown Group";
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
      <TableTitel align="center">{leagueName} {"Season"}: {seasonTitle}</TableTitel>

      {/* Render without groups if no team has group data */}
      {!hasGroups ? (
        <table
          className="table-auto border-collapse border border-gray-300 w-full text-sm"
          style={{ backgroundColor }}
        >
          <thead>
            <tr className="bg-red-600 text-white">
              <TableHeader align="center">{"#"}</TableHeader>
              <TableHeader align="center">{"Team"}</TableHeader>
              <TableHeader align="center">{"GP"}</TableHeader>
              <TableHeader align="center">{"W"}</TableHeader>
              <TableHeader align="center">{"L"}</TableHeader>
              <TableHeader align="center">{"TP"}</TableHeader>
            </tr>
          </thead>
          <tbody>
            {standings.data.map((team: any, index: number) => (
              <tr
                key={team.id || `team-${index}`}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <Table align="center">{index + 1}</Table>
                <Table align="left">
                  <a
                    href={team.team.links?.eliteprospectsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {team.team.name || "Unknown Team"}
                  </a>
                </Table>
                <Table align="center">{team.stats?.GP || 0}</Table>
                <Table align="center">{team.stats?.W || 0}</Table>
                <Table align="center">{team.stats?.L || 0}</Table>
                <Table align="center">{team.stats?.PTS || 0}</Table>
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
                  <TableHeader align="center">{"#"}</TableHeader>
                  <TableHeader align="left">{"Team"}</TableHeader>
                  <TableHeader align="center">{"GP"}</TableHeader>
                  <TableHeader align="center">{"W"}</TableHeader>
                  <TableHeader align="center">{"L"}</TableHeader>
                  <TableHeader align="center">{"TP"}</TableHeader>
                </tr>
              </thead>
              <tbody>
                {teams.map((team: any, index: number) => (
                  <tr
                    key={team.id || `team-${index}`}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    <Table align="center">{index + 1}</Table>
                    <Table align="left">
                      <Link href={team.team.links?.eliteprospectsUrl}>
                          {team.team.name || "Unknown Team"}
                      </Link>
                    </Table>
                    <Table align="center">{team.stats?.GP || 0}</Table>
                    <Table align="center">{team.stats?.W || 0}</Table>
                    <Table align="center">{team.stats?.L || 0}</Table>
                    <Table align="center">{team.stats?.PTS || 0}</Table>
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
