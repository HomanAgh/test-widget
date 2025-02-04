"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PiGridNineBold, PiHockeyBold, PiUsersFourBold, PiGraduationCapBold } from "react-icons/pi"; // Importing icons
import Header from "@/app/components/Header";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.replace("/auth"); // Redirect to login if not logged in
    }
  }, [router]);

  const menuItems = [
    { label: "Players'\nLast Games", path: "/player", icon: <PiHockeyBold size={48} /> },
    { label: "League\nStandings", path: "/league", icon: <PiGridNineBold size={48} /> },
    { label: "Team\nRoster", path: "/team", icon: <PiUsersFourBold size={48} /> },
    { label: "Team\nAlumni", path: "/alumni", icon: <PiGraduationCapBold size={48} /> },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 relative pt-[56px] pb-[24px]">
      <Header />

      {/* Page Title */}
      <h1 className="text-[28px] font-montserrat font-bold text-left mb-6 pb-[24px]">Choose an option</h1>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> {/* 16px gap across all screen sizes */}
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className="w-[180px] flex flex-col items-center justify-center p-[24px] border border-green-600 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-all"
          >
            <div className="text-green-600 mb-2">{item.icon}</div>
            <span className="text-sm font-semibold text-center whitespace-pre-line">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
