"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@/app/utils/supabase/client';

const HomePage = () => {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace("/auth");
      } else {
        router.replace("/home");
      }
    };

    checkAuth();
  }, [router]);

  return null; // Render nothing during the redirect
};

export default HomePage;

