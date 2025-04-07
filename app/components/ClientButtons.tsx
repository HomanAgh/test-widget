"use client";

import { usePathname } from "next/navigation";
import HomeButton from "./common/HomeButton";
import LogoutButton from "./common/LogoutButton";
import EmbedButton from "./common/EmbedButton";
import AdminButton from "./common/AdminButton";
import UserInfo from "./common/UserInfo";

interface ClientButtonsProps {
  isHomePage: boolean;
}

const ClientButtons = ({ isHomePage }: ClientButtonsProps) => {
  const pathname = usePathname();
  const isEmbedPage = pathname === "/embed";
  const isAdminPage = pathname === "/admin";

  return (
    <div className="flex items-center">
      <div className="mr-6">
        <UserInfo />
      </div>
      <div className="flex items-center gap-[16px]">
        <HomeButton isDisabled={isHomePage} />
        <AdminButton isDisabled={isAdminPage} />
        <EmbedButton isDisabled={isEmbedPage} />
        <LogoutButton />
      </div>
    </div>
  );
};

export default ClientButtons;
