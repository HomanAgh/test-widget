import React from "react";
import { Player } from "@/app/types/player";
import Image from 'next/image';

interface PlayerInfoProps {
  player: Player;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player }) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
      <div className="mt-4 md:mt-0 text-center md:text-left">
        {/* Flags and Player Name */}
        <div className="flex items-center space-x-2">
          {/* Primary Nationality Flag */}
          {player.flagUrls?.primary && (
            <Image
              src={player.flagUrls.primary}
              alt="Primary flag"
              className="w-6 h-4 object-contain"
            />
          )}
          {/* Secondary Nationality Flag */}
          {player.flagUrls?.secondary && (
            <Image
              src={player.flagUrls.secondary}
              alt="Secondary flag"
              className="w-6 h-4 object-contain"
            />
          )}
          {/* Player Name */}
          <a
            href={`https://www.eliteprospects.com/player/${player.id}/${player.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-semibold text-blue-800 text-blue-800 hover:underline hover:text-blue-800"
          >
            {player.name}
          </a>
        </div>

        {/* Team and League Info */}
        <div className="mt-2">
          <p className="text-lg font-medium text-blue-800">
            <span> #{player.jerseyNumber} </span>
            {player.team ? (
              <a
                href={`https://www.eliteprospects.com/team/${player.team.id}/${player.team.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-blue-800"
              >
                {player.team.name}
              </a>
            ) : (
              "Unknown Team" // Fallback
            )}
            {" / "}
            {player.league ? (
              <a
                href={`https://www.eliteprospects.com/league/${player.league.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-blue-800"
              >
                {player.league.name}
              </a>
            ) : (
              "Unknown League" // Fallback
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
