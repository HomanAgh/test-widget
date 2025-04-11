"use client";

import React from "react";

export interface ColumnOptions {
  name: boolean; // Always true, can't be unchecked
  birthYear: boolean;
  draftPick: boolean;
  tournamentTeam: boolean;
  tournamentSeason: boolean;
  juniorTeams: boolean;
  collegeTeams: boolean;
  proTeams: boolean;
}

interface ColumnSelectorProps {
  selectedColumns: ColumnOptions;
  onChange: (columns: ColumnOptions) => void;
  selectedLeagueCategories?: {
    junior: boolean;
    college: boolean;
    professional: boolean;
  };
}

const DEFAULT_COLUMNS: ColumnOptions = {
  name: true, // Always true
  birthYear: true,
  draftPick: true, 
  tournamentTeam: true,
  tournamentSeason: true,
  juniorTeams: false,
  collegeTeams: false,
  proTeams: true,
};

// Helper function to convert camelCase to Title Case with spaces
const formatColumnName = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  selectedColumns,
  onChange,
  selectedLeagueCategories = {
    junior: true,
    college: true,
    professional: true
  }
}) => {
  // Function to toggle a column
  const toggleColumn = (key: keyof ColumnOptions) => {
    // Don't allow toggling name column or disabled columns
    if (key === "name") return;
    if (key === "juniorTeams" && !selectedLeagueCategories.junior) return;
    if (key === "collegeTeams" && !selectedLeagueCategories.college) return;
    if (key === "proTeams" && !selectedLeagueCategories.professional) return;
    
    onChange({
      ...selectedColumns,
      [key]: !selectedColumns[key],
    });
  };

  // Reset to default selection
  const resetToDefault = () => {
    // When resetting, keep league-dependent columns disabled if their leagues aren't selected
    const newColumns = { ...DEFAULT_COLUMNS };
    
    if (!selectedLeagueCategories.junior) {
      newColumns.juniorTeams = false;
    }
    
    if (!selectedLeagueCategories.college) {
      newColumns.collegeTeams = false;
    }
    
    if (!selectedLeagueCategories.professional) {
      newColumns.proTeams = false;
    }
    
    onChange(newColumns);
  };

  // Check if there are any changes from default
  const hasChanges = Object.entries(DEFAULT_COLUMNS).some(
    ([key]) => selectedColumns[key as keyof ColumnOptions] !== DEFAULT_COLUMNS[key as keyof ColumnOptions]
  );

  return (
    <div className="w-full" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <h2 
        className="mb-6" 
        style={{ 
          fontSize: "18px",
          fontWeight: 700,
          lineHeight: "24px",
          color: "#000",
          fontFamily: "Montserrat, sans-serif"
        }}
      >
        Select columns
      </h2>
      
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4"
      >
        {Object.entries(DEFAULT_COLUMNS).map(([key]) => {
          const columnKey = key as keyof ColumnOptions;
          const isNameColumn = columnKey === 'name';
          const isJuniorColumn = columnKey === 'juniorTeams';
          const isCollegeColumn = columnKey === 'collegeTeams';
          const isProColumn = columnKey === 'proTeams';
          
          // Disable checkboxes if corresponding league category isn't selected
          const isDisabled = 
            isNameColumn || 
            (isJuniorColumn && !selectedLeagueCategories.junior) ||
            (isCollegeColumn && !selectedLeagueCategories.college) ||
            (isProColumn && !selectedLeagueCategories.professional);
            
          const isSelected = selectedColumns[columnKey];

          return (
            <div key={key} className="flex items-center mb-6">
              <input
                type="checkbox"
                id={`column-${key}`}
                checked={isSelected}
                onChange={() => toggleColumn(columnKey)}
                disabled={isDisabled}
                className="mr-2 h-4 w-4 text-blue-600 rounded"
              />
              <label 
                htmlFor={`column-${key}`}
                style={{
                  fontFamily: "Montserrat",
                  fontSize: "14px",
                  fontWeight: 400,
                  color: isDisabled ? '#6B7280' : '#000000'
                }}
              >
                {formatColumnName(key)}
                {isNameColumn && <span className="ml-1 text-xs text-gray-400">(required)</span>}
                {!isNameColumn && isDisabled && <span className="ml-1 text-xs text-gray-400">(no leagues selected)</span>}
              </label>
            </div>
          );
        })}
      </div>

      <div className="mt-6 mb-6">
        <button
          onClick={() => hasChanges && resetToDefault()}
          className={`rounded uppercase tracking-wider ${hasChanges ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          style={{
            fontFamily: "Montserrat",
            fontSize: "12px",
            fontWeight: 700,
            lineHeight: "24px",
            backgroundColor: "transparent",
            color: hasChanges ? "#0B9D52" : "#9CA3AF",
            border: "none",
            letterSpacing: "0.05em",
            display: "block",
            textAlign: "left",
            padding: "0",
          }}
        >
          RESET TO DEFAULT COLUMNS
        </button>
      </div>
      
      <div 
        style={{
          borderBottom: "1px solid #E5E7EB",
          marginBottom: "1.5rem",
        }}
      />
    </div>
  );
};

export default ColumnSelector; 