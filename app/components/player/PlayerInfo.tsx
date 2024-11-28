import React from "react";
import Image from "next/image";

interface PlayerInfoProps {
  playerStats: {
    id: string;
    name: string;
    imageUrl: string;
    team?: { id: number; name: string };
    league?: { slug: string; name: string };
    nationality: string;
    jerseyNumber: string;
  };
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ playerStats }) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
      {/* Player Image */}
      <div className="w-40 h-40 rounded-lg overflow-hidden shadow-md border border-gray-300">
        <Image
          src={playerStats.imageUrl || "/default-image.jpg"}
          alt={playerStats.name || "Player Image"}
          width={160}
          height={160}
          className="object-cover"
        />
      </div>

      {/* Player Details */}
      <div className="mt-4 md:mt-0 text-center md:text-left">
        <div className="flex items-center space-x-2">
          <a
            href={`https://www.eliteprospects.com/player/${playerStats.id}/${playerStats.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-semibold text-gray-800 dark:text-gray-100 hover:underline"
          >
            {playerStats.name}
          </a>
          <span className="text-xl">{playerStats.nationality}</span>
        </div>

        <div className="mt-2">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
            <span>#{playerStats.jerseyNumber} </span>
            {playerStats.team ? (
              <a
                href={`https://www.eliteprospects.com/team/${playerStats.team.id}/${playerStats.team.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {playerStats.team.name}
              </a>
            ) : (
              "Unknown Team"
            )}
            {" / "}
            {playerStats.league ? (
              <a
                href={`https://www.eliteprospects.com/league/${playerStats.league.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {playerStats.league.name}
              </a>
            ) : (
              "Unknown League"
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
