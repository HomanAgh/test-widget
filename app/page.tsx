// app/page.tsx
import React from 'react';
import PlayerWidget from './components/PlayerWidget';

const Page = () => {
  const playerId = '23856'; // Example player ID
  return (
    <div>
      <h1>Player Stats</h1>
      <PlayerWidget playerId={playerId} />
    </div>
  );
};

export default Page;
