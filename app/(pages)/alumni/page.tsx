

/* 'use client';

import React, { useState, useEffect } from 'react';
import PlayerTable from '@/app/components/alumni/PlayerTable';
import FilterToggle from '@/app/components/alumni/FilterToggle';
import LeagueFilter from '@/app/components/alumni/LeagueFilter';
import TeamSearchBar from '@/app/components/alumni/TeamSearchBar';
import HomeButton from '@/app/components/common/HomeButton';
import { useFetchLeagues } from '@/app/components/alumni/hooks/useFetchLeagues';
import { useFetchPlayers } from '@/app/components/alumni/hooks/useFetchPlayers';

const SearchPlayers = () => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [teamColors, setTeamColors] = useState<string[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'customLeague' | 'customJunLeague'>('customLeague');

  const { customLeagues, customJunLeagues } = useFetchLeagues();
  const { results, loading, error } = useFetchPlayers(selectedTeam, activeFilter, selectedLeague);

  useEffect(() => {
    const fetchTeamColors = async () => {
      if (!selectedTeam) return;

      try {
        const response = await fetch(`/api/AlumniSearchTeam?query=${encodeURIComponent(selectedTeam)}`);
        const data = await response.json();

        const team = data.teams?.[0];
        if (team?.id) {
          setSelectedTeamId(team.id);

          const colorResponse = await fetch(`/api/team?teamId=${team.id}`);
          const colorData = await colorResponse.json();
          if (colorData.colors) {
            setTeamColors(colorData.colors);
          }
        }
      } catch (err) {
        console.error('Failed to fetch team colors:', err);
      }
    };

    fetchTeamColors();
  }, [selectedTeam]);

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
          leagues={
            activeFilter === 'customLeague' ? customLeagues : customJunLeagues
          }
          selectedLeague={selectedLeague}
          onChange={setSelectedLeague}
        />

        {loading && <p className="text-center mt-4">Loading...</p>}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <div className="mt-6 rounded-lg shadow-md">
          <PlayerTable players={results} teamColors={teamColors} />
        </div>
      </div>
    </div>
  );
};

export default SearchPlayers; */

/* 'use client';

import React, { useState, useEffect } from 'react';
import PlayerTable from '@/app/components/alumni/PlayerTable';
import FilterToggle from '@/app/components/alumni/FilterToggle';
import LeagueFilter from '@/app/components/alumni/LeagueFilter';
import TeamSearchBar from '@/app/components/alumni/TeamSearchBar';
import HomeButton from '@/app/components/common/HomeButton';
import { useFetchLeagues } from '@/app/components/alumni/hooks/useFetchLeagues';
import { useFetchPlayers } from '@/app/components/alumni/hooks/useFetchPlayers';

const SearchPlayers = () => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [teamColors, setTeamColors] = useState<string[]>([]);
  const [useTeamColor, setUseTeamColor] = useState<boolean>(false); // Default to not using team colors
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'customLeague' | 'customJunLeague'>('customLeague');

  const { customLeagues, customJunLeagues } = useFetchLeagues();
  const { results, loading, error } = useFetchPlayers(selectedTeam, activeFilter, selectedLeague);

  useEffect(() => {
    const fetchTeamColors = async () => {
      if (!selectedTeam) return;

      try {
        const response = await fetch(`/api/AlumniSearchTeam?query=${encodeURIComponent(selectedTeam)}`);
        const data = await response.json();

        const team = data.teams?.[0];
        if (team?.id) {
          setSelectedTeamId(team.id);

          const colorResponse = await fetch(`/api/team?teamId=${team.id}`);
          const colorData = await colorResponse.json();
          if (colorData.colors) {
            setTeamColors(colorData.colors);
          }
        }
      } catch (err) {
        console.error('Failed to fetch team colors:', err);
      }
    };

    fetchTeamColors();
  }, [selectedTeam]);

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
          leagues={
            activeFilter === 'customLeague' ? customLeagues : customJunLeagues
          }
          selectedLeague={selectedLeague}
          onChange={setSelectedLeague}
        />

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              useTeamColor ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
            }`}
            onClick={() => setUseTeamColor(!useTeamColor)}
          >
            {useTeamColor ? 'Disable Team Colors' : 'Enable Team Colors'}
          </button>
        </div>

        {loading && <p className="text-center mt-4">Loading...</p>}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <div className="mt-6 rounded-lg shadow-md">
          <PlayerTable
            players={results}
            teamColors={useTeamColor ? teamColors : []} // Apply or disable team colors
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPlayers;
 */

'use client';

import React, { useState, useEffect } from 'react';
import PlayerTable from '@/app/components/alumni/PlayerTable';
import FilterToggle from '@/app/components/alumni/FilterToggle';
import LeagueFilter from '@/app/components/alumni/LeagueFilter';
import TeamSearchBar from '@/app/components/alumni/TeamSearchBar';
import HomeButton from '@/app/components/common/HomeButton';
import { useFetchLeagues } from '@/app/components/alumni/hooks/useFetchLeagues';
import { useFetchPlayers } from '@/app/components/alumni/hooks/useFetchPlayers';

const SearchPlayers = () => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teamColors, setTeamColors] = useState<string[]>([]);
  const [useTeamColor, setUseTeamColor] = useState<boolean>(false); // Default to not using team colors
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'customLeague' | 'customJunLeague'>('customLeague');

  const { customLeagues, customJunLeagues } = useFetchLeagues();
  const { results, loading, error, hasMore, fetchPlayers } = useFetchPlayers(
    selectedTeam,
    activeFilter,
    selectedLeague
  );

  useEffect(() => {
    const fetchTeamColors = async () => {
      if (!selectedTeam) return;

      try {
        const response = await fetch(`/api/AlumniSearchTeam?query=${encodeURIComponent(selectedTeam)}`);
        const data = await response.json();

        const team = data.teams?.[0];
        if (team?.id) {

          const colorResponse = await fetch(`/api/team?teamId=${team.id}`);
          const colorData = await colorResponse.json();
          if (colorData.colors) {
            setTeamColors(colorData.colors);
          }
        }
      } catch (err) {
        console.error('Failed to fetch team colors:', err);
      }
    };

    fetchTeamColors();
  }, [selectedTeam]);

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
          leagues={
            activeFilter === 'customLeague' ? customLeagues : customJunLeagues
          }
          selectedLeague={selectedLeague}
          onChange={setSelectedLeague}
        />

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              useTeamColor ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
            }`}
            onClick={() => setUseTeamColor(!useTeamColor)}
          >
            {useTeamColor ? 'Disable Team Colors' : 'Enable Team Colors'}
          </button>
        </div>

        {loading && <p className="text-center mt-4">Loading...</p>}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <div className="mt-6 rounded-lg shadow-md">
        <PlayerTable
          players={results}
          teamColors={useTeamColor ? teamColors : []}
          hasMore={hasMore}
          fetchMore={() => fetchPlayers(false)} // Fetch additional players
        />
        </div>
      </div>
    </div>
  );
};

export default SearchPlayers;












