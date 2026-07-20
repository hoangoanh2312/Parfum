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
  const options = Array.from(new Set([...selected, ...sizes])).filter(Boolean);

  return (
    <FilterSection title="Size">
      <div className="flex flex-wrap gap-3">
        {options.length === 0 && (
          <p className="text-xs text-[#8A8176]">Đang cập nhật</p>
        )}

        {options.map((size) => {
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
}
