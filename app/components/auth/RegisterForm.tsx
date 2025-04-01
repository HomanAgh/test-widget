"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/auth";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await registerUser(email, password);
      
      if (!result.success) {
        setError(result.error || "Registration failed");
        return;
      }

      setSuccess("Registration successful! Redirecting to login...");
      setEmail("");
      setPassword("");
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/auth");
      }, 2000);
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-[24px] font-bold font-montserrat text-left mb-4">
        Register
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold pb-[8px]">Email*</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your Email"
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold pb-[8px]">Password*</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="font-montserrat text-[12px] flex justify-center items-center w-[100px] min-w-[80px] h-[28px] px-[12px] py-[8px] bg-[#0B9D52] text-white font-bold rounded-md hover:bg-green-700 transition-all disabled:opacity-50"
        >
          {loading ? "Loading..." : "REGISTER"}
        </button>
      </form>
    </div>
  );
} 