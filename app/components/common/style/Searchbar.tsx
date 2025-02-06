import React from "react";
import { RxMagnifyingGlass } from "react-icons/rx";

interface SearchBarStylesProps {
  children: React.ReactNode;
}

export const SearchBarContainer: React.FC<SearchBarStylesProps> = ({ children }) => (
  <div className="relative w-full pb-[48px]">{children}</div>
);

export const SearchInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <RxMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-[20px] h-[20px]" />
      
      {/* Search Input */}
      <input
        {...props}
        className={`border p-2 pl-10 rounded-md w-full ${props.className || ""}`}
      />
    </div>
  );
};

export const Dropdown: React.FC<SearchBarStylesProps> = ({ children }) => (
  <ul className="absolute left-0 right-0 bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10">
    {children}
  </ul>
);

export const DropdownItem: React.FC<
  { isHighlighted?: boolean } & React.HTMLAttributes<HTMLLIElement>
> = ({ isHighlighted, children, ...props }) => (
  <li
    {...props}
    className={`p-2 cursor-pointer hover:bg-gray-100 ${isHighlighted ? "bg-gray-200" : ""}`}
  >
    {children}
  </li>
);

export const LoadingItem: React.FC = () => (
  <li className="p-2 text-gray-500">Loading...</li>
);
