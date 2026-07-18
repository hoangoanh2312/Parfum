import FilterSection from "./FilterSection";

interface ScentFilterProps {
  scents: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

export default function ScentFilter({
  scents,
  selected,
  onToggle,
}: ScentFilterProps) {
  return (
    <FilterSection title="Scent Profile">
      <div className="space-y-3">
        {scents.map((item) => (
          <label
            key={item}
            className="flex items-center gap-3 cursor-pointer text-sm text-[#1C1C19]"
          >
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
              className="accent-[#735C00] w-4 h-4"
            />

            {item}
          </label>
        ))}
      </div>
    </FilterSection>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> feature/pf-32-category-brand-crud
