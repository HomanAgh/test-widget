"use client";

import React, { useState } from "react";

interface SearchBarProps {
  type: "team" | "league";
  onSelect: (value: string) => void;
  onError: (error: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ type, onSelect, onError }) => {
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!query) {
      const errorMessage =
        type === "team"
          ? "Enter Team Name Error" 
          : "Enter League Slug Error";
      onError(errorMessage);
      return;
    }

    setIsLoading(true);
    try {
      onSelect(query.trim());
    } catch {
      // General error message
      onError("Search Error");
    } finally {
      setIsLoading(false);
    }
  };

  const placeholderText =
    type === "team"
      ? "Enter Team Name" 
      : "Enter League Slug";

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholderText}
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
