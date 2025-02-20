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
      target={target}
      rel={rel}
      className={className ?? "hover:underline"}
      {...rest}
    >
      {children}
    </a>
  );
};

export default Link;
