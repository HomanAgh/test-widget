// TableHeader.tsx
interface TableHeaderProps {
  align: 'left' | 'center' | 'right';
  onClick?: () => void;
  children: React.ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({ align, children, onClick }) => {
  return (
    <th
      className={`py-2 px-4 text-${align} font-bold whitespace-nowrap`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </th>
  );
};

export default TableHeader;
