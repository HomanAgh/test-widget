import React from "react";

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <h1 className="text-[28px] font-bold font-montserrat text-left pb-[24px]">
      {title}
    </h1>
  );
};

export default PageTitle;
