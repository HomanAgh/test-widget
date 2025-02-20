import React from "react";

interface TableHeadProps {
  children: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

const TableHead: React.FC<TableHeadProps> = ({
  children,
  bgColor = "#052D41",
  textColor = "#ffffff",
  className = "",
}) => {
  return (
    <thead
      className={`font-montserrat ${className}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {children}
    </thead>
  );
};

export default TableHead;
