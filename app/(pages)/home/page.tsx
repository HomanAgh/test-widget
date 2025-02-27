import React from "react";
import { PiGridNineBold, PiHockeyBold, PiUsersFourBold, PiGraduationCapBold } from "react-icons/pi"; 
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle, PoweredBy } from "@/app/components/common/style";
import AuthCheck from "@/app/components/AuthCheck";
import ClientNavigation from "@/app/components/ClientNavigation";

const HomePage = () => {
  const menuItems = [
    { label: "Players'\nLast Games", path: "/player", icon: <PiHockeyBold size={48} /> },
    { label: "League\nStandings", path: "/league", icon: <PiGridNineBold size={48} /> },
    { label: "Team\nRoster", path: "/team", icon: <PiUsersFourBold size={48} /> },
    { label: "Team\nAlumni", path: "/alumni", icon: <PiGraduationCapBold size={48} /> },
  ];

  return (
    <PageWrapper>
      <Header currentPath="/home" />
      <PageTitle title="Choose an option" />
      <AuthCheck>
        <ClientNavigation menuItems={menuItems} />
        <PoweredBy/>
      </AuthCheck>
    </PageWrapper>
  );
};

export default HomePage;
