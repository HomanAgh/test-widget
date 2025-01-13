import React from "react";

interface TableWrapperProps {
  backgroundColor: string;
  textColor: string;
  children: React.ReactNode;
}

const TableWrapper: React.FC<TableWrapperProps> = ({ backgroundColor, textColor, children }) => {
  return (
    <div
      className="min-w-full shadow-md rounded-lg overflow-hidden"
      style={{ backgroundColor, color: textColor, border: "1px solid #ccc" }}
    >
      {children}
    </div>
  );
};

export default TableWrapper;
