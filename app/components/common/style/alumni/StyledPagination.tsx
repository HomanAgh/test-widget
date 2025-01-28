import React from "react";

interface StyledPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const StyledPagination: React.FC<StyledPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const generatePages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      {/* Previous Button */}
      <button
        className={`px-4 py-2 border ${
          currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-white text-black hover:bg-gray-100"
        }`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          borderRadius: "4px", 
        }}
      >
        {"<"}
      </button>

      {/* Page Buttons */}
      {generatePages().map((page) => (
        <button
          key={page}
          className={`px-4 py-2 border ${
            page === currentPage
              ? "bg-green-500 text-white"
              : "bg-white text-black hover:bg-gray-100"
          }`}
          onClick={() => onPageChange(page)}
          style={{
            borderRadius: "4px", // Consistent shape for buttons
            minWidth: "40px", // Ensures all buttons are the same width
          }}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        className={`px-4 py-2 border ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400"
            : "bg-white text-black hover:bg-gray-100"
        }`}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          borderRadius: "4px", // Less rounded
        }}
      >
        {">"}
      </button>

      {/* Go to Page */}
      <div className="flex items-center space-x-2 ml-4">
        <span className="text-sm text-gray-700">Go to page</span>
        <input
          placeholder="#"
          className="border p-1 w-12 text-center"
          min={1}
          max={totalPages}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const page = parseInt((e.target as HTMLInputElement).value, 10);
              if (page >= 1 && page <= totalPages) onPageChange(page);
            }
          }}
          style={{
            borderRadius: "4px", // Match button style
          }}
        />
        <button
          className="px-3 py-1 bg-green-500 text-white rounded"
          onClick={() => {
            const pageInput = document.querySelector(
              "input[type='number']"
            ) as HTMLInputElement;
            const page = parseInt(pageInput.value, 10);
            if (page >= 1 && page <= totalPages) onPageChange(page);
          }}
          style={{
            borderRadius: "4px", // Consistent shape
          }}
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default StyledPagination;
