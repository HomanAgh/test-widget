import React from 'react';
import { AlumniPlayer } from '@/app/types/player';
import Table from '../common/style/Table';
import TableHeader from '../common/style/TableHeader';

interface PlayerTableProps {
  players: AlumniPlayer[];
  teamColors?: string[];
  hasMore: boolean;
  fetchMore: () => void;
  genderFilter: 'men' | 'women';
  loading: boolean;
}

const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  teamColors,
  hasMore,
  fetchMore,
  genderFilter,
}) => {
  const [sortColumn, setSortColumn] = React.useState<string>('');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc' | 'none'>('none');

  // For styling
  const backgroundColor = teamColors?.[0] || 'white';
  const textColor = teamColors?.[1] || 'black';

  // Filter players based on gender
  const filteredPlayers = React.useMemo(() => {
    return players.filter((p) => {
      if (genderFilter === 'men') {
        return p.gender === 'male';
      }
      if (genderFilter === 'women') {
        return p.gender === 'female';
      }
      return true; // Show all if no filter
    });
  }, [players, genderFilter]);

  // Helper to parse the "Overall" from a draftPick string like "2007 Round 1, Overall 5"
  function extractOverall(draftPick: string | undefined): number {
    if (!draftPick) return Number.MAX_SAFE_INTEGER; // "N/A" => push to end
    const match = draftPick.match(/Overall\s+(\d+)/i);
    return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
  }

  // Cycle the sort direction: asc -> desc -> none -> asc...
  function handleSort(column: string) {
    // If switching columns, start fresh
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortDirection('asc');
      return;
    }

    // Same column => cycle
    if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      // Third click => no sort
      setSortDirection('none');
      setSortColumn('');
    } else {
      // from 'none' => 'asc'
      setSortDirection('asc');
      setSortColumn(column);
    }
  }

  // Sorting logic
  const sortedPlayers = React.useMemo(() => {
    if (sortDirection === 'none') {
      return filteredPlayers;
    }

    const sorted = [...filteredPlayers];

    switch (sortColumn) {
      case 'name':
        sorted.sort((a, b) =>
          sortDirection === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        );
        break;
      case 'birthYear':
        sorted.sort((a, b) => {
          const ay = a.birthYear ?? 0;
          const by = b.birthYear ?? 0;
          return sortDirection === 'asc' ? ay - by : by - ay;
        });
        break;
      case 'draftPick':
        sorted.sort((a, b) => {
          const aOverall = extractOverall(a.draftPick);
          const bOverall = extractOverall(b.draftPick);
          return sortDirection === 'asc' ? aOverall - bOverall : bOverall - aOverall;
        });
        break;
      default:
        break;
    }

    return sorted;
  }, [filteredPlayers, sortColumn, sortDirection]);

  // Helper to render the appropriate symbol for each column
  function renderSortSymbol(column: string) {
    if (sortColumn !== column) {
      return ''; // Not currently sorting by this column => no symbol
    }
    if (sortDirection === 'asc') return ' ↑';
    if (sortDirection === 'desc') return ' ↓';
    return ' -'; // "none" case => a simple dash
  }

  return (
    <div
      className="overflow-x-auto bg-white shadow-lg rounded-lg"
      style={{
        padding: '1rem',
        backgroundColor: teamColors?.[2] || 'white',
      }}
    >
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-blue-700 text-white">
          <tr>
            <TableHeader align="center" onClick={() => handleSort('name')}>
              Player{renderSortSymbol('name')}
            </TableHeader>
            <TableHeader align="center" onClick={() => handleSort('birthYear')}>
              Birth Year{renderSortSymbol('birthYear')}
            </TableHeader>
            <TableHeader align="center" onClick={() => handleSort('draftPick')}>
              Draft Pick{renderSortSymbol('draftPick')}
            </TableHeader>
            <TableHeader align="center">Junior</TableHeader>
            <TableHeader align="center">College</TableHeader>
            <TableHeader align="center">Professional</TableHeader>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {sortedPlayers.map((player) => {
            const juniorTeams = player.teams.filter(
              (team) =>
                team.leagueLevel?.toLowerCase().includes('junior') ||
                team.leagueLevel?.toLowerCase().includes('18')
            );
            const collegeTeams = player.teams.filter((team) =>
              team.leagueLevel?.toLowerCase().includes("college")
            );
            const professionalTeams = player.teams.filter((team) =>
              team.leagueLevel?.toLowerCase().includes('professional')
            );

            return (
              <tr
                key={player.id}
                style={{
                  backgroundColor,
                  color: textColor,
                }}
              >
                <Table align="center">{player.name}</Table>
                <Table align="center">{player.birthYear || 'N/A'}</Table>
                <Table align="center">{player.draftPick || 'N/A'}</Table>
                <Table align="center">
                  {juniorTeams.length > 0
                    ? juniorTeams.map((team, idx) => (
                        <React.Fragment key={idx}>
                          {team.name}
                          {idx < juniorTeams.length - 1 && ', '}
                        </React.Fragment>
                      ))
                    : 'N/A'}
                </Table>
                <Table align="center">
                  {collegeTeams.length > 0
                    ? collegeTeams.map((team, idx) => (
                        <React.Fragment key={idx}>
                          {team.name}
                          {idx < collegeTeams.length - 1 && ', '}
                        </React.Fragment>
                      ))
                    : 'N/A'}
                </Table>
                <Table align="center">
                  {professionalTeams.length > 0
                    ? professionalTeams.map((team, idx) => (
                        <React.Fragment key={idx}>
                          {team.name}
                          {idx < professionalTeams.length - 1 && ', '}
                        </React.Fragment>
                      ))
                    : 'N/A'}
                </Table>
              </tr>
            );
          })}
        </tbody>
      </table>

      {hasMore && (
        <button
          onClick={fetchMore}
          className="mt-4 px-4 py-2 bg-blue-700 text-white font-bold rounded"
        >
          Show More
        </button>
      )}
    </div>
  );
};

export default PlayerTable;



