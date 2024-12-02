'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const HomeButton: React.FC = () => {
  const { t } = useTranslation(); // Hook for translations
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/home'); // Redirect to /home
  };

  return <button onClick={handleRedirect}>{t('goToHome')}</button>; // Translation key for 'Home'
};

export default HomeButton;
