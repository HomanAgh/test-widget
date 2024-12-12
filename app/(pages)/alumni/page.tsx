/* 'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '@/app/components/common/SearchBar';
import PlayerTable from '@/app/components/alumni/PlayerTable';

interface Player {
  id: number;
  name: string;
  birthYear: number;
  draftPick?: string;
}

interface League {
  slug: string;
  name: string;
}

const SearchPlayers = () => {
  const [results, setResults] = useState<Player[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [customLeagues, setCustomLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [selectedCustomLeague, setSelectedCustomLeague] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'league' | 'customLeague'>('league');
  const [query, setQuery] = useState<string>(''); // Store the search query
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all leagues dynamically on component mount
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await fetch('/api/ProfLeague'); // Your API for fetching leagues
        if (!response.ok) {
          throw new Error('Failed to fetch leagues');
        }

        const data = await response.json();
        setLeagues(data.leagues || []);
        const customLeagueSlugs = ['nhl', 'ahl', 'shl', 'khl', 'liiga', 'nl', 'del']; // Choose slugs to include
        const filteredCustomLeagues = data.leagues.filter((league: League) =>
            customLeagueSlugs.includes(league.slug)
        );

      setCustomLeagues(filteredCustomLeagues);
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
        const draftPickData = await fetchDraftPicks(players.map((p: { id: any; }) => p.id));
        const playersWithDraftPicks = players.map((player: { id: string | number; }) => ({
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
  }, [query, selectedLeague, selectedCustomLeague, activeFilter]);

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

      <div className="flex space-x-4 mb-4">
        <button
          className={`p-2 rounded ${
            activeFilter === 'league' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveFilter('league')}
        >
          Use Professional League Filter
        </button>
        <button
          className={`p-2 rounded ${
            activeFilter === 'customLeague' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveFilter('customLeague')}
        >
          Use Custom League Filter
        </button>
      </div>

      <div className="flex space-x-4 mb-4">
        {activeFilter === 'league' && leagues.length > 0 && (
          <div>
            <label htmlFor="leagueFilter" className="mr-2">
              Filter by League:
            </label>
            <select
              id="leagueFilter"
              value={selectedLeague || ''}
              onChange={(e) => setSelectedLeague(e.target.value || null)}
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
        )}

        {activeFilter === 'customLeague' && customLeagues.length > 0 && (
          <div>
            <label htmlFor="customLeagueFilter" className="mr-2">
              Filter by Custom League:
            </label>
            <select
              id="customLeagueFilter"
              value={selectedCustomLeague || ''}
              onChange={(e) => setSelectedCustomLeague(e.target.value || null)}
              className="p-2 border rounded"
            >
              <option value="">All Custom Leagues</option>
              {customLeagues.map((league) => (
                <option key={league.slug} value={league.slug}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>
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
 */

'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '@/app/components/common/SearchBar';
import PlayerTable from '@/app/components/alumni/PlayerTable';

interface Player {
  id: number;
  name: string;
  birthYear: number;
  draftPick?: string;
}

interface League {
  slug: string;
  name: string;
}

const SearchPlayers = () => {
  const [results, setResults] = useState<Player[]>([]);
  const [proLeagues, setProLeagues] = useState<League[]>([]);
  const [customLeagues, setCustomLeagues] = useState<League[]>([]);
  const [junLeagues, setJunLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [selectedCustomLeague, setSelectedCustomLeague] = useState<string | null>(null);
  const [selectedJunLeague, setSelectedJunLeague] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'league' | 'customLeague' | 'junLeague'>('league');
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
  }, [query, selectedLeague, selectedCustomLeague, selectedJunLeague, activeFilter]);

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
      <div className="flex space-x-4 mb-4">
        <button
          className={`p-2 rounded ${
            activeFilter === 'league' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveFilter('league')}
        >
          Use Professional League Filter
        </button>
        <button
          className={`p-2 rounded ${
            activeFilter === 'customLeague' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveFilter('customLeague')}
        >
          Use Custom League Filter
        </button>
        <button
          className={`p-2 rounded ${
            activeFilter === 'junLeague' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveFilter('junLeague')}
        >
          Use Junior League Filter
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-4">
        {activeFilter === 'league' && proLeagues.length > 0 && (
          <div>
            <label htmlFor="leagueFilter" className="mr-2">
              Filter by League:
            </label>
            <select
              id="leagueFilter"
              value={selectedLeague || ''}
              onChange={(e) => setSelectedLeague(e.target.value || null)}
              className="p-2 border rounded"
            >
              <option value="">All Leagues</option>
              {proLeagues.map((league) => (
                <option key={league.slug} value={league.slug}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeFilter === 'customLeague' && customLeagues.length > 0 && (
          <div>
            <label htmlFor="customLeagueFilter" className="mr-2">
              Filter by Custom League:
            </label>
            <select
              id="customLeagueFilter"
              value={selectedCustomLeague || ''}
              onChange={(e) => setSelectedCustomLeague(e.target.value || null)}
              className="p-2 border rounded"
            >
              <option value="">All Custom Leagues</option>
              {customLeagues.map((league) => (
                <option key={league.slug} value={league.slug}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeFilter === 'junLeague' && junLeagues.length > 0 && (
          <div>
            <label htmlFor="junLeagueFilter" className="mr-2">
              Filter by Major-Junior League:
            </label>
            <select
              id="junLeagueFilter"
              value={selectedJunLeague || ''}
              onChange={(e) => setSelectedJunLeague(e.target.value || null)}
              className="p-2 border rounded"
            >
              <option value="">All Major-Junior Leagues</option>
              {junLeagues.map((league) => (
                <option key={league.slug} value={league.slug}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>
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
