import React from "react";

interface CustomLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

const Link: React.FC<CustomLinkProps> = ({
  href,
  children,
  target = "_blank",
  rel = "noopener noreferrer",
  className,
  ...rest
}) => {
  return (
    <a
      href={href}
      // Provide default target & rel but allow overrides
      target={target}
      rel={rel}
      // Use the incoming className or fallback
      className={className ?? "text-[#0D73A6] hover:underline"}
      {...rest}
    >
      {children}
    </a>
  );
};

export default Link;
