interface GenderFilterProps {
  genders: string[];
  selected: string[];
  onToggle: (gender: string) => void;
}

const genderLabels: Record<string, string> = {
  female: "Women",
  male: "Men",
  unisex: "Unisex",
};

export default function GenderFilter({
  genders = ["Women", "Men", "Unisex"],
  selected = [],
  onToggle,
}: GenderFilterProps) {
  return (
    <div className="mt-8">
      <h3 className="uppercase tracking-[2px] text-[11px] font-semibold text-[#735C00] mb-4">
        Gender
      </h3>

      <div className="space-y-3">
        {genders.map((gender) => (
          <label
            key={gender}
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(gender)}
              onChange={() => onToggle(gender)}
              className="accent-[#735C00]"
            />

            <span className="text-sm">{genderLabels[gender] ?? gender}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
