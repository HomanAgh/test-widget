'use client';

import React, { useState, useEffect } from 'react';
import WidgetSetup from "@/app/components/widget/PlayerWidgetSetup";

interface ClientPlayerPageProps {
  playerId: string;
}

const ClientPlayerPage: React.FC<ClientPlayerPageProps> = ({ playerId }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  useEffect(() => {
    if (playerId) {
      setSelectedPlayerId(playerId);
    }
  }, [playerId]);

  return (
    <>
      {selectedPlayerId && <WidgetSetup playerId={selectedPlayerId} />}
    </>
  );
};

export default ClientPlayerPage; 