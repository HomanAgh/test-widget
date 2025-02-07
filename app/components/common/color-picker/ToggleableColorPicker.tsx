'use client';

import React, { useState } from "react";
import ColorPicker from "./ColorPicker"; // Assuming you already have a functional ColorPicker component

interface ToggleableColorPickerProps {
  onColorSelect: (color: string) => void; // Add this prop to define the type of the function
}

const ToggleableColorPicker: React.FC<ToggleableColorPickerProps> = ({ onColorSelect }) => {
  const [isPickerVisible, setPickerVisible] = useState(false); // State for toggling visibility

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setPickerVisible(!isPickerVisible)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md  hover:bg-blue-600 transition"
      >
        {isPickerVisible ? "Hide Color Picker" : "Show Color Picker"}
      </button>

      {/* Conditional Rendering of the ColorPicker */}
      {isPickerVisible && (
        <div className="mt-4">
          <ColorPicker onColorSelect={onColorSelect} />
        </div>
      )}
    </div>
  );
};

export default ToggleableColorPicker;
