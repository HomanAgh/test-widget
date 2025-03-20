"use client";

import React from "react";
import ResizeObserver from "./ResizeObserver";

interface ClientWrapperProps {
  children: React.ReactNode;
}

const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  return <ResizeObserver>{children}</ResizeObserver>;
};

export default ClientWrapper; 