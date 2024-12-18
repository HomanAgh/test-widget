'use client';

import React, { useEffect, useState } from 'react';

interface TeamBackgroundColorSelectorProps {
  teamId: string; // Team ID to fetch data for
  onColorSelect: (color: string) => void; // Function to set the selected color
}

const TeamBackgroundColorSelector: React.FC<TeamBackgroundColorSelectorProps> = ({ teamId, onColorSelect }) => {
  const [colors, setColors] = useState<string[]>([]); // Fetched team colors
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch team data based on the teamId
  useEffect(() => {
    const fetchTeamColors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/team?teamId=${teamId}`);
        if (!response.ok) throw new Error('Failed to fetch team colors.');

        const data = await response.json();
        if (data.colors && data.colors.length > 0) {
          setColors(data.colors);
        } else {
          setError('No colors found for this team.');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeamColors();
  }, [teamId]);

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-2">Team Background Colors</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && colors.length > 0 && (
        <div className="flex space-x-2">
          {colors.map((color, index) => (
            <button
              key={index}
              style={{ backgroundColor: color }}
              className="w-10 h-10 rounded-full border border-gray-300 hover:scale-110 transition-transform"
              onClick={() => onColorSelect(color)} // Set background color on click
              title={`Set background color to ${color}`}
            />
          ))}
        </div>
      )}
      {!loading && colors.length === 0 && <p>No colors available for this team.</p>}
    </div>
  );
};

export default TeamBackgroundColorSelector;
