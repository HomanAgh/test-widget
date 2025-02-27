'use client';

import React, { useState, useEffect } from 'react';
import WidgetSetup from "@/app/components/widget/TeamWidgetSetup";

interface ClientTeamPageProps {
  teamId: string;
}

const ClientTeamPage: React.FC<ClientTeamPageProps> = ({ teamId }) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  useEffect(() => {
    if (teamId) {
      setSelectedTeamId(teamId);
    }
  }, [teamId]);

  return (
    <>
      {selectedTeamId && (
        <WidgetSetup teamId={selectedTeamId} />
      )}
    </>
  );
};

export default ClientTeamPage; 