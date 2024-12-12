'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '@/app/components/common/SearchBar';
import PlayerTable from '@/app/components/alumni/PlayerTable';
import FilterToggle from '@/app/components/alumni/FilterToggle';
import LeagueFilter from '@/app/components/alumni/LeagueFilter';
import { AlumniPlayer } from '@/app/types/player'; //nytt import
import { League } from '@/app/types/league';  //nytt import

/* interface Player {
  id: number;
  name: string;
  birthYear: number;
  draftPick?: string;
}

interface League {
  slug: string;
  name: string;
} */

const SearchPlayers = () => {
  const [results, setResults] = useState<AlumniPlayer[]>([]); //ändra från Player till AlumniPlayer
  const [proLeagues, setProLeagues] = useState<League[]>([]);
  const [customLeagues, setCustomLeagues] = useState<League[]>([]);
  const [junLeagues, setJunLeagues] = useState<League[]>([]);
  const [customJunLeagues, setCustomJunLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [selectedCustomLeague, setSelectedCustomLeague] = useState<string | null>(null);
  const [selectedJunLeague, setSelectedJunLeague] = useState<string | null>(null);
  const [selectedCustomJunLeague, setSelectedCustomJunLeague] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'league' | 'customLeague' | 'junLeague' | 'customJunLeague'>('league');
  const [query, setQuery] = useState<string>(''); // Store the search query
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all leagues dynamically on component mount
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        // Fetch professional leagues
        const proResponse = await fetch('/api/ProfLeague');
        if (!proResponse.ok) throw new Error('Failed to fetch professional leagues');
        const proData = await proResponse.json();
        setProLeagues(proData.leagues || []);

        // Fetch custom leagues from professional leagues
        const customLeagueSlugs = ['nhl', 'ahl', 'shl', 'khl', 'liiga', 'nl', 'del'];
        const filteredCustomLeagues = proData.leagues.filter((league: League) =>
          customLeagueSlugs.includes(league.slug)
        );
        setCustomLeagues(filteredCustomLeagues);

        // Fetch major-junior leagues
        const junResponse = await fetch('/api/JunLeague');
        if (!junResponse.ok) throw new Error('Failed to fetch junior leagues');
        const junData = await junResponse.json();
        setJunLeagues(junData.leagues || []);

        // Fetch custom junior leagues
        const customJuniorLeagueSlugs = ['chl', 'ohl', 'whl', 'qmjhl'];
        const filteredCustomJuniorLeagues = junData.leagues.filter((league: League) =>
          customJuniorLeagueSlugs.includes(league.slug)
        );
        setCustomJunLeagues(filteredCustomJuniorLeagues);
      } catch (err: any) {
        console.error('Error fetching leagues:', err.message);
        setError('Failed to fetch leagues');
      }
    };

    fetchLeagues();
  }, []);

  // Fetch players whenever the query or active filter changes
  useEffect(() => {
    if (!query) return;

    const fetchPlayers = async () => {
      setLoading(true);
      setError('');
      setResults([]);

      try {
        let url = `/api/alumni?query=${encodeURIComponent(query)}`;

        if (activeFilter === 'league' && selectedLeague) {
          url += `&league=${selectedLeague}`;
        } else if (activeFilter === 'customLeague' && selectedCustomLeague) {
          url += `&league=${selectedCustomLeague}`;
        } else if (activeFilter === 'junLeague' && selectedJunLeague) {
          url += `&league=${selectedJunLeague}`;
        } else if (activeFilter === 'customJunLeague' && selectedCustomJunLeague) {
          url += `&league=${selectedCustomJunLeague}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch players');
        }

        const data = await response.json();
        const players = data.players.map((player: any) => ({
          id: player.id,
          name: player.name,
          birthYear: player.dateOfBirth
            ? new Date(player.dateOfBirth).getFullYear()
            : 'Unknown',
        }));

        // Fetch draft picks after fetching players
        const draftPickData = await fetchDraftPicks(players.map((p: { id: any }) => p.id));
        const playersWithDraftPicks = players.map((player: { id: string | number }) => ({
          ...player,
          draftPick: draftPickData[player.id] || 'N/A',
        }));

        setResults(playersWithDraftPicks);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [query, selectedLeague, selectedCustomLeague, selectedJunLeague, selectedCustomJunLeague, activeFilter]);

  const fetchDraftPicks = async (playerIds: number[]) => {
    try {
      const idsString = playerIds.join(',');
      const response = await fetch(`/api/draftpicks?playerIds=${idsString}`);
      if (!response.ok) {
        throw new Error('Failed to fetch draft picks');
      }

      const data = await response.json();
      return data.draftPicks.reduce((acc: { [key: string]: string }, entry: any) => {
        acc[entry.playerId] = entry.draftPick;
        return acc;
      }, {});
    } catch (err) {
      console.error('Error fetching draft picks:', (err as any).message);
      return {};
    }
  };

  const handleSelect = (newQuery: string) => {
    setQuery(newQuery); // Update the search query
  };

  return (
    <div>
      <h1>Search Organization</h1>
      <SearchBar type="team" onSelect={handleSelect} onError={setError} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Toggle Between Filters */}
      <FilterToggle
        options={[
          { value: 'league', label: 'Use Professional League Filter' },
          { value: 'customLeague', label: 'Use Custom League Filter' },
          { value: 'junLeague', label: 'Use Major-Junior League Filter' },
          { value: 'customJunLeague', label: 'Use Custom Junior League Filter' },
        ]}
        activeFilter={activeFilter}
        onChange={(filter: string) => setActiveFilter(filter as 'league' | 'customLeague' | 'junLeague' | 'customJunLeague')}
      />

      {/* Filters */}
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
            label="Filter by Major-Junior League:"
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

      <div>
        {results.length > 0 ? (
          <PlayerTable players={results} />
        ) : (
          !loading && <p>No players found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPlayers;

