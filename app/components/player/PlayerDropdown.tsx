'use client';

import React from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import { Player } from "@/app/types/player";

interface PlayerDropdownProps {
  players: Player[];
  onSelect: (playerId: string) => void;
}

const PlayerDropdown: React.FC<PlayerDropdownProps> = ({ players, onSelect }) => {
  const { t } = useTranslation(); // Hook for translations

  const handleSelect = (playerId: string) => {
    if (playerId) {
      onSelect(playerId);
    }
  };

  return (
    <div>
      <label htmlFor="player-dropdown">{t("PlayersLabel")}</label>
      <select id="player-dropdown" onChange={(e) => handleSelect(e.target.value)}>
        <option value="">{t("SelectPlayer")}</option>
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
