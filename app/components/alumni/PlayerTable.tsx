import React from 'react';
import { AlumniPlayer } from '@/app/types/player';
import Table from '../common/style/Table';
import TableHeader from '../common/style/TableHeader';

interface PlayerTableProps {
  players: AlumniPlayer[];
  teamColors?: string[];
  hasMore: boolean;
  fetchMore: () => void;
}

const PlayerTable: React.FC<PlayerTableProps> = ({ players, teamColors, hasMore, fetchMore }) => {
  const backgroundColor = teamColors?.[0] || 'white';
  const textColor = teamColors?.[1] || 'black';

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
            <TableHeader align="center">Player</TableHeader>
            <TableHeader align="center">Birth Year</TableHeader>
            <TableHeader align="center">Draft Pick</TableHeader>
            <TableHeader align="center">Junior Teams</TableHeader>
            <TableHeader align="center">Professional Teams</TableHeader>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {players.map((player) => {
            const juniorTeams = player.teams.filter((team) =>
              team.leagueLevel?.toLowerCase().includes('junior')|| 
            team.leagueLevel?.toLowerCase().includes('18')
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
                  {juniorTeams.length > 0 ? (
                    juniorTeams.map((team, index) => (
                      <React.Fragment key={index}>
                        {team.name}
                        {index < juniorTeams.length - 1 && ', '}
                      </React.Fragment>
                    ))
                  ) : (
                    'N/A'
                  )}
                </Table>
                <Table align="center">
                  {professionalTeams.length > 0 ? (
                    professionalTeams.map((team, index) => (
                      <React.Fragment key={index}>
                        {team.name}
                        {index < professionalTeams.length - 1 && ', '}
                      </React.Fragment>
                    ))
                  ) : (
                    'N/A'
                  )}
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
