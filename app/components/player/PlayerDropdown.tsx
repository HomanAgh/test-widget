'use client';

import React from 'react';

interface Player {
  id: string;
  name: string;
  league: string;
  team: string;
}

interface PlayerDropdownProps {
  players: Player[];
  onSelect: (playerId: string) => void;
}

const PlayerDropdown: React.FC<PlayerDropdownProps> = ({ players, onSelect }) => {
  const handleSelect = (playerId: string) => {
    if (playerId) {
      onSelect(playerId);
    }
  };

  return (
    <div>
      <label htmlFor="player-dropdown">Players:</label>
      <select id="player-dropdown" onChange={(e) => handleSelect(e.target.value)}>
        <option value="">Select a player</option>
        {players.map((player) => (
          <option key={player.id} value={player.id}>
            {`${player.name} - ${player.league} - ${player.team}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PlayerDropdown;
//använder inte den här längre