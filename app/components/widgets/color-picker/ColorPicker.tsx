"use client";

import { color } from "framer-motion";
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

const presetGradients = [

  { name: "Sunset", gradient: "linear-gradient(to right, #ee9ca7, #ffdde1)" },
  { name: "Ocean", gradient: "linear-gradient(to right, #243949, #517fa4)" },
  { name: "Forest", gradient: "linear-gradient(to right, #c1c161, #d4d4b1)" },
  { name: "Lavender", gradient: "linear-gradient(to right, #d299c2, #fef9d7)" },
  { name: "Fire", gradient: "linear-gradient(to right, #ff416c, #ff4b2b)" },
  { name: "Sky", gradient: "linear-gradient(to top, #accbee, #e7f0fd)" },
  { name: "Desert", gradient: "linear-gradient(to right, #e6b980, #eacda3)" },
  { name: "Cotton Candy", gradient: "linear-gradient(to right, #ffc3a0, #ffafbd)" },
  { name: "Northern Lights", gradient: "linear-gradient(298deg, #859398, #283048)" },
  { name: "Peach", gradient: "linear-gradient(to right, #f6d365, #fda085)" },
  { name: "Mint", gradient: "linear-gradient(to right, #84fab0, #8fd3f4)" },
  { name: "Royal", gradient: "linear-gradient(to right, #141e30, #243b55)" },

];

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect }) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("solid"); // test

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    onColorSelect(color); // Notify parent of the selected color
  };

  const handleGradientClick =(gradient: string) => { // test
    setSelectedColor(gradient);
    onColorSelect(gradient);
  }

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg w-[320px] animate-fade-in">
      <div className="grid grid-cols-2 gap-1 mb-4">
        <button
          onClick={() => setActiveTab("solid")}
          className={`py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "solid"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          Solid
        </button>
        <button
          onClick={() => setActiveTab("gradient")}
          className={`py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "gradient"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          Gradient
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "solid" && (
          <div className="grid grid-cols-7 gap-2">
            {solidColors.map((color) => (
              <div
                key={color}
                onClick={() => handleColorClick(color)}
                className={`w-8 h-8 rounded-full cursor-pointer border transition-all duration-200 hover:scale-110 ${
                  selectedColor === color && activeTab === "solid"
                    ? "border-2 border-orange-500 shadow-md"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

      {activeTab === "gradient" && (
        <div className="grid grid-cols-7 gap-2">
          {presetGradients.map((preset) => (
            <div
              key={preset.name}
              onClick={() => handleGradientClick(preset.gradient)}
              className={`w-8 h-8 rounded-full cursor-pointer border transition-all duration-200 hover:scale-110 ${
                selectedColor === preset.gradient && activeTab === "gradient"
                  ? "border-2 border-orange-500 shadow-md"
                  : "border-gray-300"
              }`}
              style={{ background: preset.gradient }}
            >
              {/* Optional: Tooltip or Label */}
              <span className="sr-only">{preset.name}</span>
            </div>
          ))}
        </div>
      )}

      </div>

      <button
        onClick={() => handleColorClick("transparent")}
        className="w-full mt-4 py-2 text-center text-gray-500 border rounded-md hover:bg-gray-100 transition-colors duration-200"
      >
        Clear
      </button>
    </div>
  );
};

export default ColorPicker;

