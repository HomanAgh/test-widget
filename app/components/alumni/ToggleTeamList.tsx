"use client";

import React, { useState } from "react";

interface Team {
  name: string;
  leagueLevel: string | null;
}

interface ToggleTeamListProps {
  teams: Team[];
  shortCount?: number; 
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
    return <span>N/A</span>;
  }

  return (
    <>
      {visibleTeams.map((t) => t.name).join(", ")}

      {canExpand && !expanded && (
        <button onClick={toggleExpand} className="ml-1 text-blue-600">
          ...
        </button>
      )}

      {canExpand && expanded && (
        <button onClick={toggleExpand} className="ml-1 text-blue-600">
          ...
        </button>
      )}
    </>
  );
};

export default ToggleTeamList;
