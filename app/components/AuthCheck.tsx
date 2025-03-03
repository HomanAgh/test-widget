'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthCheckProps {
  children: ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(isLoggedIn);
    
    if (!isLoggedIn) {
      router.replace("/auth");
    }
  }, [router]);

  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthCheck; 