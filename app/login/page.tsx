"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check if this is a verification redirect
    const code = searchParams?.get("code");

    if (code) {
      // Redirect directly to verify-email page with the code
      router.push(`/verify-email?code=${code}`);
    } else {
      // For normal login attempts, redirect to auth page
      router.push("/auth");
    }
  }, [searchParams, router]);

  // Show loading state while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Redirecting...</p>
      </div>
    </div>
  );
}
