import React from 'react';
import { League } from '@/app/types/league';

interface LeagueFilterProps {
  id: string;
  label: string;
  leagues: League[];
  selectedLeague: string | null;
  onChange: (value: string | null) => void;
}

const LeagueFilter: React.FC<LeagueFilterProps> = ({
  id,
  label,
  leagues,
  selectedLeague,
  onChange,
}) => {
  return (
    <div className="mt-4">
      <label htmlFor={id} className="mr-2 font-semibold">
        {label}
      </label>
      <select
        id={id}
        value={selectedLeague || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="p-2 border rounded"
      >
        <option value="">All Leagues</option>
        {leagues.map((league) => (
          <option key={league.slug} value={league.slug}>
            {league.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LeagueFilter;
