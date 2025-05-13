import React from "react";
import { PiGridNineBold, PiHockeyBold, PiUsersFourBold, PiGraduationCapBold, PiTrophyBold, PiPlusBold } from "react-icons/pi"; 
import { GiJasonMask } from "react-icons/gi";
import { LiaHockeyPuckSolid } from "react-icons/lia";
import { TbTournament } from "react-icons/tb";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle, PoweredBy } from "@/app/components/common/style";
import ClientNavigation from "@/app/components/ClientNavigation";
import Link from "next/link";

const HomePage = () => {
  const menuItems = [
    { label: "Players'\nLast Games", path: "/player", icon: <PiHockeyBold size={48} /> },
    { label: "League\nStandings", path: "/league", icon: <PiGridNineBold size={48} /> },
    { label: "Team\nRoster", path: "/team", icon: <PiUsersFourBold size={48} /> },
    { label: "Team\nAlumni", path: "/alumni", icon: <PiGraduationCapBold size={48} /> },
    { label: "Tournament\nAlumni", path: "/alumni/tournament", icon: <PiTrophyBold size={48} /> },
    { label: "Scoring\nLeaders", path: "/scoring-leaders", icon: <LiaHockeyPuckSolid size={48} /> },
    { label: "Goalie\nLeaders", path: "/goalie-leaders", icon: <GiJasonMask size={48} /> },
    { label: "League\nPlayoff", path: "/leaguePlayoff", icon: <TbTournament size={48} /> },
  ];

  return (
    <PageWrapper>
      <Header currentPath="/home" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PageTitle title="Choose an option" />
        <Link 
          href="/contact" 
          className="flex items-center border border-green-600 bg-gray-100 rounded-lg hover:bg-green-600 transition-all group px-3 py-2"
        >
          <PiPlusBold size={24} className="text-black mr-2 transition-all group-hover:text-white" />
          <span className="transition-all group-hover:text-white">Suggest Widget</span>
        </Link>
      </div>
      <ClientNavigation menuItems={menuItems} />
      <PoweredBy/>
    </PageWrapper>
  );
};

export default HomePage;
