import React from "react";
import { Player } from "@/app/types/player";
import Image from "next/image";
import Link from "../common/style/Link"; // Import the Link component

interface PlayerInfoProps {
  player: Player;
}

const formatSeason = (seasonSlug: string) => {
  const parts = seasonSlug.split("-");
  if (parts.length !== 2) return seasonSlug;
  return `${parts[0].replace(/^20/, "")}-${parts[1].replace(/^20/, "")}`;
};


const PlayerInfo: React.FC<PlayerInfoProps> = ({ player }) => {
  return (
    <div className="font-montserrat">
      <div className="md:flex md:justify-between items-start p-6">
        <div className="md:w-2/3">
          <div className="flex items-center space-x-2">
            {player.flagUrls?.primary && (
              <Image
                src={player.flagUrls.primary}
                alt="Primary flag"
                className="object-contain"
                width={24}
                height={16}
              />
            )}
            {player.flagUrls?.secondary && (
              <Image
                src={player.flagUrls.secondary}
                alt="Secondary flag"
                className="object-contain"
                width={24}
                height={16}
              />
            )}
            <Link
              href={`https://www.eliteprospects.com/player/${player.id}/${player.name}`}
            >
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#0D73A6",
                }}
              >
                {player.name}
              </span>
            </Link>
          </div>

          <div className="mt-2">
            <p style={{ fontSize: "1rem", fontWeight: "500" }}>
              <span> #{player.jerseyNumber} </span>
              {player.team ? (
                <Link
                  href={`https://www.eliteprospects.com/team/${player.team.id}/${player.team.name}/${player.season.slug}`}
                  style={{ color: "#0D73A6" }}
                >
                  {player.teamLogo && (
                    <Image
                      src={player.teamLogo}
                      alt={`${player.team.name} Logo`}
                      layout="intrinsic"
                      width={20}
                      height={20}
                      className="object-contain inline-block mr-1"
                    />
                  )}
                  {player.team.name}
                </Link>
              ) : (
                "Unknown Team"
              )}
              <span> / </span>
              {player.league ? (
                <Link
                  href={`https://www.eliteprospects.com/league/${player.league.slug}/${player.season.slug}`}
                  style={{ color: "#0D73A6" }}
                >
                  {player.league.name} {formatSeason(player.season.slug)}
                </Link>
              ) : (
                "Unknown League"
              )}
            </p>
          </div>
          {player.capHit !== null && (
            <div
              className="col-span-2 pt-2 text-left whitespace-nowrap"
              style={{ fontSize: "1rem", fontWeight: "500" }}
            >
              Cap Hit: {player.capHit}
            </div>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-800">
          {/* Age */}
          <div className="col-span-2 text-left whitespace-nowrap">Age:</div>
          <div className="col-span-2 text-right whitespace-nowrap">{player.age}</div>
          {/* Height */}
          <div className="col-span-2 text-left whitespace-nowrap">Height:</div>
          <div className="col-span-2 text-right whitespace-nowrap">
            {player.heightMet} cm / {player.heightImp}
          </div>
          {/* Weight */}
          <div className="col-span-2 text-left whitespace-nowrap">Weight:</div>
          <div className="col-span-2 text-right whitespace-nowrap">
            {player.weightMet} kg / {player.weightImp} lbs
          </div>
          {/* Cap Hit */}
          <div className="col-span-2 text-left whitespace-nowrap">Place of birth:</div>
          <div className="col-span-2 text-right whitespace-nowrap">{player.placeOfBirth || "N/A"}</div>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
