"use client";

import React, { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

interface Team {
  name: string;
  leagueLevel: string | null;
}

interface ToggleTeamListProps {
  teams: Team[];
  shortCount?: number; // Number of teams to show initially before expanding
}

const ToggleTeamList: React.FC<ToggleTeamListProps> = ({
  teams,
  shortCount = 1,
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
      {/* Render the first team with the chevron */}
      {visibleTeams.map((team, index) => (
        <div
          key={index}
          className={`flex items-center ${
            index === 0 ? "gap-1" : ""
          } py-1`}
        >
          <span>{team.name}</span>
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
