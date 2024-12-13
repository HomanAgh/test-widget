"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

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
      router.push("/home"); // Redirect to HomePage after login
    } catch (err) {
      const errorMessage = (err as Error).message || "Unknown Error";
      console.error("[DEBUG] Login error:", errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div>
      <h1>{"Login"}</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>{"Username"}</label>
          <input
            type="text"
            value={username}
            placeholder={"Username"}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>{"Password"}</label>
          <input
            type="password"
            value={password}
            placeholder={"Password"}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">{"Submit"}</button>
      </form>
    </div>
  );
};

export default LoginPage;