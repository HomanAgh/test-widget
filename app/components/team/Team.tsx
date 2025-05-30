"use client";

import React, { useEffect, useState } from "react";
import RosterTable from "@/app/components/team/RosterTable";
import type { Team as TeamType, RosterPlayer } from "@/app/types/team";
import Link from "../common/style/Link"; // Import the Link component
import { TeamColumnOptions } from "./TeamColumnDefinitions";
import StatsTypeSelector from "@/app/components/common/StatsTypeSelector";
import SeasonSelector from "@/app/components/common/SeasonSelector";

interface TeamStats {
  team: TeamType;
  roster: RosterPlayer[];
}

interface TeamProps {
  teamId: string;
  season?: string;
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
  selectedColumns?: TeamColumnOptions;
  hideStatsTypeSelector?: boolean;
  hideSeasonSelector?: boolean;
  defaultStatsType?: "regular" | "postseason";
  onStatsTypeChange?: (statsType: "regular" | "postseason") => void;
  onSeasonChange?: (season: string) => void;
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

// Helper function to get current season
const getCurrentSeason = (): string => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11

  // Hockey season typically starts in September/October
  // If we're in Jan-Aug, we're in the season that started the previous year
  // If we're in Sep-Dec, we're in the season that started this year
  if (currentMonth >= 9) {
    // September or later - new season starting
    return `${currentYear}-${currentYear + 1}`;
  } else {
    // January to August - season that started last year
    return `${currentYear - 1}-${currentYear}`;
  }
};

const Team: React.FC<TeamProps> = ({
  teamId,
  season = getCurrentSeason(), // Dynamic default season
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  },
  selectedColumns = DEFAULT_COLUMNS,
  hideStatsTypeSelector = false,
  hideSeasonSelector = false,
  defaultStatsType = "regular",
  onStatsTypeChange,
  onSeasonChange,
}) => {
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>(season);
  const [statsType, setStatsType] = useState<"regular" | "postseason">(
    defaultStatsType
  );
  const [hasPlayoffStats, setHasPlayoffStats] = useState<boolean>(false);
  const [leagueSlug, setLeagueSlug] = useState<string>("");

  useEffect(() => {
    const fetchTeamStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const teamInfoResponse = await fetch(
          `/api/team/${encodeURIComponent(teamId)}`
        );
        if (!teamInfoResponse.ok) {
          throw new Error("Failed to fetch team information");
        }
        const teamInfo = await teamInfoResponse.json();

        // Extract league slug for SeasonSelector
        setLeagueSlug(teamInfo.leagueSlug || "");

        // Fetch roster data with season parameter
        const rosterResponse = await fetch(
          `/api/teamroster?teamId=${encodeURIComponent(
            teamId
          )}&season=${encodeURIComponent(selectedSeason)}`
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
  }, [teamId, selectedSeason]); // Add selectedSeason to dependencies

  // Handler for season change
  const handleSeasonChange = (newSeason: string) => {
    setSelectedSeason(newSeason);
    if (onSeasonChange) {
      onSeasonChange(newSeason);
    }
  };

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

            <div className="flex items-center space-x-4">
              {!hideSeasonSelector && leagueSlug && (
                <SeasonSelector
                  leagueSlug={leagueSlug}
                  initialSeason={selectedSeason}
                  onSeasonChange={handleSeasonChange}
                />
              )}

              {!hideStatsTypeSelector && (
                <StatsTypeSelector
                  statsType={statsType}
                  onChange={handleStatsTypeChange}
                  hasPlayoffStats={hasPlayoffStats}
                />
              )}
            </div>
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
