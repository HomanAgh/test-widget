'use client';

import React from 'react';

interface PlayerDropdownProps {
  players: any[];
  onSelect: (playerId: string) => void;
}

const PlayerDropdown: React.FC<PlayerDropdownProps> = ({ players, onSelect }) => {
  return (
    <div>
      <label htmlFor="player-dropdown">Players:</label>
      <select id="player-dropdown" onChange={(e) => onSelect(e.target.value)}>
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
