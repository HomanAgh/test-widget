'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const HomeButton: React.FC = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/home'); 
  };

  return <button onClick={handleRedirect}>{'Homepage'}</button>; 
};

export default HomeButton;
