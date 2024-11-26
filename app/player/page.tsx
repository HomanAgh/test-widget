"use client";

import React, { useState } from "react";
import SearchBar from "../components/player/SearchBar";
import PlayerDropdown from "../components/player/PlayerDropdown";
import ErrorMessage from "../components/common/ErrorMessage";
import Player from "../components/player/Player";
import LogoutButton from "../components/common/LogoutButton";

const PlayerPage = () => {
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query) {
      setError("Please enter a search query.");
      return;
    }

    setError("");
    setPlayers([]);
    setSelectedPlayerId(null);

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Search failed");
      }

      const data = await res.json();
      setPlayers(data.players || []);
    } catch (err: any) {
      setError(err.message || "An error occurred during the search.");
    }
  };

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayerId(playerId);
  };

  return (
    <div>
      <h1>Player Search and Profile</h1>
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
      />
      {error && <ErrorMessage error={error} />}
      {!selectedPlayerId && players.length > 0 && (
        <PlayerDropdown players={players} onSelect={handlePlayerSelect} />
      )}
      {selectedPlayerId && <Player playerId={selectedPlayerId} />}
      <LogoutButton />
    </div>
  );
};

export default PlayerPage;
