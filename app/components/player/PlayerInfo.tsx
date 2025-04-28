import React from "react";
import { Player } from "@/app/types/player";
import Link from "../common/style/Link"; // Import the Link component
import { IoChevronUpOutline, IoChevronDownOutline } from "react-icons/io5";
import { useState } from "react";

interface PlayerInfoProps {
  player: Player;
  nameTextColor?: string;
  containerWidth?: string;
}

const formatSeason = (seasonSlug: string) => {
  const parts = seasonSlug.split("-");
  if (parts.length !== 2) return seasonSlug;
  return `${parts[0].replace(/^20/, "")}-${parts[1].replace(/^20/, "")}`;
};

const PlayerInfo: React.FC<PlayerInfoProps> = ({
  player,
  nameTextColor = "#0D73A6",
  containerWidth = "max-w-md",
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <div
      className={`font-montserrat overflow-hidden mb-0 ${containerWidth} mx-auto rounded-t-lg`}
    >
      <div className="px-0">
        {/* Player header section */}
        <div className="w-full">
          {/* Player name, team, etc. */}
          <div className="flex flex-col p-4">
            {/* Player name and flags */}
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex space-x-1">
                {player.flagUrls?.primary && (
                  <img
                    src={player.flagUrls.primary}
                    alt="Primary flag"
                    className="object-contain rounded-sm"
                    width={24}
                    height={16}
                  />
                )}
                {player.flagUrls?.secondary && (
                  <img
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
              {player.jerseyNumber && player.jerseyNumber !== "" && (
                <span className="mr-2">#{player.jerseyNumber}</span>
              )}
              {player.team ? (
                <Link
                  href={`https://www.eliteprospects.com/team/${player.team.id}/${player.team.name}/${player.season.slug}`}
                  className="hover:underline flex items-center"
                  style={{ color: nameTextColor }}
                >
                  {player.teamLogo && (
                    <img
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
              <div
                className="ml-2 cursor-pointer"
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              >
                {isDetailsOpen ? (
                  <IoChevronUpOutline className="w-5 h-5" />
                ) : (
                  <IoChevronDownOutline className="w-5 h-5" />
                )}
              </div>
            </div>

            {/* Player details dropdown */}
            {isDetailsOpen && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
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
                <div className="text-right font-semibold">
                  {player.placeOfBirth || "N/A"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
