import React from "react";

interface TableRowProps {
  children: React.ReactNode;
  bgColor?: string;
  className?: string;
}

const TableRow: React.FC<TableRowProps> = ({
  children,
  bgColor,
  className = "",
}) => {
  return (
    <tr
      className={`h-[56px] font-medium text-sm leading-[21px] ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {children}
    </tr>
  );
};

export default TableRow;
