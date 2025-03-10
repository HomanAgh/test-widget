import React from "react";

interface TableContainerProps {
  children: React.ReactNode;
  className?: string;
  noBorder?: boolean;
  backgroundColor?: string;
}

const TableContainer: React.FC<TableContainerProps> = ({
  children,
  className = "",
  noBorder = false,
  backgroundColor = "#FFFFFF",
}) => {
  return (
    <div
      className={`overflow-x-auto overflow-hidden rounded-lg w-full ${className} ${
        noBorder ? "" : "border border-customGrayMedium"
      }`}
      style={{ backgroundColor }}
    >
      {children}
    </div>
  );
};

export default TableContainer;
