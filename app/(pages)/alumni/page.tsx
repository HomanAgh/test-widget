/* 'use client';

import React, { useState, useEffect } from 'react';
import PlayerTable from '@/app/components/alumni/PlayerTable';
import FilterToggle from '@/app/components/alumni/FilterToggle';
import LeagueFilter from '@/app/components/alumni/LeagueFilter';
import TeamSearchBar from '@/app/components/alumni/TeamSearchBar';
import { AlumniPlayer, AlumniAPIResponse, DraftPickAPIResponse } from '@/app/types/player';
import { League } from '@/app/types/league';
import HomeButton from '@/app/components/common/HomeButton';

const SearchPlayers = () => {
  const [results, setResults] = useState<AlumniPlayer[]>([]);
  const [proLeagues, setProLeagues] = useState<League[]>([]);
  const [customLeagues, setCustomLeagues] = useState<League[]>([]);
  const [junLeagues, setJunLeagues] = useState<League[]>([]);
  const [customJunLeagues, setCustomJunLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [selectedCustomLeague, setSelectedCustomLeague] = useState<string | null>(null);
  const [selectedJunLeague, setSelectedJunLeague] = useState<string | null>(null);
  const [selectedCustomJunLeague, setSelectedCustomJunLeague] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'league' | 'customLeague' | 'junLeague' | 'customJunLeague'>('league');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const proResponse = await fetch('/api/ProfLeague');
        const junResponse = await fetch('/api/JunLeague');

        if (!proResponse.ok || !junResponse.ok) throw new Error('Failed to fetch leagues.');

        const proData = await proResponse.json() as { leagues: League[] };
        const junData = await junResponse.json() as { leagues: League[] };

        setProLeagues(proData.leagues || []);
        setJunLeagues(junData.leagues || []);

        const customLeagueSlugs = ['nhl', 'ahl', 'shl', 'khl', 'liiga', 'nl', 'del'];
        const customJuniorLeagueSlugs = ['chl', 'ohl', 'whl', 'qmjhl'];

        setCustomLeagues(proData.leagues.filter((league: League) => customLeagueSlugs.includes(league.slug)));
        setCustomJunLeagues(junData.leagues.filter((league: League) => customJuniorLeagueSlugs.includes(league.slug)));
      } catch (err: unknown) {
        setError('Failed to fetch leagues.');
        if (err instanceof Error) {
          console.error('Error fetching leagues:', err.message);
        } else {
          console.error('Unknown error fetching leagues:', err);
        }
      }
    };

    fetchLeagues();
  }, []);

  useEffect(() => {
    if (!selectedTeam) return;

    const fetchPlayers = async () => {
      setLoading(true);
      setError('');
      setResults([]);

      try {
        let url = `/api/alumni?query=${encodeURIComponent(selectedTeam)}`;
        let leagueParam = '';

        if (activeFilter === 'league' && selectedLeague) leagueParam = selectedLeague;
        else if (activeFilter === 'customLeague' && selectedCustomLeague) leagueParam = selectedCustomLeague;
        else if (activeFilter === 'junLeague' && selectedJunLeague) leagueParam = selectedJunLeague;
        else if (activeFilter === 'customJunLeague' && selectedCustomJunLeague)
          leagueParam = selectedCustomJunLeague;

        if (leagueParam) url += `&league=${leagueParam}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch players.');

        const data = await response.json() as AlumniAPIResponse;
        const players: AlumniPlayer[] = data.players.map((player) => ({
          id: player.id,
          name: player.name,
           birthYear: player.birthYear || NaN,
        }));

        const draftPickAndTeamData = await fetchDraftPicksAndTeams(players.map((p) => p.id), leagueParam);

        const playersWithAdditionalData: AlumniPlayer[] = players.map((player) => ({
          ...player,
          draftPick: draftPickAndTeamData[player.id]?.draftPick || 'N/A',
          teams: draftPickAndTeamData[player.id]?.teams || [],
        }));

        setResults(playersWithAdditionalData);
      } catch (err: unknown) {
        setError('An error occurred while fetching players.');
        if (err instanceof Error) {
          console.error('Error:', err.message);
        } else {
          console.error('Unknown error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [selectedTeam, selectedLeague, selectedCustomLeague, selectedJunLeague, selectedCustomJunLeague, activeFilter]);

  const fetchDraftPicksAndTeams = async (
    playerIds: number[],
    league: string | null
  ): Promise<Record<number, { draftPick: string; teams: string[] }>> => {
    try {
      const idsString = playerIds.join(',');
      let url = `/api/draftpicks?playerIds=${idsString}`;
      if (league) url += `&league=${league}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch draft picks and teams.');

      const data = await response.json() as DraftPickAPIResponse;
      return data.players.reduce((acc, entry) => {
        acc[entry.playerId] = {
          draftPick: entry.draftPick || 'N/A',
          teams: entry.teams || [],
        };
        return acc;
      }, {} as Record<number, { draftPick: string; teams: string[] }>);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error fetching draft picks and teams:', err.message);
      } else {
        console.error('Unknown error fetching draft picks and teams:', err);
      }
      return {};
    }
  };

  return (
    <div>
      <HomeButton />

      <h1>Search Organization</h1>

      <TeamSearchBar
        placeholder="Search for a team..."
        onSelect={(team) => setSelectedTeam(team)}
        onError={(err) => setError(err)}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <FilterToggle
        options={[
          { value: 'league', label: 'Use Professional League Filter' },
          { value: 'customLeague', label: 'Use Custom Professional League Filter' },
          { value: 'junLeague', label: 'Use Junior League Filter' },
          { value: 'customJunLeague', label: 'Use Custom Junior League Filter' },
        ]}
        activeFilter={activeFilter}
        onChange={(filter: string) => setActiveFilter(filter as 'league' | 'customLeague' | 'junLeague' | 'customJunLeague')}
      />

      <div className="flex space-x-4 mb-4">
        {activeFilter === 'league' && (
          <LeagueFilter
            id="leagueFilter"
            label="Filter by League:"
            leagues={proLeagues}
            selectedLeague={selectedLeague}
            onChange={setSelectedLeague}
          />
        )}
        {activeFilter === 'customLeague' && (
          <LeagueFilter
            id="customLeagueFilter"
            label="Filter by Custom League:"
            leagues={customLeagues}
            selectedLeague={selectedCustomLeague}
            onChange={setSelectedCustomLeague}
          />
        )}
        {activeFilter === 'junLeague' && (
          <LeagueFilter
            id="junLeagueFilter"
            label="Filter by Junior League:"
            leagues={junLeagues}
            selectedLeague={selectedJunLeague}
            onChange={setSelectedJunLeague}
          />
        )}
        {activeFilter === 'customJunLeague' && (
          <LeagueFilter
            id="customJunLeagueFilter"
            label="Filter by Custom Junior League:"
            leagues={customJunLeagues}
            selectedLeague={selectedCustomJunLeague}
            onChange={setSelectedCustomJunLeague}
          />
        )}
      </div>

      <PlayerTable players={results} />
    </div>
  );
};

export default SearchPlayers;
 */

'use client';

import React, { useState } from 'react';
import PlayerTable from '@/app/components/alumni/PlayerTable';
import FilterToggle from '@/app/components/alumni/FilterToggle';
import LeagueFilter from '@/app/components/alumni/LeagueFilter';
import TeamSearchBar from '@/app/components/alumni/TeamSearchBar';
import HomeButton from '@/app/components/common/HomeButton';
import { useFetchLeagues } from '@/app/components/alumni/hooks/useFetchLeagues';
import { useFetchPlayers } from '@/app/components/alumni/hooks/useFetchPlayers';

const SearchPlayers = () => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  // Separate states for each league filter
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [selectedCustomLeague, setSelectedCustomLeague] = useState<string | null>(null);
  const [selectedJunLeague, setSelectedJunLeague] = useState<string | null>(null);
  const [selectedCustomJunLeague, setSelectedCustomJunLeague] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<'league' | 'customLeague' | 'junLeague' | 'customJunLeague'>('league');

  const { proLeagues, customLeagues, junLeagues, customJunLeagues, error: leaguesError } = useFetchLeagues();

  // Pass the correct selected league state based on active filter
  const getLeagues = () => {
    switch (activeFilter) {
      case 'league':
        return { leagues: proLeagues, selectedLeague, setSelectedLeague };
      case 'customLeague':
        return { leagues: customLeagues, selectedLeague: selectedCustomLeague, setSelectedLeague: setSelectedCustomLeague };
      case 'junLeague':
        return { leagues: junLeagues, selectedLeague: selectedJunLeague, setSelectedLeague: setSelectedJunLeague };
      case 'customJunLeague':
        return { leagues: customJunLeagues, selectedLeague: selectedCustomJunLeague, setSelectedLeague: setSelectedCustomJunLeague };
      default:
        return { leagues: [], selectedLeague: null, setSelectedLeague: () => {} };
    }
  };

  const { leagues, selectedLeague: currentSelectedLeague, setSelectedLeague: setCurrentSelectedLeague } = getLeagues();
  const { results, loading, error: playersError } = useFetchPlayers(selectedTeam, activeFilter, currentSelectedLeague);

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="mb-4">
            <HomeButton />
          </div>

          <h1 className="text-2xl font-bold text-center mb-6">Search Organization</h1>

          <div className="mb-4">
            <TeamSearchBar
              placeholder="Search for a team..."
              onSelect={setSelectedTeam}
              onError={(err) => console.error(err)}
            />
          </div>

          <div className="mb-4 flex justify-center">
            <FilterToggle
              options={[
                { value: 'league', label: 'Use Professional League Filter' },
                { value: 'customLeague', label: 'Use Custom Professional League Filter' },
                { value: 'junLeague', label: 'Use Junior League Filter' },
                { value: 'customJunLeague', label: 'Use Custom Junior League Filter' },
              ]}
              activeFilter={activeFilter}
              onChange={(value) => setActiveFilter(value as 'league' | 'customLeague' | 'junLeague' | 'customJunLeague')}
            />
          </div>

          <div className="mb-6">
            <LeagueFilter
              id="leagueFilter"
              label="Filter by League:"
              leagues={leagues}
              selectedLeague={currentSelectedLeague}
              onChange={setCurrentSelectedLeague}
            />
          </div>

          {loading && <p className="text-center text-gray-600">Loading...</p>}
          {leaguesError && <p className="text-red-500 text-center">{leaguesError}</p>}
          {playersError && <p className="text-red-500 text-center">{playersError}</p>}

          <div className="mt-4">
            <PlayerTable players={results} />
        </div>
      </div>
    </div>

  );
};

export default SearchPlayers;


