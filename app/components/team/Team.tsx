"use client";

import React, { useEffect, useState } from "react";
import RosterTable from "@/app/components/team/RosterTable";
import type { Team as TeamType, RosterPlayer } from "@/app/types/team";
import Link from "../common/style/Link"; // Import the Link component
import { TeamColumnOptions } from "./TeamColumnDefinitions";
import StatsTypeSelector from "@/app/components/common/StatsTypeSelector";

interface TeamStats {
  team: TeamType;
  roster: RosterPlayer[];
}

interface TeamProps {
  teamId: string;
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
  selectedColumns?: TeamColumnOptions;
  hideStatsTypeSelector?: boolean;
  defaultStatsType?: "regular" | "postseason";
  onStatsTypeChange?: (statsType: "regular" | "postseason") => void;
}

const DEFAULT_COLUMNS: TeamColumnOptions = {
  name: true,
  number: true,
  position: true,
  age: true,
  birthYear: true,
  birthPlace: true,
  weight: true,
  height: true,
  shootsCatches: true,
  games: true,
  goals: true,
  assists: true,
  points: true,
};

const Team: React.FC<TeamProps> = ({
  teamId,
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  },
  selectedColumns = DEFAULT_COLUMNS,
  hideStatsTypeSelector = false,
  defaultStatsType = "regular",
  onStatsTypeChange,
}) => {
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsType, setStatsType] = useState<"regular" | "postseason">(
    defaultStatsType
  );
  const [hasPlayoffStats, setHasPlayoffStats] = useState<boolean>(false);

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        const teamInfoResponse = await fetch(
          `/api/team/${encodeURIComponent(teamId)}`
        );
        if (!teamInfoResponse.ok) {
          throw new Error("Failed to fetch team information");
        }
        const teamInfo = await teamInfoResponse.json();

        // Fetch roster data
        const rosterResponse = await fetch(
          `/api/teamroster?teamId=${encodeURIComponent(teamId)}`
        );
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

        // Check if any player has playoff stats
        const hasPlayoffs = roster.some(
          (player: RosterPlayer) =>
            player.stats?.postseason?.gamesPlayed > 0 ||
            player.stats?.postseason?.points > 0
        );
        setHasPlayoffStats(hasPlayoffs);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamStats();
  }, [teamId]);

  // Handler for stats type change
  const handleStatsTypeChange = (newStatsType: "regular" | "postseason") => {
    setStatsType(newStatsType);
    if (onStatsTypeChange) {
      onStatsTypeChange(newStatsType);
    }
  };

  if (loading)
    return <div className="text-center text-gray-600">{"Loading..."}</div>;
  if (error)
    return (
      <div className="text-center text-red-600">
        {"An error occurred"}: {error}
      </div>
    );

  return (
    <div
      className="max-w-4xl mx-auto my-8 p-6 rounded-lg"
      style={{ color: customColors.textColor }}
    >
      {teamStats && (
        <div className="font-montserrat">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {teamStats.team.logoM && (
                <img
                  src={teamStats.team.logoM}
                  alt={`${teamStats.team.name} Logo`}
                  width={48}
                  height={48}
                />
              )}
              <div className="flex flex-col">
                <h2 className="text-[24px] font-bold leading-[26px]">
                  <Link
                    href={`https://www.eliteprospects.com/team/${teamStats.team.id}/${teamStats.team.name}`}
                    style={{ color: customColors.nameTextColor }}
                  >
                    {teamStats.team.name}
                  </Link>
                </h2>
                <p className="text-[16px] font-semibold">
                  <Link
                    href={`https://www.eliteprospects.com/league/${teamStats.team.league.toLowerCase()}`}
                    style={{ color: customColors.nameTextColor }}
                  >
                    {teamStats.team.league}
                  </Link>
                </p>
              </div>
            </div>

            {!hideStatsTypeSelector && (
              <StatsTypeSelector
                statsType={statsType}
                onChange={handleStatsTypeChange}
                hasPlayoffStats={hasPlayoffStats}
              />
            )}
          </div>
          <RosterTable
            roster={teamStats.roster}
            customColors={customColors}
            selectedColumns={selectedColumns}
            statsType={statsType}
          />
        </div>
      )}
    </div>
  );
};

export default Team;
