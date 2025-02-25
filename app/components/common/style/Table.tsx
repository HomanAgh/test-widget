import React from "react";

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
        touchAction: "pan-x pan-y",
      }}
    >
      {children}
    </table>
  );
};

export default Table;
