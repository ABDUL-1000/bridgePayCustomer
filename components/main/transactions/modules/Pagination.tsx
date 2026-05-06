import React, { useState } from "react";

interface PaginationProps {
  totalPages: number;
  itemsPerPage: number[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const [itemsPerPageCount, setItemsPerPageCount] = useState<number>(
    itemsPerPage[0]
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 max-w-[600px] mx-auto mt-10">
      {/* Page Info */}
      <span className="text-sub-500 text-xs md:text-sm hidden md:block">
        Page {currentPage} of {totalPages}
      </span>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1 overflow-auto scrollbar-none">
        {/* Previous */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded transition-all ${
            currentPage === 1
              ? "text-sub-500 cursor-not-allowed"
              : "hover:bg-soft-200"
          }`}
        >
          &lt;
        </button>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .slice(0, 5)
            .map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`p-1.5 h-8 w-8 flex items-center justify-center font-medium rounded-md text-xs md:text-sm transition-all border border-soft-200 ${
                  currentPage === page
                    ? "bg-custom-weak-100 text-black-900"
                    : "hover:bg-soft-200 text-sub-500"
                }`}
              >
                {page}
              </button>
            ))}
        </div>

        <span className="px-2">...</span>
        <button
          onClick={() => handlePageChange(totalPages)}
          className={`p-1.5 h-8 w-8 flex items-center justify-center font-medium rounded-md text-xs md:text-sm transition-all border border-soft-200 ${
            currentPage === totalPages
              ? "bg-custom-weak-100 text-black-900"
              : "hover:bg-soft-200 text-sub-500"
          }`}
        >
          {totalPages}
        </button>

        {/* Next */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 rounded transition-all ${
            currentPage === totalPages
              ? "text-sub-500 cursor-not-allowed"
              : "hover:bg-soft-200"
          }`}
        >
          &gt;
        </button>
      </div>

      {/* Items per Page */}
      <div className=" border border-soft-200 pr-1.5 rounded h-8">
        <select
          value={itemsPerPageCount}
          onChange={(e) => setItemsPerPageCount(Number(e.target.value))}
          className="px-2 py-1 text-black-900 text-xs md:text-sm tracking-[-0.04px]"
        >
          {itemsPerPage.map((count) => (
            <option key={count} value={count}>
              {count} / page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
