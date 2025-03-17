"use client";

import { usePathname } from "next/navigation";
import HomeButton from "./common/HomeButton";
import LogoutButton from "./common/LogoutButton";
import EmbedButton from "./common/EmbedButton";

interface ClientButtonsProps {
  isHomePage: boolean;
}

const ClientButtons = ({ isHomePage }: ClientButtonsProps) => {
  const pathname = usePathname();
  const isEmbedPage = pathname === "/embed";

  return (
    <div className="flex items-center gap-[56px]">
      <HomeButton isDisabled={isHomePage} />
      <EmbedButton isDisabled={isEmbedPage} />
      <LogoutButton />
    </div>
  );
};

export default ClientButtons;
