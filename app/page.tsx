'use client';

import React, { useState } from 'react';
import PlayerWidget from './components/PlayerWidget';
import LogoutButton from './components/LogoutButton';

const MainPage = () => {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query) {
      setError('Please enter a search query.');
      return;
    }
  
    setError('');
    setPlayers([]);
    setSelectedPlayerId(null);
  
    try {
      console.log(`Searching for: ${query}`);
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Search failed:', errorData);
        throw new Error(errorData.error || 'Search failed.');
      }
  
      const data = await res.json();
      console.log('Players:', data.players); // Log players from response
      setPlayers(data.players || []);
    } catch (err: any) {
      console.error('Error during search:', err.message);
      setError(err.message || 'An error occurred during the search.');
    }
  };  

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayerId(playerId);
  };

  return (
    <div>
      <h1>Player Search and Profile</h1>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter player name..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Dropdown Menu */}
      {!selectedPlayerId && players.length > 0 && (
        <div>
          <label htmlFor="player-dropdown">Players:</label>
          <select
            id="player-dropdown"
            onChange={(e) => handlePlayerSelect(e.target.value)}
          >
            <option value="">Select a player</option>
            {players.map((player: any) => (
              <option key={player.id} value={player.id}>
                {`${player.name} - ${player.league} - ${player.team}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Player Profile */}
      {selectedPlayerId && <PlayerWidget playerId={selectedPlayerId} />}
      <LogoutButton/>
    </div>
  );
};

export default MainPage;
