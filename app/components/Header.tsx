import { usePathname } from "next/navigation";
import HomeButton from "./common/HomeButton";
import LogoutButton from "./common/LogoutButton";
import EliteProspectsLogo from "./common/EliteProspectsLogo";

const Header: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between mb-4 pb-[48px]">
      {/* Left Side - Logo */}
      <div className="flex items-center">
        <EliteProspectsLogo />
      </div>

      {/* Right Side - Home & Logout Buttons */}
      <div className="flex items-center gap-[56px]">
        <HomeButton isDisabled={pathname === "/home"} />
        <LogoutButton />
      </div>
    </div>
  );
};

export default Header;
