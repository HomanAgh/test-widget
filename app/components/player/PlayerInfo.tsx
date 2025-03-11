import React from "react";
import { Player } from "@/app/types/player";
import Image from "next/image";
import Link from "../common/style/Link"; // Import the Link component

interface PlayerInfoProps {
  player: Player;
  nameTextColor?: string;
  tableBackgroundColor?: string;
}

const formatSeason = (seasonSlug: string) => {
  const parts = seasonSlug.split("-");
  if (parts.length !== 2) return seasonSlug;
  return `${parts[0].replace(/^20/, "")}-${parts[1].replace(/^20/, "")}`;
};

const PlayerInfo: React.FC<PlayerInfoProps> = ({ 
  player, 
  nameTextColor = "#0D73A6",
  tableBackgroundColor = "#FFFFFF"
}) => {
  return (
    <div className="font-montserrat rounded-lg overflow-hidden mb-0" style={{ backgroundColor: tableBackgroundColor }}>
      <div className="p-4">
        {/* Player header section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          {/* Left column - Player name, team, etc. */}
          <div className="flex-1">
            {/* Player name and flags */}
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex space-x-1">
                {player.flagUrls?.primary && (
                  <Image
                    src={player.flagUrls.primary}
                    alt="Primary flag"
                    className="object-contain rounded-sm"
                    width={24}
                    height={16}
                  />
                )}
                {player.flagUrls?.secondary && (
                  <Image
                    src={player.flagUrls.secondary}
                    alt="Secondary flag"
                    className="object-contain rounded-sm"
                    width={24}
                    height={16}
                  />
                )}
              </div>
              <Link
                href={`https://www.eliteprospects.com/player/${player.id}/${player.name}`}
                className="text-xl font-semibold hover:underline"
                style={{ color: nameTextColor }}
              >
                {player.name}
              </Link>
            </div>

            {/* Team and league info */}
            <div className="flex items-center flex-wrap text-base font-medium mb-2">
              <span className="mr-2">#{player.jerseyNumber}</span>
              {player.team ? (
                <Link
                  href={`https://www.eliteprospects.com/team/${player.team.id}/${player.team.name}/${player.season.slug}`}
                  className="hover:underline flex items-center"
                  style={{ color: nameTextColor }}
                >
                  {player.teamLogo && (
                    <Image
                      src={player.teamLogo}
                      alt={`${player.team.name} Logo`}
                      width={20}
                      height={20}
                      className="object-contain mr-1"
                    />
                  )}
                  <span>{player.team.name}</span>
                </Link>
              ) : (
                <span>Unknown Team</span>
              )}
              <span className="mx-2">/</span>
              {player.league ? (
                <Link
                  href={`https://www.eliteprospects.com/league/${player.league.slug}/${player.season.slug}`}
                  className="hover:underline"
                  style={{ color: nameTextColor }}
                >
                  {player.league.name} {formatSeason(player.season.slug)}
                </Link>
              ) : (
                <span>Unknown League</span>
              )}
            </div>

            {/* Cap Hit */}
            {player.capHit !== null && (
              <div className="text-base font-medium">
                Cap Hit: <span className="font-semibold">{player.capHit}</span>
              </div>
            )}
          </div>

          {/* Right column - Player details */}
          <div className="rounded-lg p-3 w-full md:w-auto" style={{ backgroundColor: tableBackgroundColor === "#FFFFFF" ? "#F3F4F6" : tableBackgroundColor }}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {/* Age */}
              <div className="font-medium text-gray-700">Age:</div>
              <div className="text-right font-semibold">{player.age}</div>
              
              {/* Height */}
              <div className="font-medium text-gray-700">Height:</div>
              <div className="text-right font-semibold">
                {player.heightMet} cm / {player.heightImp}
              </div>
              
              {/* Weight */}
              <div className="font-medium text-gray-700">Weight:</div>
              <div className="text-right font-semibold">
                {player.weightMet} kg / {player.weightImp} lbs
              </div>
              
              {/* Place of birth */}
              <div className="font-medium text-gray-700">Place of birth:</div>
              <div className="text-right font-semibold">{player.placeOfBirth || "N/A"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
