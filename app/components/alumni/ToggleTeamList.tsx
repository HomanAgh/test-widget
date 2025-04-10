"use client";

import React, { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import Link from "../common/style/Link";

interface Team {
  id?: string;
  name: string;
  leagueLevel?: string | null;
  leagueSlug?: string;
  isCurrentTeam?: boolean;
}

interface ToggleTeamListProps {
  teams: Team[];
  shortCount?: number; // Number of teams to show initially before expanding
  linkColor?: string; // Color for the team name links
}

const ToggleTeamList: React.FC<ToggleTeamListProps> = ({
  teams,
  shortCount = 1,
  linkColor = "#0D73A6"
}) => {
  const [expanded, setExpanded] = useState(false);
  const visibleTeams = expanded ? teams : teams.slice(0, shortCount);
  const canExpand = teams.length > shortCount;

  const toggleExpand = () => setExpanded((prev) => !prev);

  if (!teams || teams.length === 0) {
    return <span>-</span>;
  }

  return (
    <div className="flex flex-col">
      {/* Render the teams with links if ID is available */}
      {visibleTeams.map((team, index) => (
        <div
          key={index}
          className={`flex items-center justify-center ${
            index === 0 ? "gap-1" : ""
          } py-1`}
        >
          {team.id ? (
            <Link
              href={`https://www.eliteprospects.com/team/${team.id}/${encodeURIComponent(team.name)}`} 
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: linkColor }}
            >
              {team.name}
            </Link>
          ) : (
            <span>{team.name}</span>
          )}
          {index === 0 && canExpand && (
            <button
              onClick={toggleExpand}
              className="text-blue-600 text-sm flex items-center"
            >
              {expanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ToggleTeamList;
