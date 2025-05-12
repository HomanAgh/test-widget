"use client";

import React, { useState, useEffect, useCallback } from "react";
import { League, LeaguesAPIResponse } from "@/app/types/league"; 
import { SearchBarContainer, SearchInput, Dropdown, DropdownItem, LoadingItem } from "../common/style/Searchbar";
import ErrorMessage from "../common/ErrorMessage";

interface LeaguePlayoffSearchBarProps {
  onSelect?: (leagueSlug: string) => boolean;
  onError?: (error: string) => void;
}

const LeaguePlayoffSearchBar: React.FC<LeaguePlayoffSearchBarProps> = ({ onSelect, onError }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [leagues, setLeagues] = useState<League[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Stabilize the onError callback
  const stableOnError = useCallback((errorMessage: string) => {
    if (onError) onError(errorMessage);
  }, [onError]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); 

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const fetchLeagues = async () => {
      if (!debouncedQuery) {
        setLeagues([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/searchLeague?query=${encodeURIComponent(debouncedQuery)}`
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Search Failed");
        }

        const data: LeaguesAPIResponse = await res.json();

        const sortedLeagues = data.leagues
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 20);

        setLeagues(sortedLeagues);
        setShowDropdown(true);
      } catch (err: unknown) {
        let errorMessage = "An error occurred during the search.";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        stableOnError(errorMessage);
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeagues();
  }, [debouncedQuery, stableOnError]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || leagues.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % leagues.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + leagues.length) % leagues.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < leagues.length) {
        handleSelect(leagues[highlightedIndex].slug);
      } else if (query.trim()) {
        setShowDropdown(false);
        handleSelect(query.trim());
      }
    }
  };

  const handleSelect = (leagueSlug: string) => {
    setShowDropdown(false);
    setQuery("");
    if (onSelect) {
      const handled = onSelect(leagueSlug);
      // If onSelect returns true, it means navigation has been handled
      if (handled === true) {
        return;
      }
    }
    // Default navigation if no onSelect provided or if onSelect didn't handle navigation
    window.location.href = `/leaguePlayoff/${leagueSlug}?season=2024-2025`;
  };

  return (
    <>
      <SearchBarContainer>
        <SearchInput
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(leagues.length > 0)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder="Search for a league playoff..."
        />
        {showDropdown && (
          <Dropdown>
            {leagues.map((league, index) => (
              <DropdownItem
                key={league.slug}
                onClick={() => handleSelect(league.slug)}
                isHighlighted={highlightedIndex === index}
              >
                {`${league.name} - ${league.fullName} (${league.country})`}
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

export default LeaguePlayoffSearchBar; 