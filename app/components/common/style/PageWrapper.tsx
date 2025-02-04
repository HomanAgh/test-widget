import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="max-w-4xl mx-auto relative w-[768px] pt-[48px] pb-[24px]">
      {children}
    </div>
  );
};

export default PageWrapper;
