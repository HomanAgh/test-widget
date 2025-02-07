"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PiGridNineBold, PiHockeyBold, PiUsersFourBold, PiGraduationCapBold } from "react-icons/pi"; // Importing icons
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";

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
    <PageWrapper>
      <Header />
      <PageTitle title="Choose an option" />
  
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className="flex flex-col items-center justify-center pb-[24px] pt-[24px] pl-[16px] pr-[16px] 
                       border border-green-600 bg-white rounded-lg 
                       hover:bg-green-600 transition-all group"
          >
            <div className="text-black pb-[16px] transition-all group-hover:text-white">
              {item.icon}
            </div>
  
            <span className="text-sm font-semibold text-center whitespace-pre-line transition-all group-hover:text-white">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </PageWrapper>
  );
  
};

export default HomePage;
