interface BrandFilterProps {
  brands: string[];
  selected: string[];
  onToggle: (brand: string) => void;
}

export default function BrandFilter({
  brands = [
    "Byredo",
    "Diptyque",
    "Tom Ford",
    "Creed",
    "Maison Francis Kurkdjian",
  ],
  selected = [],
  onToggle,
}: BrandFilterProps) {
  return (
    <div className="mt-8">
      <h3 className="uppercase tracking-[2px] text-[11px] font-semibold text-[#735C00] mb-4">
        Brand
      </h3>

      <div className="space-y-3">
        {brands.map((brand) => (
<<<<<<< HEAD
          <label
            key={brand}
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(brand)}
             onChange={() => onToggle(brand)}
=======
          <label key={brand} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(brand)}
              onChange={() => onToggle(brand)}
>>>>>>> feature/pf-32-category-brand-crud
              className="accent-[#735C00]"
            />

            <span className="text-sm">{brand}</span>
          </label>
        ))}
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> feature/pf-32-category-brand-crud
