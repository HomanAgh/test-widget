import React from "react";

interface SubHeaderCellProps {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  style?: React.CSSProperties;
  colSpan?: number;
  bgColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
}

const SubHeaderCell: React.FC<SubHeaderCellProps> = ({
  children,
  align = "left",
  className = "",
  style,
  colSpan,
  bgColor = "#f8f9fa",
  textColor = "#333333",
  icon,
}) => {
  return (
    <td
      className={`py-3 px-4 whitespace-nowrap text-${align} font-semibold ${className}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontSize: "14px",
        borderBottom: "1px solid #e0e0e0",
        ...style,
      }}
      colSpan={colSpan}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="text-base font-semibold">{children}</span>
      </div>
    </td>
  );
};

export default SubHeaderCell; 