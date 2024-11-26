/* "use client";

import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  const handleNavigateToPlayer = () => {
    router.push("/player");
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>Select an option below:</p>
      <button onClick={handleNavigateToPlayer}>Go to Player Search</button>
    </div>
  );
};

export default HomePage; */
/* "use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LogoutButton from "../components/common/LogoutButton";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.replace("/auth"); // Redirect to /auth if not logged in
    }
  }, [router]);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>Select an option below:</p>
      <button onClick={() => router.push("/player")}>Go to Player Search</button><br />
      <LogoutButton />
    </div>
  );
};

export default HomePage;
 */

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutButton from "../components/common/LogoutButton";

const HomePage = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.replace("/auth"); // Redirect to /auth if not logged in
    }
  }, [router]);

  const handleNavigate = () => {
    if (!selectedOption) return; // Do nothing if no option is selected
    router.push(selectedOption); // Redirect to the selected page
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>Select an option below:</p>

      {/* Dropdown List */}
      <div>
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="">-- Choose an Option --</option>
          <option value="/player">Player Search</option>
          {/* Add future options here */}
          {/* <option value="/team">Team Search</option> */}
          {/* <option value="/stats">Player Statistics</option> */}
        </select>
        <button onClick={handleNavigate} disabled={!selectedOption}>
          Go
        </button>
      </div>
      <LogoutButton />
    </div>
  );
};

export default HomePage;
