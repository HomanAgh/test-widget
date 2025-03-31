"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EliteProspectsLogo from "@/app/components/common/EliteProspectsLogo";
import PageWrapper from "@/app/components/common/style/PageWrapper";
import { login } from "@/app/login/action"; // Import the server action

const LoginPage = () => {
  const [error, setError] = useState("");
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

  return (
    <PageWrapper>
      <div className="flex items-center mb-6">
        <EliteProspectsLogo />
      </div>

      <div className="bg-white p-6 rounded-lg w-[320px] md:w-[768px] pb-[56px]">
        <h1 className="text-[28px] font-bold font-montserrat text-left">
          Login
        </h1>

        <form className="space-y-4">
          <div className="flex flex-col pt-[24px] pb-[24px]">
            <label className="text-sm font-semibold pb-[8px]">Email*</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your Email"
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col pb-[56px]">
            <label className="text-sm font-semibold pb-[8px]">Password*</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            //@ts-ignore
            formAction={login}
            className="font-montserrat text-[12px] flex justify-center items-center w-[100px] min-w-[80px] h-[28px] px-[12px] py-[8px] bg-[#0B9D52] text-white font-bold rounded-md hover:bg-green-700 transition-all"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </PageWrapper>
  );
};

export default LoginPage;
