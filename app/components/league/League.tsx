"use client";

import React, { useEffect, useState } from "react";
import LeagueTable from "./LeagueTable"; 
import type { LeagueTableProps } from "@/app/types/league";

interface LeagueProps {
  leagueSlug: string;
}

const League: React.FC<LeagueProps> = ({
  leagueSlug,
}) => {
  const [standings, setStandings] = useState<LeagueTableProps["standings"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeagueStandings = async () => {
      try {
        const response = await fetch(`/api/league?league=${encodeURIComponent(leagueSlug)}`);
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
  }, [leagueSlug]);

  if (loading) return <div className="text-center text-gray-600">{"Loading..."}</div>;
  if (error) return <div className="text-center text-red-600">{"Error:"} {error}</div>;
  if (!standings) return <div className="text-center">{"No standings available"}</div>;

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 rounded-lg">
      {/* Example: You could display some quick info or league name here if desired */}
      <h2 className="text-xl font-bold mb-4">
        {leagueSlug.toUpperCase()} Standings
      </h2>
      <LeagueTable 
        standings={standings} 
      />
    </div>
  );
};

export default League;
