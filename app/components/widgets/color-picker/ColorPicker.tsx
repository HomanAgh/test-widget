"use client";

import React, { useState } from "react";

const solidColors = [
  "#000000", "#343434", "#595959", "#808080", "#A6A6A6", "#D9D9D9", "#FFFFFF",
  "#E6B8B7", "#F4CCCC", "#FCE5CD", "#FFF2CC", "#D9EAD3", "#D0E0E3", "#CFE2F3", "#D9D2E9",
  "#EAD1DC", "#DD7E6B", "#EA9999", "#F9CB9C", "#FFE599", "#B6D7A8", "#A2C4C9", "#9FC5E8", "#B4A7D6",
  "#D5A6BD", "#CC4125", "#E06666", "#F6B26B", "#FFD966", "#93C47D", "#76A5AF", "#6FA8DC", "#8E7CC3",
  "#C27BA0", "#A61C00", "#CC0000", "#E69138", "#F1C232", "#6AA84F", "#45818E", "#3D85C6", "#674EA7",
  "#A64D79", "#85200C", "#990000", "#B45F06", "#BF9000", "#38761D", "#134F5C", "#0B5394", "#351C75",
  "#741B47", "#5B0F00", "#660000", "#783F04", "#7F6000", "#274E13", "#0C343D", "#073763", "#20124D",
  "#4C1130",
];

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect }) => {
  const [selectedColor, setSelectedColor] = useState<string>("");

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    onColorSelect(color); // Notify parent of the selected color
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md w-64">
      {/* Title */}
      <h2 className="text-lg font-semibold mb-4 text-center">Solid Colors</h2>

      {/* Color Options */}
      <div className="grid grid-cols-7 gap-2">
        {solidColors.map((color) => (
          <div
            key={color}
            onClick={() => handleColorClick(color)}
            className={`w-8 h-8 rounded-full cursor-pointer border ${
              selectedColor === color ? "border-orange-500" : "border-gray-300"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Transparent Option */}
      <button
        onClick={() => handleColorClick("transparent")}
        className="w-full mt-4 py-2 text-center text-gray-500 border rounded-md hover:bg-gray-100"
      >
        Transparent
      </button>
    </div>
  );
};

export default ColorPicker;
