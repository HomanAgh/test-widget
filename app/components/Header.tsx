import EliteProspectsLogo from "./common/EliteProspectsLogo";
import UserAvatar from "./common/UserAvatar";
import HomeButton from "./common/HomeButton";
import AdminButton from "./common/AdminButton";
import EmbedButton from "./common/EmbedButton";

// This is a server component
const Header = ({ currentPath }: { currentPath: string }) => {
  return (
    <div className="flex items-center justify-between mb-4 pb-[48px]">
      {/* Left Side - Logo */}
      <div className="flex items-center">
        <EliteProspectsLogo />
      </div>

      {/* Right Side - Navigation buttons and User Avatar */}
      <div className="flex items-center gap-[16px]">
        <HomeButton isDisabled={currentPath === "/home"} />
        <AdminButton isDisabled={currentPath === "/admin"} />
        <EmbedButton isDisabled={currentPath === "/embed"} />
        <UserAvatar />
      </div>
    </div>
  );
};

export default Header; 