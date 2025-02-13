import React from "react";

interface TableCellProps {
  children: React.ReactNode;
  isHeader?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  align = "left",
  className = "font bold",
  onClick,
  style,
}) => {
  const Component = isHeader ? "th" : "td";
  return (
    <Component
      className={`py-2 px-4 whitespace-nowrap text-${align} ${className}${
        onClick ? " cursor-pointer" : ""
      }`}
      onClick={onClick}
      style={style}
    >
      {children}
    </Component>
  );
};

export default TableCell;
