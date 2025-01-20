import React, { useState } from 'react';
import { League } from '@/app/types/league';

interface LeagueSelectionDropdownProps {
  professionalLeagues: League[];
  juniorLeagues: League[];
  collegeLeagues: League[]; // Add this line
  selectedLeagues: string[];
  onChange: (selected: string[]) => void;
}

const LeagueSelectionDropdown: React.FC<LeagueSelectionDropdownProps> = ({
  professionalLeagues,
  juniorLeagues,
  collegeLeagues,
  selectedLeagues,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (leagueSlug: string) => {
    const isSelected = selectedLeagues.includes(leagueSlug);
    const updatedLeagues = isSelected
      ? selectedLeagues.filter((slug) => slug !== leagueSlug)
      : [...selectedLeagues, leagueSlug];

    onChange(updatedLeagues);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="w-full bg-blue-500 text-white font-bold p-2 rounded flex justify-between items-center"
      >
        Select Leagues
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute bg-white border rounded shadow-lg w-full mt-2 z-10 p-4">
          {/* Professional Leagues */}
          <div>
            <h3 className="font-bold mb-2">Professional Leagues</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {professionalLeagues.map((league) => (
                <label key={league.slug} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedLeagues.includes(league.slug)}
                    onChange={() => handleCheckboxChange(league.slug)}
                  />
                  <span>{league.name}</span>
                </label>
              ))}
            </div>
          </div>
     
          <hr className="my-4" />

          {/* College Leagues */}
          <div>
            <h3 className="font-bold mb-2">College Leagues</h3>
            <div className="grid grid-cols-2 gap-2">
              {collegeLeagues.map((league) => (
                <label key={league.slug} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedLeagues.includes(league.slug)}
                    onChange={() => handleCheckboxChange(league.slug)}
                  />
                  <span>{league.name}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="my-4" />

          {/* Junior Leagues */}
          <div>
            <h3 className="font-bold mb-2">Junior Leagues</h3>
            <div className="grid grid-cols-2 gap-2">
              {juniorLeagues.map((league) => (
                <label key={league.slug} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedLeagues.includes(league.slug)}
                    onChange={() => handleCheckboxChange(league.slug)}
                  />
                  <span>{league.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeagueSelectionDropdown;
