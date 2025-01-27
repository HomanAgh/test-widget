import React from 'react';
import { AlumniPlayer } from '@/app/types/player';
import Table from '../common/style/Table';
import TableHeader from '../common/style/TableHeader';
import Link from '../common/style/Link';

interface PlayerTableProps {
  players: AlumniPlayer[];
  teamColors?: string[];
  genderFilter: 'men' | 'women' | 'all';
  pageSize?: number;  // default number of players per page, e.g. 50
}

const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  teamColors,
  genderFilter,
  pageSize = 50,
}) => {
  const [sortColumn, setSortColumn] = React.useState<string>('');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc' | 'none'>('none');
  const [currentPage, setCurrentPage] = React.useState(0);

  // For styling
  const backgroundColor = teamColors?.[0] || 'white';
  const textColor = teamColors?.[1] || 'black';
  const tableBackgroundColor = teamColors?.[2] || 'white';

  // 1) Filter by gender
  const filteredPlayers = React.useMemo(() => {
    if (genderFilter === 'men') {
      return players.filter((p) => p.gender === 'male');
    } else if (genderFilter === 'women') {
      return players.filter((p) => p.gender === 'female');
    }
    return players; // 'all'
  }, [players, genderFilter]);

  // 2) Sorting
  // Helper: parse "Overall 5" from "2007 Round 1, Overall 5"
  function extractOverall(draftPick: string | undefined): number {
    if (!draftPick) return Number.MAX_SAFE_INTEGER;
    const match = draftPick.match(/Overall\s+(\d+)/i);
    return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
  }

  function handleSort(column: string) {
    // cycle the sort direction
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortDirection('asc');
      return;
    }
    if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      setSortDirection('none');
      setSortColumn('');
    } else {
      setSortDirection('asc');
      setSortColumn(column);
    }
  }

  const sortedPlayers = React.useMemo(() => {
    if (sortDirection === 'none') {
      return filteredPlayers;
    }
    const sorted = [...filteredPlayers];

    switch (sortColumn) {
      case 'name':
        sorted.sort((a, b) =>
          sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
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

  // 3) Local Pagination
  const totalPlayers = sortedPlayers.length;
  const totalPages = Math.ceil(totalPlayers / pageSize);

  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const pagePlayers = sortedPlayers.slice(startIndex, endIndex);

  // Render sort symbol
  function renderSortSymbol(column: string) {
    if (sortColumn !== column) return '';
    if (sortDirection === 'asc') return ' ↑';
    if (sortDirection === 'desc') return ' ↓';
    return ' -';
  }

  return (
    <div
      className="overflow-x-auto bg-white shadow-lg rounded-lg"
      style={{ padding: '1rem', backgroundColor: tableBackgroundColor }}
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
          {pagePlayers.map((player) => {
            // Example: separate teams into categories
            const juniorTeams = player.teams?.filter((t) => {
              const ll = t.leagueLevel?.toLowerCase() || '';
              return ll.includes('junior') || ll.includes('u18') || ll.includes('u20');
            }) || [];

            const collegeTeams = player.teams?.filter((t) =>
              (t.leagueLevel ?? '').toLowerCase().includes('college')
            ) || [];

            const professionalTeams = player.teams?.filter((t) =>
              (t.leagueLevel ?? '').toLowerCase().includes('professional')
            ) || [];

            return (
              <tr
                key={player.id}
                style={{
                  backgroundColor: backgroundColor,
                  color: textColor,
                }}
              > 
                <Table align="center">
                  <Link
                    href={`https://www.eliteprospects.com/player/${player.id}/${player.name}`}
                  >
                    {/* Provide visible link text here */}
                    {player.name || 'View Profile'}
                  </Link>
                </Table>
                <Table align="center">{player.birthYear ?? 'N/A'}</Table>
                <Table align="center">{player.draftPick ?? 'N/A'}</Table>
                <Table align="center">
                  {juniorTeams.length > 0
                    ? juniorTeams.map((t, idx) => (
                        <React.Fragment key={idx}>
                          {t.name}
                          {idx < juniorTeams.length - 1 && ', '}
                        </React.Fragment>
                      ))
                    : 'N/A'}
                </Table>
                <Table align="center">
                  {collegeTeams.length > 0
                    ? collegeTeams.map((t, idx) => (
                        <React.Fragment key={idx}>
                          {t.name}
                          {idx < collegeTeams.length - 1 && ', '}
                        </React.Fragment>
                      ))
                    : 'N/A'}
                </Table>
                <Table align="center">
                  {professionalTeams.length > 0
                    ? professionalTeams.map((t, idx) => (
                        <React.Fragment key={idx}>
                          {t.name}
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

     {/* Pagination controls */}
     <div className="flex justify-center items-center mt-4 space-x-2">
        {/* 1) First Page */}
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(0)}
          className="px-4 py-2 bg-blue-700 text-white font-bold rounded disabled:opacity-50"
        >
          First
        </button>

        {/* 2) Prev Page */}
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 bg-blue-700 text-white font-bold rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {currentPage + 1} of {totalPages}
        </span>

        {/* 3) Next Page */}
        <button
          disabled={currentPage >= totalPages - 1}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 bg-blue-700 text-white font-bold rounded disabled:opacity-50"
        >
          Next
        </button>

        {/* 4) Last Page */}
        <button
          disabled={currentPage >= totalPages - 1}
          onClick={() => setCurrentPage(totalPages - 1)}
          className="px-4 py-2 bg-blue-700 text-white font-bold rounded disabled:opacity-50"
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default PlayerTable;