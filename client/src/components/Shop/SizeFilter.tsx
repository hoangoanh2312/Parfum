import FilterSection from "./FilterSection";

interface SizeFilterProps {
  sizes: string[];
  selected: string[];
  onToggle: (size: string) => void;
}

export default function SizeFilter({
  sizes,
  selected,
  onToggle,
}: SizeFilterProps) {
  return (
    <FilterSection title="Size">
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => {
          const active = selected.includes(size);

          return (
            <button
              key={size}
              onClick={() => onToggle(size)}
              className={`px-4 py-2 border text-[11px] uppercase tracking-[2px] duration-300
                ${
                  active
                    ? "bg-[#735C00] text-white border-[#735C00]"
                    : "bg-white text-[#1C1C19] border-[#D0C5AF] hover:bg-[#735C00] hover:text-white"
                }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </FilterSection>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> feature/pf-32-category-brand-crud
