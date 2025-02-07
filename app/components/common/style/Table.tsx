import React from "react";

/**
 * Table is the <table> element. 
 * Props let you override background and text colors or add classes.
 */
interface TableProps {
  children: React.ReactNode;
  tableBgColor?: string;
  tableTextColor?: string;
  className?: string;
}

const Table: React.FC<TableProps> = ({
  children,
  tableBgColor = "#ffffff",
  tableTextColor = "#000000",
  className = "",
}) => {
  return (
    <table
      className={`w-full ${className}`}
      style={{
        backgroundColor: tableBgColor,
        color: tableTextColor,
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-x",
      }}
    >
      {children}
    </table>
  );
};

export default Table;
