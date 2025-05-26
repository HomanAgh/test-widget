"use client";

import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
} from "react";
import { HexColorPicker } from "react-colorful";

interface HexColorsProps {
  customColors?: {
    headerTextColor: string;
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    nameTextColor: string;
  };
  setCustomColors?: Dispatch<
    SetStateAction<{
      headerTextColor: string;
      backgroundColor: string;
      textColor: string;
      tableBackgroundColor: string;
      nameTextColor: string;
    }>
  >;
  // New props for individual color picker
  label?: string;
  value?: string;
  onChange?: (color: string) => void;
  // New props for height control
  height?: number;
  onHeightChange?: (height: number) => void;
  defaultHeight?: number;
  // New props for subheader colors
  subHeaderColors?: {
    backgroundColor: string;
    textColor: string;
  };
  setSubHeaderColors?: Dispatch<
    SetStateAction<{
      backgroundColor: string;
      textColor: string;
    }>
  >;
  // New props for settings display
  isPaginationEnabled?: boolean;
  isLeagueGroupingEnabled?: boolean;
  onResetSettings?: () => void;
}

// Default colors
const DEFAULT_COLORS = {
  headerTextColor: "#FFFFFF",
  backgroundColor: "#052D41",
  textColor: "#000000",
  tableBackgroundColor: "#FFFFFF",
  nameTextColor: "#0D73A6",
};

// Helper function to check if a string is a valid hex color
const isValidHex = (hex: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
};

// Helper function to check if colors have been changed from defaults
const colorsChanged = (colors: typeof DEFAULT_COLORS): boolean => {
  return Object.keys(DEFAULT_COLORS).some(
    (key) =>
      colors[key as keyof typeof DEFAULT_COLORS] !==
      DEFAULT_COLORS[key as keyof typeof DEFAULT_COLORS]
  );
};

const ColorPickerButton = ({
  label,
  color,
  onChange,
}: {
  label: string;
  color: string;
  defaultColor: string;
  onChange: (color: string) => void;
  showBadge?: boolean;
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [inputValue, setInputValue] = useState(color);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close the picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update input value when color changes
  useEffect(() => {
    setInputValue(color);
  }, [color]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (isValidHex(value)) {
      onChange(value);
    }
  };

  return (
    <div className="relative mb-6" ref={pickerRef}>
      <div
        className="mb-2"
        style={{
          color: "#000",
          fontFamily: "Montserrat",
          fontSize: "14px",
          fontWeight: 700,
          lineHeight: "24px",
          fontFeatureSettings: "'liga' off, 'clig' off",
        }}
      >
        {label}
      </div>
      <div className="flex">
        <div className="relative flex-grow-0" style={{ width: "160px" }}>
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="flex items-center border border-gray-300 rounded-l px-3 py-1 bg-white hover:bg-gray-50 w-full h-[36px] relative"
            style={{
              fontFamily: "Montserrat",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "24px",
              cursor: "pointer",
            }}
          >
            <span style={{ marginRight: "auto" }}>Choose</span>
            <div
              className="rounded-full border border-gray-300 inline-block"
              style={{
                backgroundColor: color,
                width: "24px",
                height: "24px",
                marginRight: "8px",
              }}
            />
            <svg
              className="inline-block"
              style={{
                width: "16px",
                height: "16px",
                fill: "none",
                stroke: "#000",
                strokeWidth: "1px",
                verticalAlign: "middle",
              }}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            className="border border-gray-300 border-l-0 rounded-r p-1 w-[120px] h-[36px] text-center"
            value={inputValue}
            onChange={handleInputChange}
            style={{
              fontFamily: "Montserrat",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "24px",
            }}
          />
        </div>
      </div>

      {showPicker && (
        <div className="absolute z-50 mt-1 p-3 bg-white rounded-lg shadow-lg">
          <HexColorPicker color={color} onChange={onChange} />
          <div className="flex justify-between mt-3">
            <input
              type="text"
              className="border p-1 rounded w-[100px]"
              value={inputValue}
              onChange={handleInputChange}
              style={{
                fontFamily: "Montserrat",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "24px",
              }}
            />
            <button
              onClick={() => setShowPicker(false)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              style={{
                fontFamily: "Montserrat",
                fontSize: "14px",
                fontWeight: 700,
                lineHeight: "24px",
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsDisplay = ({
  isPaginationEnabled,
  isLeagueGroupingEnabled,
  onResetSettings,
}: {
  isPaginationEnabled?: boolean;
  isLeagueGroupingEnabled?: boolean;
  onResetSettings?: () => void;
}) => {
  if (isPaginationEnabled === undefined && isLeagueGroupingEnabled === undefined) {
    return null;
  }

  // Check if settings have been changed from defaults (pagination: true, league grouping: false)
  const settingsChanged = isPaginationEnabled === false || isLeagueGroupingEnabled === true;

  return (
    <div className="mt-2 p-2 rounded text-[#052D41] font-montserrat text-lg">
      <strong>Selected Settings</strong>
      <div className="flex flex-wrap gap-2 mt-3 mb-2">
        {isPaginationEnabled !== undefined && (
          <span className="inline-flex items-center bg-white text-[#0D73A6] px-2 py-1 text-sm font-sans font-semibold border-[1.5px] border-[#0D73A6] rounded-[36px]">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                isPaginationEnabled ? "bg-green-500" : "bg-blue-500"
              }`}
            />
            {isPaginationEnabled ? "Pagination Enabled" : "Scroll Enabled"}
          </span>
        )}
        {isLeagueGroupingEnabled !== undefined && isLeagueGroupingEnabled && (
          <span className="inline-flex items-center bg-white text-[#0D73A6] px-2 py-1 text-sm font-sans font-semibold border-[1.5px] border-[#0D73A6] rounded-[36px]">
            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
            League Grouping Enabled
          </span>
        )}
      </div>
      
      {/* Reset Settings Button */}
      {onResetSettings && (
        <button
          onClick={() => settingsChanged && onResetSettings()}
          className={`mt-4 rounded uppercase text-sm tracking-wider text-left ${
            settingsChanged ? "cursor-pointer" : "cursor-not-allowed"
          }`}
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            lineHeight: "24px",
            backgroundColor: "transparent",
            color: settingsChanged ? "#0B9D52" : "#9CA3AF",
            border: "none",
            letterSpacing: "0.05em",
            display: "block",
            textAlign: "left",
            padding: "0",
            marginBottom: "2rem",
          }}
        >
          RESET TO DEFAULT SETTINGS
        </button>
      )}
    </div>
  );
};

const HeightControl = ({
  height,
  onChange,
  hasChanges,
  defaultHeight,
}: {
  height: number;
  onChange: (height: number) => void;
  hasChanges: boolean;
  defaultHeight: number;
}) => {
  return (
    <div className="relative mb-6">
      <div
        className="mb-2"
        style={{
          color: "#000",
          fontFamily: "Montserrat",
          fontSize: "14px",
          fontWeight: 700,
          lineHeight: "24px",
          fontFeatureSettings: "'liga' off, 'clig' off",
        }}
      >
        Iframe Height
      </div>
      <div className="flex">
        <div className="relative flex-grow-0" style={{ width: "160px" }}>
          <input
            type="number"
            className="flex items-center border border-gray-300 rounded-l px-3 py-1 bg-white hover:bg-gray-50 w-full h-[36px] relative"
            value={height}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{
              fontFamily: "Montserrat",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "24px",
            }}
          />
        </div>
        <div className="relative">
          <button
            onClick={() => onChange(defaultHeight)}
            className={`border border-gray-300 border-l-0 rounded-r p-1 w-[120px] h-[36px] text-center ${
              hasChanges
                ? "text-[#0B9D52] hover:text-[#0A8A47]"
                : "text-gray-400"
            }`}
            style={{
              fontFamily: "Montserrat",
              fontSize: "12px",
              fontWeight: 700,
              lineHeight: "24px",
              backgroundColor: "#fff",
              letterSpacing: "0.05em",
            }}
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  );
};

const HexColors: React.FC<HexColorsProps> = ({
  customColors,
  setCustomColors,
  label,
  value,
  onChange,
  height,
  onHeightChange,
  defaultHeight,
  subHeaderColors,
  setSubHeaderColors,
  isPaginationEnabled,
  isLeagueGroupingEnabled,
  onResetSettings,
}) => {
  // Check if any colors have been changed from defaults
  const hasChanges = customColors ? colorsChanged(customColors) : false;
  
  // Check if subheader colors have been changed from defaults
  const subHeaderDefaults = { backgroundColor: "#f8f9fa", textColor: "#000000" };
  const subHeaderChanged = subHeaderColors ? 
    (subHeaderColors.backgroundColor !== subHeaderDefaults.backgroundColor || 
     subHeaderColors.textColor !== subHeaderDefaults.textColor) : false;
  
  const heightChanged =
    height !== undefined &&
    defaultHeight !== undefined &&
    height !== defaultHeight;
    
  // Combined check for any changes
  const anyChanges = hasChanges || subHeaderChanged;

  // If using the individual color picker mode
  if (label && value !== undefined && onChange) {
    const defaultValue =
      DEFAULT_COLORS[
        label.replace(/\s+/g, "").toLowerCase() as keyof typeof DEFAULT_COLORS
      ] || "#000000";
    return (
      <ColorPickerButton
        label={label}
        color={value}
        defaultColor={defaultValue}
        onChange={onChange}
      />
    );
  }

  // Original component for backward compatibility with new UI
  if (customColors && setCustomColors) {
    return (
      <div className="w-full" style={{ fontFamily: "Montserrat" }}>
        {/* Settings Display */}
        <SettingsDisplay 
          isPaginationEnabled={isPaginationEnabled}
          isLeagueGroupingEnabled={isLeagueGroupingEnabled}
          onResetSettings={onResetSettings}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 border-t border-gray-200 pt-6">
          <ColorPickerButton
            label="Header background"
            color={customColors.backgroundColor}
            defaultColor={DEFAULT_COLORS.backgroundColor}
            onChange={(color) =>
              setCustomColors((prev) => ({ ...prev, backgroundColor: color }))
            }
            showBadge={true}
          />

          <ColorPickerButton
            label="Header text"
            color={customColors.headerTextColor}
            defaultColor={DEFAULT_COLORS.headerTextColor}
            onChange={(color) =>
              setCustomColors((prev) => ({ ...prev, headerTextColor: color }))
            }
          />

          <ColorPickerButton
            label="Table background"
            color={customColors.tableBackgroundColor}
            defaultColor={DEFAULT_COLORS.tableBackgroundColor}
            onChange={(color) =>
              setCustomColors((prev) => ({
                ...prev,
                tableBackgroundColor: color,
              }))
            }
          />

          <ColorPickerButton
            label="Table text"
            color={customColors.textColor}
            defaultColor={DEFAULT_COLORS.textColor}
            onChange={(color) =>
              setCustomColors((prev) => ({ ...prev, textColor: color }))
            }
            showBadge={true}
          />

          <ColorPickerButton
            label="Player name text"
            color={customColors.nameTextColor}
            defaultColor={DEFAULT_COLORS.nameTextColor}
            onChange={(color) =>
              setCustomColors((prev) => ({ ...prev, nameTextColor: color }))
            }
          />

          {height !== undefined &&
            onHeightChange &&
            defaultHeight !== undefined && (
              <HeightControl
                height={height}
                onChange={onHeightChange}
                hasChanges={heightChanged}
                defaultHeight={defaultHeight}
              />
            )}
        </div>

        {/* Subheader Colors - only show when league grouping is enabled */}
        {isLeagueGroupingEnabled && subHeaderColors && setSubHeaderColors && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
            <ColorPickerButton
              label="Subheader background"
              color={subHeaderColors.backgroundColor}
              defaultColor="#f8f9fa"
              onChange={(color) => setSubHeaderColors(prev => ({ ...prev, backgroundColor: color }))}
            />
            <ColorPickerButton
              label="Subheader text"
              color={subHeaderColors.textColor}
              defaultColor="#000000"
              onChange={(color) => setSubHeaderColors(prev => ({ ...prev, textColor: color }))}
            />
            {/* Empty space for potential third color picker */}
            <div></div>
          </div>
        )}

        <div className="mt-6 mb-6">
          <button
            onClick={() => {
              if (anyChanges) {
                setCustomColors(DEFAULT_COLORS);
                if (setSubHeaderColors) {
                  setSubHeaderColors(subHeaderDefaults);
                }
              }
            }}
            className={`px-4 py-2 rounded uppercase text-sm tracking-wider text-left ${
              anyChanges ? "cursor-pointer" : "cursor-not-allowed"
            }`}
            style={{
              fontFamily: "Montserrat",
              fontSize: "12px",
              fontWeight: 700,
              lineHeight: "24px",
              backgroundColor: "transparent",
              color: anyChanges ? "#0B9D52" : "#9CA3AF",
              border: "none",
              letterSpacing: "0.05em",
              display: "block",
              textAlign: "left",
              padding: "0",
            }}
          >
            RESET TO DEFAULT COLOURS
          </button>
        </div>

        <div
          style={{
            borderBottom: "1px solid #E5E7EB",
            marginTop: "2rem",
            marginBottom: "1.5rem",
          }}
        />
      </div>
    );
  }

  return null;
};

export default HexColors;
