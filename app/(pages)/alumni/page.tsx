"use client";

import React, { useState } from 'react';
import PlayerTable from '@/app/components/alumni/PlayerTable';
import FilterToggle from '@/app/components/alumni/FilterToggle';
import LeagueFilter from '@/app/components/alumni/LeagueFilter';
import TeamSearchBar from '@/app/components/alumni/TeamSearchBar';
import HomeButton from '@/app/components/common/HomeButton';
import { useFetchLeagues } from '@/app/components/alumni/hooks/useFetchLeagues';
import { useFetchPlayers } from '@/app/components/alumni/hooks/useFetchPlayers';
import TeamBackgroundColorSelector from '@/app/components/common/TeamBackgroundColorSelector';

const SearchPlayers = () => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teamColors, setTeamColors] = useState<string[]>([]);
  const [useTeamColor, setUseTeamColor] = useState<boolean>(false);

  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'customLeague' | 'customJunLeague'>('customLeague');

  const { customLeagues, customJunLeagues } = useFetchLeagues();
  const { results, loading, error, hasMore, fetchPlayers } = useFetchPlayers(
    selectedTeam,
    activeFilter,
    selectedLeague
  );

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <HomeButton />
        <h1 className="text-2xl font-bold text-center mb-6">Search Organization</h1>

        <TeamSearchBar
          placeholder="Search for a team..."
          onSelect={setSelectedTeam}
          onError={(err) => console.error(err)}
        />

        <FilterToggle
          options={[
            { value: 'customLeague', label: 'Use Custom Professional League Filter' },
            { value: 'customJunLeague', label: 'Use Custom Junior League Filter' },
          ]}
          activeFilter={activeFilter}
          onChange={(filter: string) => setActiveFilter(filter as 'customLeague' | 'customJunLeague')}
        />

        <LeagueFilter
          id="leagueFilter"
          label="Filter by League:"
          leagues={activeFilter === 'customLeague' ? customLeagues : customJunLeagues}
          selectedLeague={selectedLeague}
          onChange={setSelectedLeague}
        />

        {/* 2) Use the new TeamBackgroundColorSelector */}
        {selectedTeam && (
          <div className="my-6">
            <TeamBackgroundColorSelector
              teamName={selectedTeam}    // pass the selected team name
              defaultEnabled={false}     // starts with "Disable"
              onTeamColorsChange={setTeamColors}
              onUseTeamColorChange={setUseTeamColor}
              enableText="Enable Team Colors"    // optional custom label
              disableText="Disable Team Colors"   // optional custom label
            />
          </div>
        )}

        {loading && <p className="text-center mt-4">Loading...</p>}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <div className="mt-6 rounded-lg shadow-md">
          <PlayerTable
            players={results}
            teamColors={useTeamColor ? teamColors : []}
            hasMore={hasMore}
            fetchMore={() => fetchPlayers(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPlayers;
