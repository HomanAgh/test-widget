/* "use client";

import React, { useState } from 'react';
import PlayerTable from '@/app/components/alumni/PlayerTable';
import FilterToggle from '@/app/components/alumni/FilterToggle';
import LeagueFilter from '@/app/components/alumni/LeagueFilter';
import TeamSearchBar, { SelectedTeam } from '@/app/components/alumni/TeamSearchBar';
import HomeButton from '@/app/components/common/HomeButton';
import { useFetchLeagues } from '@/app/components/alumni/hooks/useFetchLeagues';
import { useFetchPlayers } from '@/app/components/alumni/hooks/useFetchPlayers';
import TeamBackgroundColorSelector from '@/app/components/common/TeamBackgroundColorSelector';

const SearchPlayers = () => {
  // Keep an array of { id, name } for selected teams
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeam[]>([]);

  const [teamColors, setTeamColors] = useState<string[]>([]);
  const [useTeamColor, setUseTeamColor] = useState<boolean>(false);

  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<'customLeague' | 'customJunLeague'>('customLeague');

  const { customLeagues, customJunLeagues } = useFetchLeagues();

  // Extract numeric IDs for the fetch
  const selectedTeamIds = selectedTeams.map((t) => t.id);

  // Use the custom hook that fetches players by teamIds
  const { results, loading, error, hasMore, fetchPlayers } = useFetchPlayers(
    selectedTeamIds,
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
          onSelect={(teamObj) => {
            // Single-select: override with just this one
            setSelectedTeams([teamObj]);
          }}
          onError={(err) => console.error(err)}
          selectedTeams={selectedTeams}
          onCheckedTeamsChange={setSelectedTeams}
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
          selectedLeagues={selectedLeagues}
          onChange={setSelectedLeagues}
        />

        {selectedTeams.length > 0 && (
          <div className="my-6">
            <TeamBackgroundColorSelector
              teamName={selectedTeams[0].name}
              defaultEnabled={false}
              onTeamColorsChange={setTeamColors}
              onUseTeamColorChange={setUseTeamColor}
              enableText="Enable Team Colors"
              disableText="Disable Team Colors"
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
 */

"use client";

import React, { useState } from 'react';
import PlayerTable from '@/app/components/alumni/PlayerTable';
import FilterToggle from '@/app/components/alumni/FilterToggle';
import LeagueFilter from '@/app/components/alumni/LeagueFilter';
import TeamSearchBar, { SelectedTeam } from '@/app/components/alumni/TeamSearchBar';
import HomeButton from '@/app/components/common/HomeButton';
import { useFetchLeagues } from '@/app/components/alumni/hooks/useFetchLeagues';
import { useFetchPlayers } from '@/app/components/alumni/hooks/useFetchPlayers';
import TeamBackgroundColorSelector from '@/app/components/common/TeamBackgroundColorSelector';

 const SearchPlayers = () => {
  // Keep an array of { id, name } for selected teams
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeam[]>([]);

  const [teamColors, setTeamColors] = useState<string[]>([]);
  const [useTeamColor, setUseTeamColor] = useState<boolean>(false);

  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'customLeague' | 'customJunLeague'>('customLeague');
  const [includeYouth, setIncludeYouth] = useState<boolean>(false); // NEW: Toggle for youth team

  const { customLeagues, customJunLeagues } = useFetchLeagues();

  // Extract numeric IDs for the fetch
  const selectedTeamIds = selectedTeams.map((t) => t.id);

  // Use the first selected team's name as the youth team parameter (if any)
  const youthTeam = selectedTeams.length > 0 ? selectedTeams[0].name : null;

  // Use the custom hook that fetches players by teamIds, leagues, and youth team
  const { results, loading, error, hasMore, fetchPlayers } = useFetchPlayers(
    selectedTeamIds,
    activeFilter,
    selectedLeague,
    includeYouth, // NEW: Pass includeYouth
    youthTeam // NEW: Pass youthTeam
  );

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <HomeButton />
        <h1 className="text-2xl font-bold text-center mb-6">Search Organization</h1>

        <TeamSearchBar
          placeholder="Search for a team..."
          onSelect={(teamObj) => {
            // Single-select: override with just this one
            setSelectedTeams([teamObj]);
          }}
          onError={(err) => console.error(err)}
          selectedTeams={selectedTeams}
          onCheckedTeamsChange={setSelectedTeams}
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

        {}
        <div className="flex items-center space-x-3 my-4">
          <label className="font-medium">Include Youth Team:</label>
          <input
            type="checkbox"
            checked={includeYouth}
            onChange={(e) => setIncludeYouth(e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        {selectedTeams.length > 0 && (
          <div className="my-6">
            <TeamBackgroundColorSelector
              teamName={selectedTeams[0].name}
              defaultEnabled={false}
              onTeamColorsChange={setTeamColors}
              onUseTeamColorChange={setUseTeamColor}
              enableText="Enable Team Colors"
              disableText="Disable Team Colors"
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


