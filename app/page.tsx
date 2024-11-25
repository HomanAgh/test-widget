'use client';

import React from 'react';
import PlayerPage from './pages/player';
import LoginPage from './pages/auth';

const App = () => {
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';

  return isLoggedIn ? <PlayerPage /> : <LoginPage />;
};

export default App;
