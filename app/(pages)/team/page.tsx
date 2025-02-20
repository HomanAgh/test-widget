'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/app/components/team/TeamSearch';
import ErrorMessage from '@/app/components/common/ErrorMessage';
import WidgetSetup from '@/app/components/widget/TeamWidgetSetup'; 
import Header from '@/app/components/Header';
import { PageWrapper, PageTitle } from "@/app/components/common/style";

const TeamPage: React.FC = () => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.replace('/auth');
    }
  }, [router]);

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
    setError(null); 
  };

  return (
    <PageWrapper>
      <Header />
      <PageTitle title="Search team" />
      <SearchBar
        onSelect={handleTeamSelect}
        onError={(error) => setError(error)}
      />
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}
   
      {selectedTeamId && <WidgetSetup teamId={selectedTeamId} />}
    </PageWrapper>
  );
};

export default TeamPage;
