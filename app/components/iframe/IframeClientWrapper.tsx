"use client";

import React from "react";
import ResizeObserver from "../iframe/ResizeObserver";

interface ClientWrapperProps {
  children: React.ReactNode;
}

const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  return <ResizeObserver>{children}</ResizeObserver>;
};

export default ClientWrapper; 