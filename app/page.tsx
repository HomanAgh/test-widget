"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"

const HomePage = () => {
  const router = useRouter();
  const isLoggedIn =
    typeof window !== "undefined" &&
    localStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/auth"); // Redirect to /auth if not logged in
    } else {
      router.replace("/home"); // Redirect to /player if logged in
    }
  }, [isLoggedIn, router]);

  return null; // Render nothing during the redirect
};

export default HomePage;

