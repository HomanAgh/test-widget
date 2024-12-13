'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutButton from "../../components/common/LogoutButton";

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
      <h1>{"Welcome Home"}</h1>
      <p>{"Select Option"}</p>

      {/* Dropdown List */}
      <div>
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="">{"Choose Option"}</option>
          <option value="/player">{"Player Last Games"}</option>
          <option value="/league">{"League Tables"}</option> {/* New Option */}
          <option value="/team">{"Team Roster"}</option>
          <option value="/alumni">{"Alumni"}</option>
        </select>
        <button onClick={handleNavigate} disabled={!selectedOption}>
          {"Go"}
        </button>
      </div>
      <LogoutButton />
    </div>
  );
};

export default HomePage;
