'use client';

import HomeButton from "./common/HomeButton";
import LogoutButton from "./common/LogoutButton";

interface ClientButtonsProps {
  isHomePage: boolean;
}

const ClientButtons = ({ isHomePage }: ClientButtonsProps) => {
  return (
    <div className="flex items-center gap-[56px]">
      <HomeButton isDisabled={isHomePage} />
      <LogoutButton />
    </div>
  );
};

export default ClientButtons; 