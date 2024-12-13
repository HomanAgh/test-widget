'use client';

import React, { useState, useEffect } from "react";
import { Player } from "@/app/types/player";

interface SearchBarProps {
  onSelect: (playerId: string) => void;
  onError: (error: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelect, onError }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // Adjust delay as needed

    return () => clearTimeout(handler);
  }, [query]);

  // Fetch and sort players by views when the debounced query changes
  useEffect(() => {
    const fetchPlayers = async () => {
      if (!debouncedQuery) {
        setPlayers([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/searchPlayer?query=${encodeURIComponent(debouncedQuery)}`
        );
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "SearchFailed");
        }

        const data = await res.json();

        // Sort players by views and limit to top 20
        const sortedPlayers = data.players
          .filter((player: Player) => typeof player.views === "number")
          .sort((a: Player, b: Player) => b.views - a.views) // Descending order
          .slice(0, 20); // Top 20 players

        setPlayers(sortedPlayers);
        setShowDropdown(true);
      } catch (err: any) {
        onError(err.message || "SearchError");
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, [debouncedQuery, onError]);

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || players.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % players.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + players.length) % players.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < players.length) {
        handleSelect(players[highlightedIndex].id);
      } else if (query.trim()) {
        setShowDropdown(false);
        onSelect(query.trim());
      }
    }
  };

  const handleSelect = (playerId: string) => {
    setShowDropdown(false);
    setQuery("");
    onSelect(playerId);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={"Search for players..."}
        className="border p-2 rounded-md w-full"
        onKeyDown={handleKeyDown}
        onFocus={() => setShowDropdown(players.length > 0)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      {showDropdown && (
        <ul
          className="absolute left-0 right-0 bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10"
        >
          {players.map((player, index) => (
            <li
              key={player.id}
              onClick={() => handleSelect(player.id)}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                highlightedIndex === index ? "bg-gray-200" : ""
              }`}
            >
              {`${player.name} - ${player.team} (${player.league}) - ${"Views"}: ${player.views}`}
            </li>
          ))}
          {isLoading && <li className="p-2 text-gray-500">{"Loading..."}</li>}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
