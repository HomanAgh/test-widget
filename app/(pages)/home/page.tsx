'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import LogoutButton from "../../components/common/LogoutButton";
import LanguageButton from "../../components/common/LanguageButton";

const HomePage = () => {
  const { t } = useTranslation(); // Hook for translations
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
      <h1>{t("WelcomeHome")}</h1>
      <p>{t("SelectOption")}</p>

      {/* Dropdown List */}
      <div>
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="">{t("ChooseOption")}</option>
          <option value="/player">{t("PlayerLast5Games")}</option>
          <option value="/league">{t("LeagueTables")}</option> {/* New Option */}
        </select>
        <button onClick={handleNavigate} disabled={!selectedOption}>
          {t("Go")}
        </button>
      </div>
      <LanguageButton />
      <LogoutButton />
    </div>
  );
};

export default HomePage;
