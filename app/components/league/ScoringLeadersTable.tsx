'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ScoringLeadersTableProps } from '@/app/types/scoringLeaders';
import { 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell,
  TableContainer,
  Link
} from '@/app/components/common/style';
import { HiMiniChevronUpDown, HiMiniChevronUp, HiMiniChevronDown } from "react-icons/hi2";

const ScoringLeadersTable: React.FC<ScoringLeadersTableProps> = ({ scoringLeaders}) => {
  // Sorting state - default to TP column with descending order (highest first)
  const [sortColumn, setSortColumn] = useState<string>('TP');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | 'none'>('desc');
  
  if (!scoringLeaders || !scoringLeaders.data || scoringLeaders.data.length === 0) {
    return <div className="text-center py-4">No scoring data available</div>;
  }

  // Helper function to get nationality name
  const getNationalityName = (nationality: any): string => {
    if (!nationality) return 'Country';
    if (typeof nationality === 'string') return nationality;
    if (typeof nationality === 'object' && nationality.name) return nationality.name;
    return 'Country';
  };

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle sort direction
      setSortDirection(prev => {
        if (prev === 'desc') return 'asc';
        if (prev === 'asc') return 'none';
        return 'desc';
      });
    } else {
      // Set new sort column and default to ascending
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Render sort arrow
  const renderSortArrow = (column: string) => {
    if (sortColumn !== column) {
      return <HiMiniChevronUpDown className="inline-block text-gray-300" />;
    }
    
    if (sortDirection === 'desc') {
      return <HiMiniChevronDown className="inline-block text-gray-300" />;
    }
    
    if (sortDirection === 'asc') {
      return <HiMiniChevronUp className="inline-block text-gray-300" />;
    }
    
    return <HiMiniChevronUpDown className="inline-block text-gray-300" />;
  };

  // Sort the data
  const sortedData = [...scoringLeaders.data].sort((a, b) => {
    let result = 0;
    
    switch (sortColumn) {
      case 'player':
        const playerNameA = `${a.player.firstName} ${a.player.lastName}`.toLowerCase();
        const playerNameB = `${b.player.firstName} ${b.player.lastName}`.toLowerCase();
        result = playerNameB.localeCompare(playerNameA);
        break;
      case 'team':
        const teamNameA = a.team.name.toLowerCase();
        const teamNameB = b.team.name.toLowerCase();
        result = teamNameB.localeCompare(teamNameA);
        break;
      case 'GP':
        result = (a.regularStats?.GP || 0) - (b.regularStats?.GP || 0);
        break;
      case 'G':
        result = (a.regularStats?.G || 0) - (b.regularStats?.G || 0);
        break;
      case 'A':
        result = (a.regularStats?.A || 0) - (b.regularStats?.A || 0);
        break;
      case 'TP':
        // For TP, we want highest first when desc (default)
        result = (a.regularStats?.PTS || 0) - (b.regularStats?.PTS || 0);
        break;
      default:
        // Default sort by points
        result = (a.regularStats?.PTS || 0) - (b.regularStats?.PTS || 0);
    }
    
    // If sort direction is 'none', return to default sort (points descending)
    if (sortDirection === 'none') {
      return (a.regularStats?.PTS || 0) - (b.regularStats?.PTS || 0);
    }
    
    // For desc, we want highest values first (negative result)
    // For asc, we want lowest values first (positive result)
    return sortDirection === 'desc' ? -result : result;
  });

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell isHeader align="left">#</TableCell>
              <TableCell 
                isHeader 
                align="left" 
                className="cursor-pointer"
                onClick={() => handleSort('player')}
              >
                Player {renderSortArrow('player')}
              </TableCell>
              <TableCell 
                isHeader 
                align="left"
                className="cursor-pointer"
                onClick={() => handleSort('team')}
              >
                Team {renderSortArrow('team')}
              </TableCell>
              <TableCell 
                isHeader 
                align="center"
                className="cursor-pointer"
                onClick={() => handleSort('GP')}
              >
                GP {renderSortArrow('GP')}
              </TableCell>
              <TableCell 
                isHeader 
                align="center"
                className="cursor-pointer"
                onClick={() => handleSort('G')}
              >
                G {renderSortArrow('G')}
              </TableCell>
              <TableCell 
                isHeader 
                align="center"
                className="cursor-pointer"
                onClick={() => handleSort('A')}
              >
                A {renderSortArrow('A')}
              </TableCell>
              <TableCell 
                isHeader 
                align="center"
                className="cursor-pointer"
                onClick={() => handleSort('TP')}
              >
                TP {renderSortArrow('TP')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((player, index) => {
              // Ensure player and team data exists
              if (!player.player || !player.team) {
                console.error('Missing player or team data:', player);
                return null;
              }

              const playerUrl = player.player.links?.eliteprospectsUrl || 
                (player.player.slug ? `/player/${player.player.slug}` : `#player-${player.player.id}`);

              const nationalityName = getNationalityName(player.player.nationality);

              return (
                <TableRow 
                  key={`${player.id}-${player.player.id}-${index}`}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <TableCell align="left">
                    {index + 1}.
                  </TableCell>
                  <TableCell align="left">
                    <div className="flex items-center">
                      {player.player.flagUrl && (
                        <div className="flex-shrink-0 mr-2">
                          <Image
                            src={player.player.flagUrl}
                            alt={`${nationalityName} flag`}
                            width={16}
                            height={12}
                            className="inline-block"
                          />
                        </div>
                      )}
                      <div>
                        <Link 
                          href={playerUrl}
                          className="text-[#0D73A6] hover:underline"
                        >
                          {typeof player.player.firstName === 'string' ? player.player.firstName : ''} {typeof player.player.lastName === 'string' ? player.player.lastName : ''}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="left">
                    <div className="flex items-center">
                      {player.team.logo?.small && (
                        <div className="flex-shrink-0 mr-2">
                          <Image
                            src={player.team.logo.small}
                            alt={`${player.team.name} logo`}
                            width={20}
                            height={20}
                            className="inline-block"
                          />
                        </div>
                      )}
                      <div>
                        {player.team.links?.eliteprospectsUrl ? (
                          <Link
                            href={player.team.links.eliteprospectsUrl}
                            className="text-[#0D73A6] hover:underline"
                          >
                            {typeof player.team.name === 'string' ? player.team.name : 'Team'}
                          </Link>
                        ) : (
                          typeof player.team.name === 'string' ? player.team.name : 'Team'
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="center">{player.regularStats?.GP || 0}</TableCell>
                  <TableCell align="center">{player.regularStats?.G || 0}</TableCell>
                  <TableCell align="center">{player.regularStats?.A || 0}</TableCell>
                  <TableCell align="center" className="font-bold">{player.regularStats?.PTS || 0}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

// Export the component and the URL generation function
export const getEliteProspectsStatsUrl = (leagueSlug: string, season: string) => {
  return `https://www.eliteprospects.com/league/${leagueSlug}/stats/${season}`;
};

export default ScoringLeadersTable; 