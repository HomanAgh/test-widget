"use client";

import React from "react";

export interface TeamColumnOptions {
  name: boolean; // Always true, can't be unchecked
  number: boolean;
  position: boolean;
  age: boolean;
  birthYear: boolean;
  birthPlace: boolean;
  weight: boolean;
  height: boolean;
  shootsCatches: boolean;
  goals: boolean;
  assists: boolean;
  points: boolean;
}

interface TeamColumnSelectorProps {
  selectedColumns: TeamColumnOptions;
  onChange: (columns: TeamColumnOptions) => void;
}

const DEFAULT_COLUMNS: TeamColumnOptions = {
  name: true, // Always true
  number: true,
  position: true,
  age: true,
  birthYear: true,
  birthPlace: true,
  weight: true,
  height: true,
  shootsCatches: true,
  goals: true,
  assists: true,
  points: true,
};

// Helper function to convert camelCase to Title Case with spaces
const formatColumnName = (key: string): string => {
  // Special cases
  if (key === "shootsCatches") return "Shoots/Catches";
  if (key === "birthYear") return "Birth Year";
  if (key === "birthPlace") return "Birth Place";

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const TeamColumnSelector: React.FC<TeamColumnSelectorProps> = ({
  selectedColumns,
  onChange,
}) => {
  // Function to toggle a column
  const toggleColumn = (key: keyof TeamColumnOptions) => {
    // Don't allow toggling name column
    if (key === "name") return;

    onChange({
      ...selectedColumns,
      [key]: !selectedColumns[key],
    });
  };

  // Reset to default selection
  const resetToDefault = () => {
    onChange({ ...DEFAULT_COLUMNS });
  };

  // Check if there are any changes from default
  const hasChanges = Object.entries(DEFAULT_COLUMNS).some(
    ([key]) =>
      selectedColumns[key as keyof TeamColumnOptions] !==
      DEFAULT_COLUMNS[key as keyof TeamColumnOptions]
  );

  return (
    <div className="w-full" style={{ fontFamily: "Montserrat" }}>
      <h2
        className="mb-6"
        style={{
          fontSize: "18px",
          fontWeight: 700,
          lineHeight: "24px",
          color: "#000",
          fontFamily: "Montserrat",
        }}
      >
        Select columns
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
        {Object.entries(DEFAULT_COLUMNS).map(([key]) => {
          const columnKey = key as keyof TeamColumnOptions;
          const isNameColumn = columnKey === "name";
          const isSelected = selectedColumns[columnKey];

          return (
            <div key={key} className="flex items-center mb-6">
              <input
                type="checkbox"
                id={`column-${key}`}
                checked={isSelected}
                onChange={() => toggleColumn(columnKey)}
                disabled={isNameColumn}
                className="mr-2 h-4 w-4 text-blue-600 rounded"
              />
              <label
                htmlFor={`column-${key}`}
                style={{
                  fontFamily: "Montserrat",
                  fontSize: "14px",
                  fontWeight: 400,
                  color: isNameColumn ? "#6B7280" : "#000000",
                }}
              >
                {formatColumnName(key)}
                {isNameColumn && (
                  <span className="ml-1 text-xs text-gray-400">(required)</span>
                )}
              </label>
            </div>
          );
        })}
      </div>

      <div className="mt-6 mb-6">
        <button
          onClick={() => hasChanges && resetToDefault()}
          className={`rounded uppercase tracking-wider ${
            hasChanges ? "cursor-pointer" : "cursor-not-allowed"
          }`}
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

export default TeamColumnSelector;
