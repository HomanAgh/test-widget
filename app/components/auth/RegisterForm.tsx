"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/components/auth/actionRegister";
import { createClient } from "@/app/utils/client";

interface Organization {
  id: number;
  name: string;
}

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const router = useRouter();
  
  // Fetch organizations on component mount
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoadingOrgs(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from("organizations")
          .select("id, name")
          .order("name");
          
        if (error) throw error;
        
        setOrganizations(data || []);
      } catch (err) {
        console.error("Error fetching organizations:", err);
        setError("Could not load organizations. Please try again later.");
      } finally {
        setLoadingOrgs(false);
      }
    };
    
    fetchOrganizations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await registerUser(email, password, organizationId);
      
      if (!result.success) {
        setError(result.error || "Registration failed");
        return;
      }

      setSuccess("Registration successful! Redirecting to login...");
      setEmail("");
      setPassword("");
      setOrganizationId(null);
      
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
        
        <div className="flex flex-col">
          <label className="text-sm font-semibold pb-[8px]">Organization</label>
          <select
            value={organizationId || ""}
            onChange={(e) => setOrganizationId(e.target.value ? parseInt(e.target.value) : null)}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || loadingOrgs}
          >
            <option value="">Select an organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          {loadingOrgs && (
            <p className="text-sm text-gray-500 mt-1">Loading organizations...</p>
          )}
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