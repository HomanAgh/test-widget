import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface AdvancedPaginationControlsProps {
  currentPage: number;           // zero-based current page index
  totalPages: number;           // total number of pages
  onPageChange: (page: number) => void; 
}

const AdvancedPaginationControls: React.FC<AdvancedPaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // "Go to page" input state
  const [goToPageInput, setGoToPageInput] = React.useState<string>("");

  if (totalPages <= 1) return null;

  // Handlers
  const handlePrev = () => {
    if (currentPage > 0) onPageChange(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages - 1) onPageChange(currentPage + 1);
  };
  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      // Convert 1-based input into 0-based index
      onPageChange(page - 1);
      setGoToPageInput("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mt-4 w-full gap-2 md:gap-4">
      {/* Left side - Pagination Controls */}
      <div className="flex flex-wrap justify-center items-center gap-1 md:gap-2">
        {/* Previous Button */}
        <button
          disabled={currentPage === 0}
          onClick={handlePrev}
          className="p-2 disabled:opacity-50"
        >
          <FaChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-black" />
        </button>

        {/* First Page */}
        <button
          className={`w-8 h-8 border rounded-lg ${
            currentPage === 0
              ? "bg-green-600 text-white"
              : "bg-gray-100 hover:bg-gray-300"
          }`}
          onClick={() => onPageChange(0)}
        >
          1
        </button>

        {/* Ellipsis for larger page ranges */}
        {currentPage > 3 && <span className="text-gray-500">...</span>}

        {/* Dynamic Middle Page Numbers */}
        {Array.from({ length: totalPages }, (_, index) => index)
          .filter((index) => {
            // We already show page 1 & last below,
            // so omit them from the "middle" unless we’re near them
            if (index === 0 || index === totalPages - 1) return false;
            if (currentPage < 3) return index >= 1 && index <= 4;
            if (currentPage > totalPages - 4) return index >= totalPages - 5;
            return index >= currentPage - 1 && index <= currentPage + 3;
          })
          .map((index) => (
            <button
              key={index}
              className={`w-8 h-8 border rounded-lg ${
                currentPage === index
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 hover:bg-gray-300"
              }`}
              onClick={() => onPageChange(index)}
            >
              {index + 1}
            </button>
          ))}

        {/* Ellipsis before last page */}
        {currentPage < totalPages - 4 && <span className="text-gray-500">...</span>}

        {/* Last Page */}
        {totalPages > 1 && (
          <button
            className={`w-8 h-8 border rounded-lg ${
              currentPage === totalPages - 1
                ? "bg-green-600 text-white"
                : "bg-gray-100 hover:bg-gray-300"
            }`}
            onClick={() => onPageChange(totalPages - 1)}
          >
            {totalPages}
          </button>
        )}

        {/* Next Button */}
        <button
          disabled={currentPage >= totalPages - 1}
          onClick={handleNext}
          className="p-2 disabled:opacity-50"
        >
          <FaChevronRight className="w-3 h-3 md:w-4 md:h-4 text-black" />
        </button>
      </div>

      {/* Right Side - "Go to Page" */}
      <div className="flex items-center space-x-2 justify-center md:justify-start">
        <span className="text-sm md:text-base text-gray-700">Go to page</span>
        <input
          value={goToPageInput}
          onChange={(e) => setGoToPageInput(e.target.value)}
          className="border p-1 w-10 h-8 text-center rounded text-sm"
          placeholder="#"
          min={1}
          max={totalPages}
        />
        <button
          onClick={handleGoToPage}
          className="text-sm md:text-base font-bold px-3 py-1 bg-green-600 text-white rounded-lg"
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default AdvancedPaginationControls;
