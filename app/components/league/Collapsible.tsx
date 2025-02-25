"use client";

import React, { useState, CSSProperties, ReactNode } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

/**
 * Styles matching your roster collapsible design
 * (the gray border, spacing, etc.)
 */
const collapsibleContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  alignSelf: "stretch",
};

interface CollapsibleProps {
  title: React.ReactNode; 
  children: ReactNode;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div style={collapsibleContainerStyle}>
      <div
        onClick={toggleOpen}
        className="cursor-pointer flex items-center gap-2 border-b border-gray-300 w-full pb-[12px] pt-[12px]"
      >
        <span className="font-bold uppercase">{title}</span>
        {isOpen ? (
          <FaChevronUp className="w-4 h-4" />
        ) : (
          <FaChevronDown className="w-4 h-4" />
        )}
      </div>
      {isOpen && (
        <div className="w-full">
          {children}
        </div>
      )}
    </div>
  );
};

export default Collapsible;
