import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase/client';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        setIsAdmin(false);
        return;
      }

      // Query by user ID instead of email for more reliable results
      const { data: user, error } = await supabase
        .from('users')
        .select('role, is_approved')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error.message);
        setIsAdmin(false);
        return;
      }

      // Only set as admin if the user is both an admin and approved
      setIsAdmin(user?.role === 'admin' && user?.is_approved === true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  return { isAdmin, loading };
}; 