'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import SearchBar from '@/app/components/team/TeamSearch';
import ErrorMessage from '@/app/components/common/ErrorMessage';
import LanguageButton from '@/app/components/common/LanguageButton';
import LogoutButton from '@/app/components/common/LogoutButton';
import HomeButton from '@/app/components/common/HomeButton';
import Team from '@/app/components/team/Team'; // Import the new Team component
import ColorPicker from '@/app/components/widgets/color-picker/ColorPicker';

const TeamPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('#f9fafb'); // Default background color
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
    setBackgroundColor(color);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      {/* Top Buttons */}
      <div className="flex justify-between items-center mb-4">
        {/* Home Button */}
        <HomeButton />

        {/* Language Button */}
        <LanguageButton />
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4 text-center">{t('TeamSearchTitle')}</h1>

      {/* Search Bar for Team Selection */}
      <SearchBar
        onSelect={handleTeamSelect}
        onError={(error) => setError(error)}
      />
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}

      {/* Color Picker */}
      <div className="my-4">
        <h2 className="text-lg font-semibold text-center">{t('ChooseBackgroundColor')}</h2>
        <ColorPicker onColorSelect={handleColorChange} />
      </div>

      {/* Team Information */}
      {selectedTeamId ? (
        <Team teamId={selectedTeamId} backgroundColor={backgroundColor} />
      ) : (
        <p className="text-center text-gray-600 mt-6">{t('NoTeamSelected')}</p>
      )}

      {/* Logout Button */}
      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
};

export default TeamPage;