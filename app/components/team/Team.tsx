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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center">{teamStats.team.name}</h2>
            <p className="text-center text-gray-600">
              {`${"League"}: ${teamStats.team.league} | ${"Country"}: ${teamStats.team.country}`}
            </p>
          </div>
          <RosterTable roster={teamStats.roster} backgroundColor={backgroundColor} />
        </div>
      )}
    </div>
  );
};
export default Team;