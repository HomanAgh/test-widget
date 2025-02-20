import React from "react";

interface TableContainerProps {
  children: React.ReactNode;
  className?: string;
  noBorder?: boolean;
}

const TableContainer: React.FC<TableContainerProps> = ({
  children,
  className = "",
  noBorder = false, 
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
