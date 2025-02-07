import React from "react";

interface TableContainerProps {
  children: React.ReactNode;
  className?: string;
  noBorder?: boolean; // New prop to remove border
}

const TableContainer: React.FC<TableContainerProps> = ({
  children,
  className = "",
  noBorder = false, // Default is false (border applied)
}) => {
  return (
    <div
      className={`overflow-x-auto overflow-hidden bg-white rounded-lg w-full ${className} ${
        noBorder ? "" : "border border-customGrayMedium"
      }`}
    >
      {children}
    </div>
  );
};

export default TableContainer;
