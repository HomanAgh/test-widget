'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GoalieLeadersTableProps } from '@/app/types/goalieLeaders';
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

const GoalieLeadersTable: React.FC<GoalieLeadersTableProps> = ({ 
  goalieLeaders,
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6"
  }
}) => {
  // Sorting state - default to SVP column with descending order (highest first)
  const [sortColumn, setSortColumn] = useState<string>('SVP');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | 'none'>('desc');
  
  const isCustomColor =
    customColors.tableBackgroundColor.toLowerCase() !== "#ffffff" &&
    customColors.tableBackgroundColor.toLowerCase() !== "#fff";
  
  if (!goalieLeaders || !goalieLeaders.data || goalieLeaders.data.length === 0) {
    return <div className="text-center py-4">No goalie data available</div>;
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
      return <HiMiniChevronUpDown key={`${column}-updown`} className="inline-block text-gray-300" />;
    }
    
    if (sortDirection === 'desc') {
      return <HiMiniChevronDown key={`${column}-down`} className="inline-block text-gray-300" />;
    }
    
    if (sortDirection === 'asc') {
      return <HiMiniChevronUp key={`${column}-up`} className="inline-block text-gray-300" />;
    }
    
    return <HiMiniChevronUpDown key={`${column}-default`} className="inline-block text-gray-300" />;
  };

  // Format save percentage to display as .XXX
  const formatSVP = (svp: number | undefined): string => {
    if (svp === undefined) return '.000';
    
    // The SVP value needs to be properly formatted as a 3-decimal percentage
    // For example, if the value is 926, it should display as .926
    
    // Convert to string
    let svpString = svp.toString();
    
    // If the value already contains a decimal point, we need to handle it differently
    if (svpString.includes('.')) {
      // Remove the decimal and ensure 3 digits
      svpString = svpString.replace('.', '');
      // Pad with zeros if needed
      while (svpString.length < 3) {
        svpString = '0' + svpString;
      }
    } else {
      // Pad with leading zeros if needed for whole numbers
      while (svpString.length < 3) {
        svpString = '0' + svpString;
      }
    }
    
    // Insert decimal point at the beginning
    return '.' + svpString;
  };

  // Format GAA to display with 2 decimal places
  const formatGAA = (gaa: number | undefined): string => {
    if (gaa === undefined) return '0.00';
    return gaa.toFixed(2);
  };

  // Sort the data
  const sortedData = [...goalieLeaders.data].sort((a, b) => {
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
      case 'GAA':
        result = (a.regularStats?.GAA || 0) - (b.regularStats?.GAA || 0);
        break;
      case 'SVP':
        result = (a.regularStats?.SVP || 0) - (b.regularStats?.SVP || 0);
        break;
      default:
        // Default sort by save percentage
        result = (a.regularStats?.SVP || 0) - (b.regularStats?.SVP || 0);
    }
    
    // If sort direction is 'none', return to default sort (SVP descending)
    if (sortDirection === 'none') {
      return (b.regularStats?.SVP || 0) - (a.regularStats?.SVP || 0);
    }
    
    // For desc, we want highest values first (negative result)
    // For asc, we want lowest values first (positive result)
    // Special case for GAA where lower is better
    if (sortColumn === 'GAA') {
      return sortDirection === 'desc' ? result : -result;
    }
    
    return sortDirection === 'desc' ? -result : result;
  });

  // Header cells with keys
  const headerCells = [
    { key: 'rank', label: 'Rank', align: 'center' },
    { key: 'player', label: 'Player', align: 'left' },
    { key: 'team', label: 'Team', align: 'left' },
    { key: 'GP', label: 'GP', align: 'center' },
    { key: 'GAA', label: 'GAA', align: 'center' },
    { key: 'SVP', label: 'SV%', align: 'center' },
  ];

  return (
    <TableContainer>
      <Table tableBgColor={customColors.tableBackgroundColor} tableTextColor={customColors.textColor}>
        <TableHead bgColor={customColors.backgroundColor} textColor={customColors.headerTextColor}>
          <TableRow key="header-row" bgColor={customColors.backgroundColor}>
            {headerCells.map(cell => (
              <TableCell 
                key={`header-${cell.key}`} 
                isHeader 
                align={cell.align as any} 
                className="cursor-pointer" 
                onClick={() => handleSort(cell.key)}
              >
                <span>{cell.label}</span> {renderSortArrow(cell.key)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((goalie, index) => {
            const nationalityName = getNationalityName(goalie.player.nationality);
            
            // Prioritize EliteProspects URL for player links
            const playerUrl = goalie.player.links?.eliteprospectsUrl || 
              (goalie.player.id ? `https://www.eliteprospects.com/player/${goalie.player.id}/${goalie.player.lastName?.toLowerCase()}-${goalie.player.firstName?.toLowerCase()}` : 
              (goalie.player.slug ? `/player/${goalie.player.slug}` : '#'));
              
            const teamUrl = goalie.team.links?.eliteprospectsUrl || 
              (goalie.team.slug ? `/team/${goalie.team.slug}` : `#team-${goalie.team.id}`);
            
            // Create a unique key using index as fallback when id is undefined
            const uniqueKey = goalie.id ? `goalie-${goalie.id}` : `goalie-index-${index}`;
            
            return (
              <TableRow 
                key={`row-${uniqueKey}`} 
                bgColor={isCustomColor ? customColors.tableBackgroundColor : index % 2 === 0 ? "#F3F4F6" : "#FFFFFF"}
              >
                <TableCell key={`rank-${uniqueKey}`} align="left">
                  {index + 1}.
                </TableCell>
                <TableCell key={`player-${uniqueKey}`} align="left">
                  <div className="flex items-center">
                    {goalie.player.flagUrl && (
                      <div key={`flag-container-${goalie.player.id || index}`} className="flex-shrink-0 mr-2">
                        <Image
                          key={`flag-${goalie.player.id || index}`}
                          src={goalie.player.flagUrl}
                          alt={`${nationalityName} flag`}
                          width={16}
                          height={12}
                          className="inline-block"
                        />
                      </div>
                    )}
                    <div key={`player-name-${goalie.player.id || index}`}>
                      <Link 
                        key={`player-link-${goalie.player.id || index}`}
                        href={playerUrl}
                        style={{ color: customColors.nameTextColor }}
                        className="hover:underline"
                      >
                        {typeof goalie.player.firstName === 'string' ? goalie.player.firstName : ''} {typeof goalie.player.lastName === 'string' ? goalie.player.lastName : ''}
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell key={`team-${uniqueKey}`} align="left">
                  <div className="flex items-center">
                    {goalie.team.logo?.small && (
                      <div key={`logo-container-${goalie.team.id || index}`} className="flex-shrink-0 mr-2">
                        <Image
                          key={`logo-${goalie.team.id || index}`}
                          src={goalie.team.logo.small}
                          alt={`${goalie.team.name} logo`}
                          width={20}
                          height={20}
                          className="inline-block"
                        />
                      </div>
                    )}
                    <div key={`team-name-${goalie.team.id || index}`}>
                      <Link 
                        key={`team-link-${goalie.team.id || index}`}
                        href={teamUrl}
                        style={{ color: customColors.nameTextColor }}
                        className="hover:underline"
                      >
                        {goalie.team.name}
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell key={`gp-${uniqueKey}`} align="center">{goalie.regularStats?.GP || 0}</TableCell>
                <TableCell key={`gaa-${uniqueKey}`} align="center">{formatGAA(goalie.regularStats?.GAA)}</TableCell>
                <TableCell key={`svp-${uniqueKey}`} align="center">{formatSVP(goalie.regularStats?.SVP)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Export the component and the URL generation function
export const getEliteProspectsStatsUrl = (leagueSlug: string, season: string) => {
  return `https://www.eliteprospects.com/league/${leagueSlug}/stats/${season}?position=G`;
};

export default GoalieLeadersTable;
