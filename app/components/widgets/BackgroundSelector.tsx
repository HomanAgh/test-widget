import React, { useState } from "react";

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
  const [customHex, setCustomHex] = useState(backgroundColor);

  const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomHex(value);
    setBackgroundColor(value); // Update background color to custom HEX
  };

  return (
    <div className="mb-6 text-center">
      {/* Team Color Button */}
      {teamColor && (
        <button
          onClick={() => setBackgroundColor(teamColor)}
          className={`mt-4 px-4 py-2 rounded-md ${
            backgroundColor === teamColor ? "bg-blue-700 text-white" : "bg-blue-500 text-white"
          } hover:bg-blue-600`}
        >
          Use Team Color
        </button>
      )}

      {/* Custom HEX Color Input */}
      <div className="mt-4">
        <label
          htmlFor="custom-hex"
          className="block text-sm font-medium text-gray-800"
        >
          Enter Custom HEX Color:
        </label>
        <input
          id="custom-hex"
          type="text"
          value={customHex}
          onChange={handleCustomHexChange}
          placeholder="#123456"
          className="mt-2 p-2 border rounded-md w-full"
        />
      </div>
    </div>
  );
};

export default BackgroundSelector;
