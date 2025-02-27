'use client';

import React, { ReactNode } from 'react';

interface MenuItem {
  label: string;
  path: string;
  icon: ReactNode;
}

interface ClientNavigationProps {
  menuItems: MenuItem[];
}

const ClientNavigation: React.FC<ClientNavigationProps> = ({ menuItems }) => {
  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
      {menuItems.map((item) => (
        <button
          key={item.path}
          onClick={() => handleNavigation(item.path)}
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
  );
};

export default ClientNavigation; 