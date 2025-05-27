"use client";

import React from "react";

type TabType = 'users' | 'organizations';

interface AdminTabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const AdminTabNavigation: React.FC<AdminTabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex h-[48px] px-[10px] py-[12px] justify-center items-center font-montserrat font-semibold pb-[32px] pt-[32px] mx-6">
      <button
        className={`flex items-center justify-center w-1/2 px-4 py-2 text-[14px] leading-[18px] ${
          activeTab === 'users'
            ? 'bg-white text-[#010A0E] border-b-2 border-green-600'
            : 'bg-white text-[#010A0E] border-b-2 border-[#E7E7E7]'
        }`}
        onClick={() => onTabChange('users')}
      >
        MANAGE USERS
      </button>
      <button
        className={`flex items-center justify-center w-1/2 px-4 py-2 text-[14px] leading-[18px] ${
          activeTab === 'organizations'
            ? 'bg-white text-[#010A0E] border-b-2 border-green-600'
            : 'bg-white text-[#010A0E] border-b-2 border-[#E7E7E7]'
        }`}
        onClick={() => onTabChange('organizations')}
      >
        MANAGE ORGANIZATIONS
      </button>
    </div>
  );
};

export default AdminTabNavigation; 