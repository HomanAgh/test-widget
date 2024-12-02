import React, { useState, useEffect } from "react";

interface BackgroundSelectorProps {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  teamColor?: string; // Optional team color
  playerId: string; // To reset when the player changes
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  backgroundColor,
  setBackgroundColor,
  teamColor,
  playerId,
}) => {
  const [customHex, setCustomHex] = useState(backgroundColor);

  // Reset background to white when playerId changes
  useEffect(() => {
    setCustomHex("#FFFFFF");
    setBackgroundColor("#FFFFFF");
  }, [playerId, setBackgroundColor]);

  const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomHex(value);
    setBackgroundColor(value);
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

      {/* Reset to White Button */}
      <button
        onClick={() => {
          setCustomHex("#FFFFFF");
          setBackgroundColor("#FFFFFF");
        }}
        className="mt-4 ml-2 px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
      >
        Reset to White
      </button>

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
