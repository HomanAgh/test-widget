"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@/app/utils/client';
import AdminDashboard from "@/app/components/admin/AdminDashboard";
import Header from "@/app/components/Header";
import { AdminPageWrapper, PageTitle, PoweredBy } from "@/app/components/common/style";

const AdminPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace("/auth");
        return;
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      if (userData?.role !== 'admin') {
        router.replace("/home");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      router.replace("/home");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminPageWrapper>
        <Header currentPath="/admin" />
        <div className="flex justify-center items-center h-[300px]">Loading...</div>
      </AdminPageWrapper>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminPageWrapper>
      <Header currentPath="/admin" />
      <PageTitle title="Admin Dashboard" />
      <AdminDashboard />
      <PoweredBy />
    </AdminPageWrapper>
  );
};

export default AdminPage; 