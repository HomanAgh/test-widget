'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { FaUser } from 'react-icons/fa';

const UserInfo = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          setEmail(user.email);
        } else {
          setEmail(null);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        setEmail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center px-3 py-1 text-gray-400 border border-gray-200 rounded-md">
        <FaUser className="mr-2" size={14} />
        <span className="text-xs font-semibold">Loading...</span>
      </div>
    );
  }

  if (!email) {
    return null;
  }

  return (
    <div className="flex items-center px-3 py-1 text-[#0B9D52] border border-[#0B9D52] bg-white rounded-md">
      <FaUser className="mr-2" size={14} />
      <span className="text-xs font-semibold truncate max-w-[150px]">{email}</span>
    </div>
  );
};

export default UserInfo; 