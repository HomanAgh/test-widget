'use client';

import React, { useEffect, useState } from 'react';
import RosterTable from '@/app/components/team/RosterTable';
import type { Team as TeamType, RosterPlayer } from '@/app/types/team';

interface TeamProps {
  teamId: string;
  backgroundColor: string;
}

interface TeamStats {
  team: TeamType;
  roster: RosterPlayer[];
}

const Team: React.FC<TeamProps> = ({ teamId, backgroundColor }) => {
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
      className="max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-lg"
      style={{ backgroundColor }}
    >
      {teamStats && (
        <div>
          {/* Team Name and Logo */}
          <div className="mb-6 flex items-center justify-center space-x-4">
            {/* Medium Team Logo */}
            {teamStats.team.logoM && (
              <img
                src={teamStats.team.logoM}
                alt={`${teamStats.team.name} Logo`}
                className="w-12 h-auto"
              />
            )}
            {/* Team Name */}
            <h2 className="text-2xl font-bold">
              <a
                href={`https://www.eliteprospects.com/team/${teamStats.team.id}/${teamStats.team.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline hover:text-blue-800"
              >
                {teamStats.team.name}
              </a>
            </h2>
          </div>

          {/* League and Country */}
          <p className="text-center text-gray-600">
            <span>
              {"League"}:{" "}
              <a
                href={`https://www.eliteprospects.com/league/${teamStats.team.league.toLowerCase()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline hover:text-blue-800"
              >
                {teamStats.team.league}
              </a>
            </span>{" "}
            |{" "}
            <span>
              {"Country"}:{" "}
              <a
                href={`https://www.eliteprospects.com/nation/${teamStats.team.country}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline hover:text-blue-800"
              >
                {teamStats.team.country}
              </a>
            </span>
          </p>

          {/* Roster Table */}
          <RosterTable roster={teamStats.roster} backgroundColor={backgroundColor} />
        </div>
      )}
    </div>
  );
};

export default Team;
