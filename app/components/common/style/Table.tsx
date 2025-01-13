import React from 'react';

interface TableProps {
  align: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ align, children }) => {
  return (
    <td
    className={`py-1 px-4 text-${align} border border-black-500 px-2 py-1 rounded-md`}
    >
      {children}
    </td>
  );
};

export default Table;


