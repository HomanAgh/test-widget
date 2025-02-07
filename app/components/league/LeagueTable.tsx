"use client";

import React from "react";
import { LeagueTableProps } from "@/app/types/league";
import { TableContainer, Table,TableHead,TableBody,TableRow,TableCell,Link } from "@/app/components/common/style";


interface LeagueTablePropsWithColors extends LeagueTableProps {
  backgroundColor?: string;
  textColor?: string;
}

const LeagueTable: React.FC<LeagueTablePropsWithColors> = ({
  standings,
  backgroundColor = "#FFFFFF",
  textColor = "#000000",
}) => {
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

  // A helper to render the table rows (shared by grouped & ungrouped modes)
  const renderTeamRow = (team: any, index: number) => (
    <TableRow
      key={team.id || `team-${index}`}
      // Use Tailwind classes for striped rows; use inline style for text color
      className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
    >
      <TableCell align="center">{index + 1}</TableCell>
      <TableCell align="left">
        <Link
          href={team.team.links?.eliteprospectsUrl}
        >
          {team.team.name || "Unknown Team"}
        </Link>
      </TableCell>
      <TableCell align="center">{team.stats?.GP || 0}</TableCell>
      <TableCell align="center">{team.stats?.W || 0}</TableCell>
      <TableCell align="center">{team.stats?.L || 0}</TableCell>
      <TableCell align="center">{team.stats?.OTW || 0}</TableCell>
      <TableCell align="center">{team.stats?.OTL || 0}</TableCell>
      <TableCell align="center">{team.stats?.PTS || 0}</TableCell>
    </TableRow>
  );

  // A reusable function that renders a single table (for either all teams or a group)
  const renderTable = (teams: any[]) => (
    <Table className="table-auto border-collapse border border-gray-300 w-full text-sm">
      <TableHead>
        <TableRow className="bg-red-600">
          <TableCell isHeader align="center">#</TableCell>
          <TableCell isHeader align="left">Team</TableCell>
          <TableCell isHeader align="center">GP</TableCell>
          <TableCell isHeader align="center">W</TableCell>
          <TableCell isHeader align="center">L</TableCell>
          <TableCell isHeader align="center">OTW</TableCell>
          <TableCell isHeader align="center">OTL</TableCell>
          <TableCell isHeader align="center">TP</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {teams.map((team: any, index: number) => renderTeamRow(team, index))}
      </TableBody>
    </Table>
  );

  return (
    <div>
      {/* League + Season Title */}
      <h2 className="text-lg font-bold text-center mb-2">
        {leagueName} Season: {seasonTitle}
      </h2>

      {/* TableContainer applies background + text color to everything within */}
      <TableContainer>
        {/* If no groups, just one table. Otherwise, one table per group. */}
        {!hasGroups ? (
          renderTable(standings.data)
        ) : (
          Object.entries(groups).map(([groupName, teams]: [string, any[]]) => (
            <div key={groupName} className="mb-6">
              <h3 className="text-md font-bold bg-blue-600 text-white p-2">
                {groupName}
              </h3>
              {renderTable(teams)}
            </div>
          ))
        )}
      </TableContainer>
    </div>
  );
};

export default LeagueTable;
