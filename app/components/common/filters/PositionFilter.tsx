"use client";

import React, { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { POSITIONS } from "./PositionsFilterOption";

interface PositionFilterProps {
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
  };
}

const PositionFilter: React.FC<PositionFilterProps> = ({
  selectedValues,
  onSelectionChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleCheckboxChange = (value: string) => {
    const isSelected = selectedValues.includes(value);
    const updatedValues = isSelected
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onSelectionChange(updatedValues);
  };

  const removeValue = (value: string) => {
    const updatedValues = selectedValues.filter((v) => v !== value);
    onSelectionChange(updatedValues);
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const allSelected = POSITIONS.every((option) =>
    selectedValues.includes(option.value)
  );

  const handleSelectAllToggle = () => {
    onSelectionChange(allSelected ? [] : POSITIONS.map((opt) => opt.value));
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="w-full bg-[#052D41] text-white text-sm font-montserrat font-bold p-2 rounded flex justify-between items-center"
      >
        SELECT POSITIONS
        <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </button>

      {isOpen && (
        <div className="absolute bg-white border rounded w-full z-10 p-4 font-montserrat">
          <button
            onClick={handleSelectAllToggle}
            className="absolute top-2 right-2 uppercase text-sm tracking-wider cursor-pointer"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              lineHeight: "24px",
              backgroundColor: "transparent",
              color: "#0B9D52",
              border: "none",
              letterSpacing: "0.05em",
              textAlign: "right",
              padding: "0",
            }}
          >
            {allSelected ? "DESELECT ALL" : "SELECT ALL"}
          </button>

          <div className="mt-6">
            <div className="grid grid-cols-2 gap-2">
              {POSITIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => handleCheckboxChange(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedValues.length > 0 && (
        <div className="mt-2 p-2 rounded text-[#052D41] font-montserrat text-lg">
          <strong>Selected Positions</strong>
          <div className="flex flex-wrap gap-2 mt-3 mb-2">
            {selectedValues.map((value) => {
              const option = POSITIONS.find((opt) => opt.value === value);
              return (
                <span
                  key={value}
                  className="inline-flex items-center bg-white text-[#0D73A6] px-2 py-1 text-sm font-sans font-semibold border-[1.5px] border-[#0D73A6] rounded-[36px]"
                >
                  {option?.label}
                  <button
                    onClick={() => removeValue(value)}
                    className="ml-2 flex items-center justify-center self-center"
                    aria-label={`Remove ${option?.label}`}
                  >
                    <img
                      src="/images/close (x).svg"
                      alt="Remove filter"
                      width={16}
                      height={16}
                      className="relative top-[0.5px] transform scale-110"
                    />
                  </button>
                </span>
              );
            })}
          </div>
          <button
            onClick={clearAll}
            className="mt-2 rounded uppercase text-sm tracking-wider text-left cursor-pointer"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              lineHeight: "24px",
              backgroundColor: "transparent",
              color: "#0B9D52",
              border: "none",
              letterSpacing: "0.05em",
              display: "block",
              textAlign: "left",
              padding: "0",
              marginBottom: "-9px",
            }}
          >
            CLEAR ALL
          </button>
        </div>
      )}
    </div>
  );
};

export default PositionFilter;
