/* "use client";

import React from "react";
import PlayerPage from "./player";
import LoginPage from "./auth/page";

const App = () => {
  const isLoggedIn =
    typeof window !== "undefined" &&
    localStorage.getItem("isLoggedIn") === "true";

  return isLoggedIn ? <PlayerPage /> : <LoginPage />;
};

export default App; */

/* "use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
  const router = useRouter();
  const isLoggedIn =
    typeof window !== "undefined" &&
    localStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth"); // Redirect to the login page
    }
  }, [isLoggedIn, router]);

  return (
    <div>
    </div>
  );
};

export default HomePage;
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const isLoggedIn =
    typeof window !== "undefined" &&
    localStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/auth"); // Redirect to /auth if not logged in
    } else {
      router.replace("/player"); // Redirect to /player if logged in
    }
  }, [isLoggedIn, router]);

  return null; // Render nothing during the redirect
};

export default HomePage;

