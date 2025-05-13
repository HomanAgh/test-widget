'use client';

import { PlayoffSeries, PlayoffTeam } from '@/app/types/leaguePlayoff';
import Image from 'next/image';

interface SeriesCardProps {
  series: PlayoffSeries;
  align: 'left' | 'right' | 'center';
}

export default function SeriesCard({ series, align }: SeriesCardProps) {
  // Check if this is an "empty" series (when both teams are not yet determined)
  const isEmpty = !series.team1?.id || !series.team2?.id;
  
  const team1Wins = series.team1Wins;
  const team2Wins = series.team2Wins;
  const seriesScore = `${team1Wins}-${team2Wins}`;
  const isCompleted = series.status === 'COMPLETED';
  const team1IsWinner = isCompleted && team1Wins > team2Wins;
  const team2IsWinner = isCompleted && team2Wins > team1Wins;
  const isRightAligned = align === "right";
  const isCenterAligned = align === "center";
  
  // Find the next upcoming game in the series
  const getNextGameDate = () => {
    if (isCompleted || !series.games || series.games.length === 0) return null;
    
    // Filter for upcoming or in-progress games and sort by date
    const upcomingGames = series.games
      .filter(game => game.status === 'UPCOMING' || game.status === 'LIVE')
      .sort((a, b) => {
        if (!a.dateTime || !b.dateTime) return 0;
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
      });
    
    if (upcomingGames.length === 0) return null;
    
    const nextGame = upcomingGames[0];
    if (!nextGame.date) return null;
    
    // Format date: e.g., "May 7, 19:00" with capitalized month
    try {
      const gameDate = new Date(nextGame.dateTime || nextGame.date);
      // Use English locale specifically
      let month = gameDate.toLocaleString('en-US', { month: 'short' });
      // Ensure first letter is capitalized
      month = month.charAt(0).toUpperCase() + month.slice(1);
      const day = gameDate.getDate();
      const time = gameDate.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false });
      
      return `${month} ${day}, ${time}`;
    } catch {
      // Fallback to raw date if parsing fails
      return nextGame.date;
    }
  };
  
  // Next game date text
  const nextGameDate = getNextGameDate();
  
  // Status text (Final, In Progress, Upcoming)
  const getStatusText = () => {
    const statusClass = isCenterAligned ? "justify-center text-center" : "";
    
    if (isEmpty) {
      return <span className="text-sm font-semibold text-gray-400">TO BE DETERMINED</span>;
    } else if (isCompleted) {
      return <span className="text-sm font-semibold text-green-600">FINAL</span>;
    } else if (series.status === 'IN_PROGRESS') {
      return (
        <div className={`flex flex-wrap items-center gap-1 ${statusClass}`}>
          <span className="text-sm font-semibold text-blue-600">IN PROGRESS</span>
          {nextGameDate && <span className="text-xs text-gray-500 font-medium">• Next game: {nextGameDate}</span>}
        </div>
      );
    } else {
      return (
        <div className={`flex flex-wrap items-center gap-1 ${statusClass}`}>
          <span className="text-sm font-semibold text-amber-600">UPCOMING</span>
          {nextGameDate && <span className="text-xs text-gray-500 font-medium">• Next game: {nextGameDate}</span>}
        </div>
      );
    }
  };
  
  // Series score text
  const seriesScoreText = (team1Wins > 0 || team2Wins > 0) ? (
    <span className="text-sm font-medium text-green-500">Series: {seriesScore}</span>
  ) : null;
  
  // For center alignment, center the header content
  const headerClass = isCenterAligned 
    ? "flex flex-col items-center gap-1 mb-2" 
    : `flex justify-between items-center mb-2 ${isRightAligned ? "flex-row-reverse" : "flex-row"}`;
  
  return (
    <div className="border rounded-lg shadow-sm p-4 bg-[#2C2C2C] text-white">
      <div className={headerClass}>
        <div className={`flex flex-col ${isCenterAligned ? "items-center" : ""}`}>
          {getStatusText()}
        </div>
        {!isCompleted && !isEmpty && seriesScoreText}
      </div>
      
      <div className="flex flex-col gap-3 w-full">
        <div className="w-full flex justify-center">
          <TeamRow 
            team={series.team1} 
            isWinner={team1IsWinner} 
            isEliminated={isCompleted && !team1IsWinner}
            wins={team1Wins} 
            align={align}
            isEmpty={isEmpty}
            position="top"
          />
        </div>
        <div className="border-b border-gray-700"></div>
        <div className="w-full flex justify-center">
          <TeamRow 
            team={series.team2} 
            isWinner={team2IsWinner} 
            isEliminated={isCompleted && !team2IsWinner}
            wins={team2Wins} 
            align={align}
            isEmpty={isEmpty}
            position="bottom"
          />
        </div>
      </div>
      
      {/* Winner display */}
      {isCompleted && !isEmpty && (
        <>
          <div className="mt-3 border-t border-gray-700 pt-2 text-center">
            <div className="flex items-center justify-center gap-2 text-xs">
              <span className="text-green-500 font-medium">
                Winner: {team1IsWinner ? series.team1.name : series.team2.name}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-green-500">Series: {seriesScore}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface TeamRowProps {
  team: PlayoffTeam;
  isWinner: boolean;
  isEliminated: boolean;
  wins: number;
  align: 'left' | 'right' | 'center';
  isEmpty: boolean;
  position: 'top' | 'bottom';
}

function TeamRow({ team, isWinner, isEliminated, wins, align, isEmpty, position }: TeamRowProps) {
  const isRightAligned = align === "right";
  const isCenterAligned = align === "center";
  
  // If this is an empty card, show placeholder
  if (isEmpty) {
    const placeholderText = position === 'top' ? '1st Place' : '2nd Place';
    
    return (
      <div className="flex items-center py-2 max-w-[80%]">
        <div className="flex items-center gap-3">
          {/* Placeholder Logo */}
          <div className="w-10 h-10 bg-gray-700 flex-shrink-0 flex items-center justify-center rounded-full opacity-50">
            <span className="text-xs font-bold text-gray-400">TBD</span>
          </div>
          
          {/* Placeholder Team Name */}
          <div className="flex items-center gap-2">
            <span className="text-base text-gray-500">{placeholderText}</span>
            <span className="text-gray-700">•</span>
            <span className="text-base text-gray-500">0</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Create name-score element based on alignment
  const renderNameAndScore = () => {
    // Base styles for text elements
    const nameClass = `text-base ${isWinner ? 'font-bold text-white' : isEliminated ? 'text-gray-400' : 'text-gray-200'}`;
    const scoreClass = `text-base ${isWinner ? 'font-bold text-white' : isEliminated ? 'text-gray-400' : 'text-gray-200'}`;
    
    // For right alignment: score • name
    if (isRightAligned && !isCenterAligned) {
      return (
        <div className="flex items-center gap-2">
          <span className={scoreClass}>{wins}</span>
          <span className="text-gray-500">•</span>
          <span className={nameClass}>{team.name}</span>
        </div>
      );
    }
    
    // For left/center alignment: name • score
    return (
      <div className="flex items-center gap-2">
        <span className={nameClass}>{team.name}</span>
        <span className="text-gray-500">•</span>
        <span className={scoreClass}>{wins}</span>
      </div>
    );
  };
  
  return (
    <div className="flex items-center py-2 max-w-[80%]">
      {/* Logo and Team Info with gap between them - order depends on alignment */}
      {isRightAligned && !isCenterAligned ? (
        // Right aligned: Team info then logo
        <div className="flex items-center gap-3">
          {renderNameAndScore()}
          
          {/* Logo */}
          {team.logo ? (
            <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-center">
              <Image
                src={team.logo}
                alt={team.name}
                width={40}
                height={40}
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gray-700 flex-shrink-0 flex items-center justify-center rounded-full">
              <span className="text-sm font-bold">{team.name.substring(0, 3)}</span>
            </div>
          )}
        </div>
      ) : (
        // Left/Center aligned: Logo then team info
        <div className="flex items-center gap-3">
          {/* Logo */}
          {team.logo ? (
            <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-center">
              <Image
                src={team.logo}
                alt={team.name}
                width={40}
                height={40}
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gray-700 flex-shrink-0 flex items-center justify-center rounded-full">
              <span className="text-sm font-bold">{team.name.substring(0, 3)}</span>
            </div>
          )}
          
          {/* Team Name and Score */}
          {renderNameAndScore()}
        </div>
      )}
    </div>
  );
} 