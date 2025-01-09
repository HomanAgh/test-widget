'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/app/components/team/TeamSearch';
import ErrorMessage from '@/app/components/common/ErrorMessage';
import LogoutButton from '@/app/components/common/LogoutButton';
import HomeButton from '@/app/components/common/HomeButton';
import WidgetSetup from '@/app/components/widget/TeamWidgetSetup'; // Import the new ToggleableColorPicker

const TeamPage: React.FC = () => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
   
      {selectedTeamId && <WidgetSetup teamId={selectedTeamId} />}

      {/* Logout Button */}
      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
};

export default TeamPage;
