'use client';

import React from 'react';

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onQueryChange, onSearch }) => {
  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Enter player name..."
      />
      <button onClick={onSearch}>Search</button>
    </div>
  );
};

export default SearchBar;

 