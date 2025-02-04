"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import EliteProspectsLogo from "@/app/components/common/EliteProspectsLogo";
import PageWrapper from "@/app/components/common/style/PageWrapper";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login Failed");
      }

      localStorage.setItem("isLoggedIn", "true");
      console.log("[DEBUG] Redirecting to /home");
      router.push("/home");
    } catch (err) {
      const errorMessage = (err as Error).message || "Unknown Error";
      console.error("[DEBUG] Login error:", errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <PageWrapper>
      <div className="flex items-center mb-6">
        <EliteProspectsLogo />
      </div>
  
      {/* Login Form */}
      <div className="bg-white p-6 rounded-lg w-[320px] md:w-[768px] pb-[56px]">
        <h1 className="text-[28px] font-bold font-montserrat text-left">Login</h1>
  
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Field */}
          <div className="flex flex-col pt-[24px] pb-[24px]">
            <label className="text-sm font-semibold pb-[8px]">Username*</label>
            <input
              type="text"
              value={username}
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Password Field */}
          <div className="flex flex-col pb-[56px]">
            <label className="text-sm font-semibold pb-[8px]">Password*</label>
            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
  
          {/* Submit Button */}
          <button
            type="submit"
            className="font-montserrat text-[12px] flex justify-center items-center w-[100px] min-w-[80px] h-[28px] px-[12px] py-[8px] bg-[#0B9D52] text-white font-bold rounded-md hover:bg-green-700 transition-all"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
  
export default LoginPage;
  
