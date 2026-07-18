import FilterSection from "./FilterSection";

interface Props {
  concentrations: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

export default function ConcentrationFilter({
  concentrations,
  selected,
  onToggle,
}: Props) {
  return (
    <FilterSection title="Concentration">
      <div className="space-y-3">
        {concentrations.map((item) => (
          <label
            key={item}
            className="flex items-center gap-3 cursor-pointer text-sm"
          >
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
              className="accent-[#735C00]"
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
