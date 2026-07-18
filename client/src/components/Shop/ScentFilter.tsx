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
  const options = Array.from(new Set([...selected, ...scents])).filter(Boolean);

  return (
    <FilterSection title="Scent Profile">
      <div className="space-y-3">
        {options.length === 0 && (
          <p className="text-xs text-[#8A8176]">Đang cập nhật</p>
        )}

        {options.map((item) => (
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
}
