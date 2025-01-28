import React from "react";

interface StyledTableHeaderProps {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  onClick?: () => void;
}

const StyledTableHeader: React.FC<StyledTableHeaderProps> = ({
  children,
  align = "left",
  onClick,
}) => (
  <th
    onClick={onClick}
    style={{
      textAlign: align,
      backgroundColor: "#0d355e", // Match dark blue
      color: "white", // White text
      padding: "10px", // Consistent padding
      cursor: onClick ? "pointer" : "default",
    }}
    className="hover:bg-blue-800 transition-colors"
  >
    {children}
  </th>
);

export default StyledTableHeader;
