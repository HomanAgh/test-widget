import React from "react";

interface AdminPageWrapperProps {
  children: React.ReactNode;
}

const AdminPageWrapper: React.FC<AdminPageWrapperProps> = ({ children }) => {
  return (
    <div className="max-w-6xl mx-auto w-full relative w-[1024px] pt-[48px] pb-[24px]">
      {children}
    </div>
  );
};

export default AdminPageWrapper; 