import EliteProspectsLogo from "./common/EliteProspectsLogo";
import ClientButtons from './ClientButtons';

// This is a server component
const Header = ({ currentPath }: { currentPath: string }) => {
  return (
    <div className="flex items-center justify-between mb-4 pb-[48px]">
      {/* Left Side - Logo */}
      <div className="flex items-center">
        <EliteProspectsLogo />
      </div>

      {/* Right Side - Home & Logout Buttons */}
      <ClientButtons isHomePage={currentPath === "/home"} />
    </div>
  );
};

export default Header; 