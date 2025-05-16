'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/app/utils/client';
import { useRouter } from 'next/navigation';

const UserAvatar = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    // Create the client inside useEffect to avoid SSR issues
    const supabase = createClient();
    
    const fetchUserInfo = async () => {
      try {
        console.log('UserAvatar: Fetching user info');
        const { data: { user } } = await supabase.auth.getUser();
        console.log('UserAvatar: User data retrieved', user ? 'successfully' : 'empty');
        
        if (user && user.email) {
          setEmail(user.email);
          console.log('UserAvatar: Email set');
        } else {
          setEmail(null);
          console.log('UserAvatar: No email found');
        }
      } catch (error) {
        console.error('UserAvatar: Error fetching user info:', error);
        setEmail(null);
      } finally {
        setLoading(false);
        console.log('UserAvatar: Loading completed');
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    // Skip if not in browser environment
    if (typeof window === 'undefined') return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Create the client inside the handler to ensure fresh client
      const supabase = createClient();
      console.log('UserAvatar: Logging out');
      await supabase.auth.signOut();
      
      // Add a small delay before navigation to ensure the signOut completes
      setTimeout(() => {
        router.push("/auth");
        // Force a full refresh to clear any client-side state
        router.refresh();
      }, 100);
    } catch (error) {
      console.error("UserAvatar: Error during logout:", error);
    }
  };

  // Show a loading state briefly
  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">...</span>
      </div>
    );
  }

  // Fallback in case email isn't available yet
  if (!email) {
    // Make login button for anonymous users
    return (
      <button 
        className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-lg font-bold cursor-pointer shadow-sm hover:bg-gray-400 transition-colors"
        onClick={() => router.push('/auth')}
      >
        ?
      </button>
    );
  }

  const firstLetter = email.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-bold cursor-pointer shadow-sm hover:bg-green-700 transition-colors"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        {firstLetter}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10">
          <div className="py-2 border-b">
            <p className="px-4 text-xs text-gray-500">Signed in as</p>
            <p className="px-4 text-sm font-medium truncate">{email}</p>
          </div>
          <div className="py-1">
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar; 