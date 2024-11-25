'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PlayerWidget from './components/PlayerWidget';
import LogoutButton from './components/LogoutButton';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/login');
    }
  }, [router]);

  const playerId = '448944'; // Example player ID

  return (
    <div>
      <PlayerWidget playerId={playerId} />
      <LogoutButton />
    </div>
  );
};

export default Page;
