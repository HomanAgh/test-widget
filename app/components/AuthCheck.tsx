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
    // Change this line: instead of checking for a boolean flag, check for token
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token; // Convert to boolean (true if token exists, false if not)
    
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