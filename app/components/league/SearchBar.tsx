"use client";

import React, { useState } from "react";

interface SearchBarProps {
  onSelect: (leagueSlug: string) => void;
  onError: (error: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelect, onError }) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) {
      onError("Please enter a league slug (e.g., 'shl', 'khl')");
      return;
    }

    setIsLoading(true);
    try {
      onSelect(query.trim());
    } catch (error) {
      onError("An error occurred during the search.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter league slug (e.g., 'shl', 'khl')..."
        className="border p-2 rounded-md w-full"
      />
      <button
        onClick={handleSearch}
        disabled={isLoading}
        className={`mt-2 p-2 rounded-md ${
          isLoading ? "bg-gray-400" : "bg-blue-500 text-white"
        }`}
      >
        {isLoading ? "Loading..." : "Search"}
      </button>
    </div>
  );
};

export default SearchBar;
