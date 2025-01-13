import React from 'react';

interface TableTitelProps {
  align: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

const TableTitel: React.FC<TableTitelProps> = ({ children, align }) => {
  return (
    <h2
      className={`text-2xl font-bold mb-4 text-${align}`} // Dynamic text alignment class
    >
      {children}
    </h2>
  );
};

export default TableTitel;
