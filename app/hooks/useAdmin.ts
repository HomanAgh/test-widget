import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/client';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Create the client inside the effect to avoid SSR issues
    const supabase = createClient();
    checkAdminStatus(supabase);
    
    // Clean-up function
    return () => {
      // Any cleanup if needed
    };
  }, []);

  const checkAdminStatus = async (supabase: any) => {
    try {
      console.log('Checking admin status...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        console.log('No user session found');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      console.log('User ID:', session.user.id);
      
      // First, check if admin role is in the user's metadata
      const userMeta = session.user.app_metadata;
      const userRoleFromMeta = userMeta?.role;
      
      if (userRoleFromMeta === 'admin') {
        console.log('Admin role found in user metadata');
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      // If not in metadata, query the database
      console.log('Checking database for admin role...');
      const { data: user, error } = await supabase
        .from('users')
        .select('role, is_approved')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error.message);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      console.log('User data from database:', user);
      
      // Only set as admin if the user has admin role (make is_approved optional for now)
      const hasAdminRole = user?.role === 'admin';
      // Temporarily relax the approval requirement
      // const isApproved = user?.is_approved === true;
      
      setIsAdmin(hasAdminRole);
      
      console.log('Is admin:', hasAdminRole);
      
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  return { isAdmin, loading };
}; 