"use client";

import React from "react";

interface StatsTypeSelectorProps {
  statsType: "regular" | "postseason";
  onChange: (statsType: "regular" | "postseason") => void;
  hasPlayoffStats: boolean;
}

const StatsTypeSelector: React.FC<StatsTypeSelectorProps> = ({
  statsType,
  onChange,
  hasPlayoffStats,
}) => {
  if (!hasPlayoffStats) {
    return null;
  }

  return (
    <div className="inline-flex items-center ml-4">
      <label htmlFor="stats-type-select" className="mr-2 font-semibold">
        Select Stats Type:
      </label>
      <select
        id="stats-type-select"
        value={statsType}
        onChange={(e) => onChange(e.target.value as "regular" | "postseason")}
        className="border px-3 py-1 rounded font-sans"
      >
        <option value="regular">Regular Season</option>
        <option value="postseason">Playoffs</option>
      </select>
    </div>
  );
};

export default StatsTypeSelector;
