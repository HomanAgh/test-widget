import React from 'react';

interface TableHeaderProps {
  align: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({ align, children }) => {
  return (
    <th
      className={`py-2 px-4 text-${align} font-bold`}  
    >
      {children}
    </th>
  );
};

export default TableHeader;
