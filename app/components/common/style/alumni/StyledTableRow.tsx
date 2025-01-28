import React from "react";

interface StyledTableRowProps {
  children: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  isAlternate?: boolean; // For alternating row colors
}

export const StyledTableRow: React.FC<StyledTableRowProps> = ({
  children,
  backgroundColor = "white",
  textColor = "black",
  isAlternate,
}) => (
  <tr
    style={{
      backgroundColor: isAlternate ? "#f5f5f5" : backgroundColor, // Alternate rows
      color: textColor,
    }}
    className="hover:bg-gray-200 transition-colors"
  >
    {children}
  </tr>
);

export default StyledTableRow;
