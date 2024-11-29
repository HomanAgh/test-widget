"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LanguageButton from "@/app/components/common/LanguageButton";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { t } = useTranslation(); // Hook for translations
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
        throw new Error(data.error || t("LoginFailed"));
      }

      localStorage.setItem("isLoggedIn", "true");
      console.log("[DEBUG] Redirecting to /home");
      router.push("/home"); // Redirect to HomePage after login
    } catch (err) {
      const errorMessage = (err as Error).message || t("UnknownError");
      console.error("[DEBUG] Login error:", errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div>
      <h1>{t("Login")}</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>{t("Username")}</label>
          <input
            type="text"
            value={username}
            placeholder={t("UsernamePlaceholder")}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>{t("Password")}</label>
          <input
            type="password"
            value={password}
            placeholder={t("PasswordPlaceholder")}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">{t("Submit")}</button>
      </form>
      <LanguageButton />
    </div>
  );
};

export default LoginPage;