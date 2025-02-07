import React from "react";

/**
 * TableContainer wraps the <table> in a scrollable container
 * and adds border, rounded corners, etc.
 */
interface TableContainerProps {
  children: React.ReactNode;
  className?: string;
}

const TableContainer: React.FC<TableContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`overflow-x-auto overflow-hidden border border-customGrayMedium bg-white rounded-lg w-full ${className}`}
    >
      {children}
    </div>
  );
};

export default TableContainer;
