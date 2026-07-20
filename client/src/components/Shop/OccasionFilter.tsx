import FilterSection from "./FilterSection";

interface OccasionFilterProps {
  occasions: string[];
  selected: string[];
  onToggle: (item: string) => void;
}

export default function OccasionFilter({
  occasions,
  selected,
  onToggle,
}: OccasionFilterProps) {
  return (
    <FilterSection title="Occasion">
      <div className="flex flex-wrap gap-3">
        {occasions.map((item) => {
          const active = selected.includes(item);

          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              className={`px-4 py-2 border text-[11px] uppercase tracking-[2px] duration-300
                ${
                  active
                    ? "bg-[#735C00] text-white border-[#735C00]"
                    : "bg-white text-[#1C1C19] border-[#D0C5AF] hover:bg-[#735C00] hover:text-white"
                }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </FilterSection>
  );
}
