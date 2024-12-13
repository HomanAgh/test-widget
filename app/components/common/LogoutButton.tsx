'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  return <button onClick={handleLogout}>{'Logout'}</button>;
};

export default LogoutButton;
