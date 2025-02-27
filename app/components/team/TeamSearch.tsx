"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Team, TeamsAPIResponse } from "@/app/types/team"; 
import { SearchBarContainer, SearchInput, Dropdown, DropdownItem, LoadingItem } from "../common/style/Searchbar";
import ErrorMessage from "../common/ErrorMessage";

interface TeamSearchBarProps {
  onSelect?: (teamId: string) => void;
  onError?: (error: string) => void;
}

const TeamSearchBar: React.FC<TeamSearchBarProps> = ({ onSelect, onError }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
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
    const fetchTeams = async () => {
      if (!debouncedQuery) {
        setTeams([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/searchTeam?query=${encodeURIComponent(debouncedQuery)}`
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Search Failed");
        }

        const data: TeamsAPIResponse = await res.json();
        const sortedTeams = data.teams
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 20);

        setTeams(sortedTeams);
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

    fetchTeams();
  }, [debouncedQuery, stableOnError]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || teams.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % teams.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + teams.length) % teams.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < teams.length) {
        handleSelect(teams[highlightedIndex].id);
      } else if (query.trim()) {
        setShowDropdown(false);
        handleSelect(query.trim());
      }
    }
  };

  const handleSelect = (teamId: string) => {
    setShowDropdown(false);
    setQuery("");
    if (onSelect) {
      onSelect(teamId);
    } else {
      // Default navigation if no onSelect provided
      window.location.href = `/team/${teamId}`;
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
          onFocus={() => setShowDropdown(teams.length > 0)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder="Search for a team..."
        />
        {showDropdown && (
          <Dropdown>
            {teams.map((team, index) => (
              <DropdownItem
                key={team.id}
                onClick={() => handleSelect(team.id)}
                isHighlighted={highlightedIndex === index}
              >
                {`${team.name} - ${team.league} (${team.country})`}
              </DropdownItem>
            ))}
            {isLoading && <LoadingItem/>}
          </Dropdown>
        )}
      </SearchBarContainer>
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}
    </>
  );
};

export default TeamSearchBar;
