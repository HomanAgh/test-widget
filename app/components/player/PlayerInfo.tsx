"use client";

import React from "react";
import Image from "next/image";
import { Player } from "@/app/types/player";

interface PlayerInfoProps {
  player: Player;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player }) => {

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
      <div className="w-40 h-40 rounded-lg overflow-hidden shadow-md border border-gray-300">
        <Image
          src={player.imageUrl || "/default-image.jpg"}
          alt={"Player Image Alt"} // Translatable alt text
          width={160}
          height={160}
          className="object-cover"
        />
      </div>

      <div className="mt-4 md:mt-0 text-center md:text-left">
        <div className="flex items-center space-x-2">
          <a
            href={`https://www.eliteprospects.com/player/${player.id}/${player.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-semibold text-gray-800 dark:text-gray-100 hover:underline"
          >
            {player.name}
          </a>
          <span className="text-xl">{player.nationality}</span>
        </div>

        <div className="mt-2">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
            <span> #{player.jerseyNumber} </span>
            {player.team ? (
              <a
                href={`https://www.eliteprospects.com/team/${player.team.id}/${player.team.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {player.team.name}
              </a>
            ) : (
              "Unknown Team" // Translatable fallback
            )}
            {" / "}
            {player.league ? (
              <a
                href={`https://www.eliteprospects.com/league/${player.league.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {player.league.name}
              </a>
            ) : (
              "Unknown League" // Translatable fallback
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
