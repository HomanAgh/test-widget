/* import React from 'react';

interface FilterOption {
  value: string;
  label: string;
}


interface FilterToggleProps {
    options: FilterOption[];
    activeFilter: 'league' | 'customLeague' | 'junLeague' | 'customJunLeague';
    onChange: (value: 'league' | 'customLeague' | 'junLeague' | 'customJunLeague') => void;
}
  

const FilterToggle: React.FC<FilterToggleProps> = ({ options, activeFilter, onChange }) => {
  return (
    <div className="flex space-x-4 mb-4">
      {options.map((option) => (
        <button
          key={option.value}
          className={`p-2 rounded ${
            activeFilter === option.value ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => onChange(option.value as 'league' | 'customLeague' | 'junLeague' | 'customJunLeague')}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default FilterToggle;
 */

import React from 'react';

interface FilterToggleOption {
  value: string;
  label: string;
}

interface FilterToggleProps {
  options: FilterToggleOption[];
  activeFilter: string;
  onChange: (filter: string) => void;
}

const FilterToggle: React.FC<FilterToggleProps> = ({ options, activeFilter, onChange }) => {
  return (
    <div className="flex space-x-4 mb-4">
      {options.map((option) => (
        <button
          key={option.value}
          className={`p-2 rounded ${
            activeFilter === option.value ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default FilterToggle;
