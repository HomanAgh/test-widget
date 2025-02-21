"use client";

import React, { useEffect, useState } from "react";
import LeagueTable from "./LeagueTable";
import type { LeagueTableProps } from "@/app/types/league";

interface LeagueProps {
  leagueSlug: string;
}

const League: React.FC<LeagueProps> = ({ leagueSlug }) => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1; 

  let seasonStartYear = currentYear;
  if (currentMonth < 9) {
    seasonStartYear = currentYear - 1;
  }

  const SEASONS_BACK = 19;
  const seasonsArray: string[] = [];
  for (let y = seasonStartYear; y >= seasonStartYear - SEASONS_BACK; y--) {
    seasonsArray.push(`${y}-${y + 1}`);
  }

  const [season, setSeason] = useState<string>(seasonsArray[0]);
  const [standings, setStandings] =
    useState<LeagueTableProps["standings"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeagueStandings = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/league?league=${encodeURIComponent(leagueSlug)}&season=${encodeURIComponent(season)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch league data");
        }
        const data = await response.json();
        setStandings(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLeagueStandings();
  }, [leagueSlug, season]);

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSeason(e.target.value);
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }
  if (!standings) {
    return <div className="text-center">No standings available</div>;
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 rounded-lg">
      <div className="text-center mb-6">
        <label htmlFor="season-select" className="mr-2 font-semibold">
          Select Season:
        </label>
        <select
          id="season-select"
          value={season}
          onChange={handleSeasonChange}
          className="border px-3 py-1 rounded"
        >
          {seasonsArray.map((seasonOption) => (
            <option key={seasonOption} value={seasonOption}>
              {seasonOption}
            </option>
          ))}
        </select>
      </div>
      <LeagueTable standings={standings} logoS="" />
    </div>
  );
};

export default League;
