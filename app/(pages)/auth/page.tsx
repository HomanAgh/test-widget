"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import EliteProspectsLogo from "@/app/components/common/EliteProspectsLogo";
import PageWrapper from "@/app/components/common/style/PageWrapper";
import { gql, useMutation } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [login, { loading }] = useMutation(LOGIN_MUTATION);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      // Use GraphQL mutation instead of fetch
      const { data } = await login({ 
        variables: { email, password } 
      });
      
      // Store the JWT token instead of a boolean
      localStorage.setItem("token", data.login.token);
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

      <div className="bg-white p-6 rounded-lg w-[320px] md:w-[768px] pb-[56px]">
        <h1 className="text-[28px] font-bold font-montserrat text-left">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col pt-[24px] pb-[24px]">
            <label className="text-sm font-semibold pb-[8px]">Email*</label>
            <input
              type="email"
              value={email}
              placeholder="Enter your Email"
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="font-montserrat text-[12px] flex justify-center items-center w-[100px] min-w-[80px] h-[28px] px-[12px] py-[8px] bg-[#0B9D52] text-white font-bold rounded-md hover:bg-green-700 transition-all"
            disabled={loading}
          >
            {loading ? "LOADING..." : "SUBMIT"}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
};

export default LoginPage;
