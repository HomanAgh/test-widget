/* 'use client';

import React, { useState } from 'react';
import SearchBar from '@/app/components/common/SearchBar';
import PlayerTable from '@/app/components/alumni/PlayerTable';

const SearchPlayers = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = async (query: string) => {
    setLoading(true);
    setError('');
    setResults([]);

    try {
      // Update the parameter name to match your `route.ts`
      const response = await fetch(`/api/alumni?teamName=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      
      // Map response data to the format expected by PlayerTable
      setResults(
        data.players.map((player: any) => ({
          name: player.name, // Adjust these keys based on your route.ts response
          birthYear: player.dateOfBirth ? new Date(player.dateOfBirth).getFullYear() : "N/A",
          juniorTeam: player.juniorTeam || "N/A",
          collegeTeam: player.collegeTeam || "N/A",
          proTeam: player.proTeam || "N/A",
        }))
      );
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Players</h1>
      <SearchBar
        type="team"
        onSelect={handleSelect}
        onError={setError}
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
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

import React, { useState } from 'react';
import SearchBar from '@/app/components/common/SearchBar';
import PlayerTable from '@/app/components/alumni/PlayerTable';

interface Player {
  name: string;
  birthYear: number;
}

const SearchPlayers = () => {
  const [results, setResults] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = async (query: string) => {
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch(`/api/alumni?teamName=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      // Map response data to the format expected by PlayerTable
      setResults(
        data.players.map((player: any) => ({
          name: player.name,
          birthYear: player.dateOfBirth ? new Date(player.dateOfBirth).getFullYear() : 0,
        }))
      );
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Players</h1>
      <SearchBar type="team" onSelect={handleSelect} onError={setError} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
