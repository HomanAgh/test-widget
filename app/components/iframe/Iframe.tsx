"use client";
import React from "react";
import "./Iframe.css"; // optional if you want to use an external stylesheet

interface IframeProps {
  src: string;
  className?: string;
}

const Iframe: React.FC<IframeProps> = ({ src, className }) => {
  return (
    <iframe
      src={src}
      className={`alumni-iframe ${className || ""}`}
    />
  );
};

export default Iframe;
