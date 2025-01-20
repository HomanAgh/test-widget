"use client";

import React, { useEffect, useState } from "react";
import LeagueTable from "./LeagueTable"; // Re-use your existing LeagueTable
import type { LeagueTableProps } from "@/app/types/league";

interface LeagueProps {
  leagueSlug: string;
  backgroundColor: string;
  textColor?: string;
}

const League: React.FC<LeagueProps> = ({
  leagueSlug,
  backgroundColor,
  textColor = "#000000",
}) => {
  const [standings, setStandings] = useState<LeagueTableProps["standings"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeagueStandings = async () => {
      try {
        // Fetch the league standings from your API route
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

  // Loading / Error states
  if (loading) return <div className="text-center text-gray-600">{"Loading..."}</div>;
  if (error) return <div className="text-center text-red-600">{"Error:"} {error}</div>;
  if (!standings) return <div className="text-center">{"No standings available"}</div>;

  // Render the League Table
  return (
    <div
      className="max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-lg"
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      {/* Example: You could display some quick info or league name here if desired */}
      <h2 className="text-xl font-bold mb-4" style={{ color: textColor }}>
        {leagueSlug.toUpperCase()} Standings
      </h2>
      <LeagueTable 
        standings={standings} 
        backgroundColor={backgroundColor} 
      />
    </div>
  );
};

export default League;
