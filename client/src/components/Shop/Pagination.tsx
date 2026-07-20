import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-16 flex items-center justify-center gap-3">
      {/* Previous */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-10 h-10 border border-[#D0C5AF] flex items-center justify-center disabled:opacity-40 hover:bg-[#735C00] hover:text-white duration-200"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page number */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 border transition
            ${
              currentPage === page
                ? "bg-[#735C00] text-white border-[#735C00]"
                : "border-[#D0C5AF] hover:bg-[#F3EEE7]"
            }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-10 h-10 border border-[#D0C5AF] flex items-center justify-center disabled:opacity-40 hover:bg-[#735C00] hover:text-white duration-200"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
