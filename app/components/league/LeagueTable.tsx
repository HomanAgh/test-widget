"use client";

import React from "react";
import { LeagueTableProps, ExtendedTeam } from "@/app/types/league";
import Image from "next/image";

import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
} from "@/app/components/common/style";

import Collapsible from "@/app/components/league/Collapsible";

function parseGroupString(groupString: string) {
  if (!groupString) {
    return { conference: "Unknown", division: null };
  }
  const parts = groupString.split("/");
  if (parts.length === 2) {
    return {
      conference: parts[0].trim(),
      division: parts[1].trim(),
    };
  }
  return {
    conference: groupString.trim(),
    division: null,
  };
}

function groupBy<T extends object>(arr: T[], key: keyof T) {
  return arr.reduce((acc, item) => {
    const groupValue = item[key] || "Unknown Group";
    const groupName = String(groupValue);
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

interface LeagueTablePropsWithColors extends LeagueTableProps {
  backgroundColor?: string;
  textColor?: string;
  tableBackgroundColor?: string;
  headerTextColor?: string;
  nameTextColor?: string;
}

const LeagueTable: React.FC<LeagueTablePropsWithColors> = ({ 
  standings,
  backgroundColor = "#052D41",
  textColor = "#000000",
  tableBackgroundColor = "#FFFFFF",
  headerTextColor = "#FFFFFF",
  nameTextColor = "#0D73A6"
}) => {
  if (!standings || !standings.data) return null;

  const rawTeams = standings.data;
  if (!rawTeams || rawTeams.length === 0) return null;

  const teams: ExtendedTeam[] = rawTeams.map((t: any, index: number) => {
    const { conference, division } = parseGroupString(t.group || "");
    return {
      ...t,
      id: t.id ?? index,
      conference,
      division,
      logo: t.teamLogo?.small,
    };
  });

  const leagueName = teams[8]?.team.league?.name || "Unknown League";
  const leagueLogo = teams[8]?.team.league?.logo?.url;
  const seasonTitle = teams[0]?.season?.slug || "Unknown Season";

  const leagueEpUrl = `https://www.eliteprospects.com/league/${leagueName
    .toLowerCase()
    .replace(/\s+/g, "-")}/${seasonTitle}`;

  const renderTable = (teamArray: ExtendedTeam[]) => {
    const isCustomColor =
      tableBackgroundColor.toLowerCase() !== "#ffffff" &&
      tableBackgroundColor.toLowerCase() !== "#fff";
    
    return (
      <Table
        className="
          border-separate 
          border-spacing-0 
          w-full 
          rounded-lg
          border 
          border-customGrayMedium
        "
        tableBgColor={tableBackgroundColor}
        tableTextColor={textColor}
      >
        <TableHead bgColor={backgroundColor} textColor={headerTextColor}>
          <TableRow bgColor={backgroundColor}>
            <TableCell isHeader align="center">
              #
            </TableCell>
            <TableCell isHeader align="left">
              Team
            </TableCell>
            <TableCell isHeader align="center">
              GP
            </TableCell>
            <TableCell isHeader align="center">
              W
            </TableCell>
            <TableCell isHeader align="center">
              L
            </TableCell>
            <TableCell isHeader align="center">
              OTW
            </TableCell>
            <TableCell isHeader align="center">
              OTL
            </TableCell>
            <TableCell isHeader align="center">
              PTS
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teamArray.map((team, i) => {
            const rowBackground = isCustomColor
              ? tableBackgroundColor
              : i % 2 === 0
              ? "#F3F4F6"
              : "#FFFFFF";
              
            return (
              <TableRow
                key={team.id}
                bgColor={rowBackground}
              >
                <TableCell align="center">{i + 1}</TableCell>
                <TableCell align="left">
                  <Link href={team.team.links?.eliteprospectsUrl ?? "#"} >
                    {team.logo && (
                      <Image
                        src={team.logo}
                        alt={`${team.team.name ?? "Team"} logo`}
                        width={20}
                        height={20}
                        className="inline-block mr-2 align-middle text-[#0D73A6] hover:underline"
                      />
                    )}
                    {team.team.name ?? "Unknown Team"}
                  </Link>
                </TableCell>
                <TableCell align="center">{team.stats?.GP ?? 0}</TableCell>
                <TableCell align="center">{team.stats?.W ?? 0}</TableCell>
                <TableCell align="center">{team.stats?.L ?? 0}</TableCell>
                <TableCell align="center">{team.stats?.OTW ?? 0}</TableCell>
                <TableCell align="center">{team.stats?.OTL ?? 0}</TableCell>
                <TableCell align="center">{team.stats?.PTS ?? 0}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  const byConference = groupBy(teams, "conference");
  const conferenceNames = Object.keys(byConference);
  const renderHeading = () => (
    <div
      className="flex items-center justify-center mb-4"
      style={{ color: nameTextColor }}
    >
      {leagueLogo && (
        <Image
          src={leagueLogo}
          alt={`${leagueName} logo`}
          width={30}
          height={30}
          className="mr-2"
        />
      )}
      <Link href={leagueEpUrl} className="text-2xl font-bold hover:underline" style={{ color: nameTextColor }}>
        {leagueName} Season: {seasonTitle}
      </Link>
    </div>
  );

  if (conferenceNames.length === 1) {
    const singleConferenceName = conferenceNames[0];
    const teamsInConf = byConference[singleConferenceName];
    const byDivision = groupBy(teamsInConf, "division");
    const divisionNames = Object.keys(byDivision).filter((d) => d !== "null");

    if (divisionNames.length <= 1) {
      return (
        <div>
          {renderHeading()}
          <TableContainer noBorder>{renderTable(teams)}</TableContainer>
        </div>
      );
    }

    return (
      <div>
        {renderHeading()}
        <TableContainer noBorder>
          <Collapsible
            title={
              <span className="text-lg font-semibold">
                {singleConferenceName}
              </span>
            }
          >
            {divisionNames.map((divName) => {
              if (!divName || divName === "null") return null;
              const teamsDiv = byDivision[divName];
              return (
                <Collapsible
                  key={divName}
                  title={<span className="text-base ml-4">{divName}</span>}
                >
                  {renderTable(teamsDiv)}
                </Collapsible>
              );
            })}
          </Collapsible>
        </TableContainer>
      </div>
    );
  }

  return (
    <div>
      {renderHeading()}
      <TableContainer noBorder>
        {conferenceNames.map((conf) => {
          const teamsInConf = byConference[conf];
          const byDivision = groupBy(teamsInConf, "division");
          const divisionNames = Object.keys(byDivision).filter(
            (div) => div !== "null" && div !== "Unknown Group"
          );

          if (divisionNames.length === 0) {
            return (
              <Collapsible
                key={conf}
                title={<span className="text-lg">{conf}</span>}
              >
                {renderTable(teamsInConf)}
              </Collapsible>
            );
          }

          return (
            <Collapsible
              key={conf}
              title={<span className="text-lg">{conf}</span>}
            >
              {divisionNames.map((divName) => {
                const teamsDiv = byDivision[divName];
                return (
                  <Collapsible
                    key={divName}
                    title={
                      <span className="text-base font-medium ml-4">
                        {divName}
                      </span>
                    }
                  >
                    {renderTable(teamsDiv)}
                  </Collapsible>
                );
              })}
            </Collapsible>
          );
        })}
      </TableContainer>
    </div>
  );
};

export default LeagueTable;
