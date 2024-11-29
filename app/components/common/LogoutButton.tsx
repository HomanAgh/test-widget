'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const LogoutButton: React.FC = () => {
  const { t } = useTranslation(); // Hook for translations
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  return <button onClick={handleLogout}>{t('Logout')}</button>;
};

export default LogoutButton;
