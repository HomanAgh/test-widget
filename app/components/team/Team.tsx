"use client";

import React, { useEffect, useState } from "react";
import RosterTable from "@/app/components/team/RosterTable";
import type { Team as TeamType, RosterPlayer } from "@/app/types/team";
import Image from "next/image";
import Link from "../common/style/Link"; // Import the Link component

interface TeamStats {
  team: TeamType;
  roster: RosterPlayer[];
}

interface TeamProps {
  teamId: string;
  backgroundColor: string;
  textColor?: string;
}

const Team: React.FC<TeamProps> = ({ 
  teamId, 
  backgroundColor,
  textColor = "0000000",
}) => {

  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        // Fetch team information
        const teamInfoResponse = await fetch(`/api/team?teamId=${encodeURIComponent(teamId)}`);
        if (!teamInfoResponse.ok) {
          throw new Error("Failed to fetch team information");
        }
        const teamInfo = await teamInfoResponse.json();

        // Fetch roster data
        const rosterResponse = await fetch(`/api/teamroster?teamId=${encodeURIComponent(teamId)}`);
        if (!rosterResponse.ok) {
          throw new Error("Failed to fetch team roster");
        }
        const roster = await rosterResponse.json();

        // Combine data
        setTeamStats({
          team: {
            id: teamInfo.id,
            name: teamInfo.name || "Unknown Team",
            league: teamInfo.league || "Unknown League",
            country: teamInfo.country || "Unknown Country",
            logoM: teamInfo.logoM || null, // Add medium logo
          },
          roster: roster,
        });
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamStats();
  }, [teamId]);

  if (loading) return <div className="text-center text-gray-600">{"Loading..."}</div>;
  if (error) return <div className="text-center text-red-600">{"An error occurred"}: {error}</div>;

  return (
    <div
      className="max-w-4xl mx-auto my-8 p-6 rounded-lg "
      style={{ 
        backgroundColor, 
        color: textColor,
      }}
      >
        {teamStats && (
          <div className="font-montserrat">
            {/* Team Name and Logo */}
            <div className="mb-6 flex items-center space-x-4 pb-[24px]">
              {/* Medium Team Logo */}
              {teamStats.team.logoM && (
                <Image
                  src={teamStats.team.logoM}
                  alt={`${teamStats.team.name} Logo`}
                  layout="intrinsic"
                  width={48}
                  height={48}
                />
              )}
              {/* Team Name & League (Stacked Vertically) */}
              <div className="flex flex-col">
                <h2 
                  className="text-[24px] font-bold leading-[26px]" 
                  style={{ color: textColor }}
                >
                  <Link href={`https://www.eliteprospects.com/team/${teamStats.team.id}/${teamStats.team.name}`}>
                    {teamStats.team.name}
                  </Link>
                </h2>
                <p 
                  className="text-[16px] font-semibold " 
                  style={{ color: textColor }}
                >
                  <Link href={`https://www.eliteprospects.com/league/${teamStats.team.league.toLowerCase()}`}>
                    {teamStats.team.league}
                  </Link>
                </p>
              </div>
            </div>
            {/* Roster Table */}
            <RosterTable roster={teamStats.roster} backgroundColor={backgroundColor} textColor={textColor} />
          </div>
        )}
    </div>
  );
};

export default Team;
