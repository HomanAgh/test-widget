'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/app/components/team/TeamSearch';
import ErrorMessage from '@/app/components/common/ErrorMessage';
import LogoutButton from '@/app/components/common/LogoutButton';
import HomeButton from '@/app/components/common/HomeButton';
import Team from '@/app/components/team/Team'; // Import the new Team component
import ToggleableColorPicker from '@/app/components/common/color-picker/ToggleableColorPicker'; // Import the new ToggleableColorPicker

const TeamPage: React.FC = () => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backgroundStyle, setBackgroundStyle] = useState<{ backgroundColor?: string; backgroundImage?: string }>({
    backgroundColor: '#f9fafb', // Default background color
  });
  const router = useRouter();

  // Redirect to login if not logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.replace('/auth');
    }
  }, [router]);

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
    setError(null); // Clear previous errors when selecting a new team
  };

  const handleColorChange = (color: string) => {
    if (color.startsWith("linear-gradient")) {
      // Apply gradient as backgroundImage
      setBackgroundStyle({ backgroundImage: color });
    } else {
      // Apply solid color as backgroundColor
      setBackgroundStyle({ backgroundColor: color });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      {/* Top Buttons */}
      <div className="flex justify-between items-center mb-4">
        {/* Home Button */}
        <HomeButton />
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4 text-center">{'Team Search'}</h1>

      {/* Search Bar for Team Selection */}
      <SearchBar
        onSelect={handleTeamSelect}
        onError={(error) => setError(error)}
      />
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}

      {/* Toggleable Color Picker */}
      <div className="my-4">
        <h2 className="text-lg font-semibold text-center">{'Choose BackgroundColor'}</h2>
        <div className="flex justify-center">
          <ToggleableColorPicker onColorSelect={handleColorChange} />
        </div>
      </div>

      {/* Team Information */}
      {selectedTeamId ? (
        <div
          className="mt-6 p-6 rounded-md shadow-md"
          style={{
            ...backgroundStyle, // Apply the dynamic background style
          }}
        >
          <Team teamId={selectedTeamId} backgroundColor={''} />
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-6">{'No Team Selected'}</p>
      )}

      {/* Logout Button */}
      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
};

export default TeamPage;
