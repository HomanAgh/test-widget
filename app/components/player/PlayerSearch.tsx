'use client';

import React, { useState, useEffect } from "react";
import { Player } from "@/app/types/player";
import { SearchBarContainer, SearchInput, Dropdown, DropdownItem, LoadingItem } from "../common/style/Searchbar";
import ErrorMessage from "../common/ErrorMessage";

interface SearchBarProps {
  onSelect?: (playerId: string) => void;
  onError?: (error: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelect, onError }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!debouncedQuery) {
        setPlayers([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/searchPlayer?query=${encodeURIComponent(debouncedQuery)}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "SearchFailed");
        }

        const data = await res.json();
        const sortedPlayers = data.players
          .filter((player: Player) => typeof player.views === "number")
          .sort((a: Player, b: Player) => b.views - a.views)
          .slice(0, 20);

        setPlayers(sortedPlayers);
        setShowDropdown(true);
      } catch (err: any) {
        const errorMessage = err.message || "SearchError";
        setError(errorMessage);
        if (onError) onError(errorMessage);
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, [debouncedQuery, onError]);

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
        handleSelect(query.trim());
      }
    }
  };

  const handleSelect = (playerId: string) => {
    setShowDropdown(false);
    setQuery("");
    if (onSelect) {
      onSelect(playerId);
    } else {
      // Default navigation if no onSelect provided
      window.location.href = `/player/${playerId}`;
    }
  };

  return (
    <>
      <SearchBarContainer>
        <SearchInput
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(players.length > 0)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder="Search for a player..."
        />
        {showDropdown && (
          <Dropdown>
            {players.map((player, index) => (
              <DropdownItem
                key={player.id}
                onClick={() => handleSelect(player.id)}
                isHighlighted={highlightedIndex === index}
              >
                {`${player.name} - ${player.team} (${player.league}) - Views: ${player.views}`}
              </DropdownItem>
            ))}
            {isLoading && <LoadingItem />}
          </Dropdown>
        )}
      </SearchBarContainer>
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}
    </>
  );
};

export default SearchBar;
