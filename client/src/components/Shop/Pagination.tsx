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
    <div className="mt-16 flex items-center justify-center gap-6">

      {/* Previous */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center gap-2 text-[11px] uppercase tracking-[2px] text-[#B5A47A] hover:text-[#1E1D1A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <ChevronLeft size={14} strokeWidth={1.5} />
        Prev
      </button>

      {/* Divider */}
      <div className="h-px w-4 bg-[#D0C5AF]" />

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`relative w-9 h-9 text-[12px] tracking-[1px] transition-all duration-200 font-medium
              ${
                currentPage === page
                  ? "text-[#1E1D1A]"
                  : "text-[#B5A47A] hover:text-[#1E1D1A]"
              }`}
          >
            {page}
            {currentPage === page && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-px bg-[#B5A47A]" />
            )}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px w-4 bg-[#D0C5AF]" />

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center gap-2 text-[11px] uppercase tracking-[2px] text-[#B5A47A] hover:text-[#1E1D1A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Next
        <ChevronRight size={14} strokeWidth={1.5} />
      </button>

    </div>
  );
}