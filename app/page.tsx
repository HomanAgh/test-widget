// app/page.tsx
import React from 'react';
import PlayerWidget from './components/PlayerWidget';

const Page = () => {
  const playerId = '448944'; // Example player ID
  return (
    <div>
      <PlayerWidget playerId={playerId} />
    </div>
  );
};

export default Page;
