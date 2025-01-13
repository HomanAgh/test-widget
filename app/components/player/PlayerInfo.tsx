import React from "react";
import { Player } from "@/app/types/player";
import Image from "next/image";
import Link from "../common/style/Link"; // Import the Link component

interface PlayerInfoProps {
  player: Player;
  textColor?: string; // <--- Add
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, textColor = "#000000" }) => {
  return (
    <div style={{ color: textColor }}>
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
        <div className="mt-4 md:mt-0 text-center md:text-left">
          {/* Flags and Player Name */}
          <div className="flex items-center space-x-2">
            {/* Primary Nationality Flag */}
            {player.flagUrls?.primary && (
              <Image
                src={player.flagUrls.primary}
                alt="Primary flag"
                className="object-contain"
                width={24}
                height={16}
              />
            )}
            {/* Secondary Nationality Flag */}
            {player.flagUrls?.secondary && (
              <Image
                src={player.flagUrls.secondary}
                alt="Secondary flag"
                className="object-contain"
                width={24}
                height={16}
              />
            )}
            {/* Player Name (Link) */}
            <Link href={`https://www.eliteprospects.com/player/${player.id}/${player.name}`}>
              <span style={{ fontSize: "1.25rem", fontWeight: "600" }}>{player.name}</span>
            </Link>
          </div>

          {/* Team and League Info */}
          <div className="mt-2">
            <p style={{ fontSize: "1rem", fontWeight: "500", color: textColor }}>
              <span> #{player.jerseyNumber} </span>
              {player.team ? (
                <Link href={`https://www.eliteprospects.com/team/${player.team.id}/${player.team.name}`}>
                  {player.team.name}
                </Link>
              ) : (
                "Unknown Team"
              )}
              {" / "}
              {player.league ? (
                <Link href={`https://www.eliteprospects.com/league/${player.league.slug}`}>
                  {player.league.name}
                </Link>
              ) : (
                "Unknown League"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
