"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import EliteProspectsLogo from "@/app/components/common/EliteProspectsLogo";
import PageWrapper from "@/app/components/common/style/PageWrapper";
import { PoweredBy } from "@/app/components/common/style";
import { login } from "@/app/login/action";

// Separate component that uses useSearchParams
const LoginPageContent = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if this is an email verification redirect
    const code = searchParams?.get("code");

    if (code) {
      // Redirect to verify-email with the code
      router.push(`/verify-email?code=${code}`);
    }
  }, [searchParams, router]);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await login(formData);
      
      if (result?.error) {
        setError(result.error);
      } else if (result?.success && result?.redirectTo) {
        // Handle successful login with client-side navigation
        router.push(result.redirectTo);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="flex items-center mb-6">
        <EliteProspectsLogo />
      </div>

      <div className="bg-white p-6 rounded-lg w-[320px] md:w-[768px] pb-[56px]">
        <h1 className="text-[28px] font-bold font-montserrat text-left">
          Login
        </h1>

        <form className="space-y-4" action={handleSubmit}>
          <div className="flex flex-col pt-[24px] pb-[24px]">
            <label className="text-sm font-semibold pb-[8px]">Email*</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your Email"
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col pb-[56px]">
            <label className="text-sm font-semibold pb-[8px]">Password*</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="font-montserrat text-[12px] flex justify-center items-center w-[100px] min-w-[80px] h-[28px] px-[12px] py-[8px] bg-[#0B9D52] text-white font-bold rounded-md hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'SUBMIT'}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t">
          <p className="text-center">
            Don&apos;t have an account? 
            <Link href="/register" className="ml-2 text-[#0B9D52] font-semibold hover:underline">
              Create one!
            </Link>
          </p>
        </div>
      </div>
      <PoweredBy />
    </PageWrapper>
  );
};

// Main component with Suspense boundary
const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
};

export default LoginPage;
