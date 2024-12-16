import React from "react";
import ToggleableColorPicker from "../common/color-picker/ToggleableColorPicker";

interface BackgroundSelectorProps {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  teamColor?: string; // Optional team color
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  backgroundColor,
  setBackgroundColor,
  teamColor,
}) => {
  return (
    <div className="mb-6 text-center">
      {/* Buttons Row */}
      <div className="flex justify-center items-center space-x-4">
        {/* Team Color Button */}
        {teamColor && (
          <button
            onClick={() => setBackgroundColor(teamColor)}
            className={`px-4 py-2 rounded-md ${
              backgroundColor === teamColor
                ? "bg-blue-700 text-white"
                : "bg-blue-500 text-white"
            } hover:bg-blue-600`}
          >
            Use Team Color
          </button>
        )}

        {/* Reset to White Button */}
        <button
          onClick={() => setBackgroundColor("#FFFFFF")}
          className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
        >
          Reset to White
        </button>

        {/* Color Picker Toggle */}
        <ToggleableColorPicker onColorSelect={setBackgroundColor} />
      </div>
    </div>
  );
};

export default BackgroundSelector;
