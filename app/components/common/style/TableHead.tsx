import React from "react";

/**
 * TableHead for the <thead> section.
 * Allows custom background color, text color, and extra classes.
 */
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
