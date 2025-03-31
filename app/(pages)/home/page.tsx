import React from "react";
import { PiGridNineBold, PiHockeyBold, PiUsersFourBold, PiGraduationCapBold,PiTrophyBold,PiPlusBold   } from "react-icons/pi"; 
import { GiJasonMask } from "react-icons/gi";
import { LiaHockeyPuckSolid } from "react-icons/lia";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle, PoweredBy } from "@/app/components/common/style";
import ClientNavigation from "@/app/components/ClientNavigation";

const HomePage = () => {
  const menuItems = [
    { label: "Players'\nLast Games", path: "/player", icon: <PiHockeyBold size={48} /> },
    { label: "League\nStandings", path: "/league", icon: <PiGridNineBold size={48} /> },
    { label: "Team\nRoster", path: "/team", icon: <PiUsersFourBold size={48} /> },
    { label: "Team\nAlumni", path: "/alumni", icon: <PiGraduationCapBold size={48} /> },
    { label: "Tournament\nAlumni", path: "/tournamentsetup", icon: <PiTrophyBold size={48} /> },
    { label: "Scoring\nLeaders", path: "/scoring-leaders", icon: <LiaHockeyPuckSolid size={48} /> },
    { label: "Goalie\nLeaders", path: "/goalie-leaders", icon: <GiJasonMask size={48} /> },
    { label: "Suggest\nWidget", path: "/contact", icon: <PiPlusBold size={48} /> },

  ];

  return (
    <PageWrapper>
      <Header currentPath="/home" />
      <PageTitle title="Choose an option" />
        <ClientNavigation menuItems={menuItems} />
        <PoweredBy/>
    </PageWrapper>
  );
};

export default HomePage;
