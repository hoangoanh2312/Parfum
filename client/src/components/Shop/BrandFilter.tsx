import { useState } from "react";

interface BrandFilterProps {
  brands: string[];
  selected: string[];
  onToggle: (brand: string) => void;
  initialVisible?: number;
}

const norm = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");

export default function BrandFilter({
  brands = [],
  selected = [],
  onToggle,
  initialVisible = 6,
}: BrandFilterProps) {
  const [showAll, setShowAll] = useState(false);
  const selectedSet = new Set(selected.map(norm));

  // Khi thu gon: hien N brand dau + bat buoc hien them brand dang duoc chon
  const base = showAll ? brands : brands.slice(0, initialVisible);
  const extraSelected = showAll
    ? []
    : brands.filter((b) => selectedSet.has(norm(b)) && !base.includes(b));
  const visible = [...base, ...extraSelected];

  const canToggle = brands.length > initialVisible;

  return (
    <div className="mt-8">
      <h3 className="uppercase tracking-[2px] text-[11px] font-semibold text-[#735C00] mb-4">
        Brand
      </h3>

      <div className="space-y-3">
        {visible.map((brand) => (
          <label key={brand} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedSet.has(norm(brand))}
              onChange={() => onToggle(brand)}
              className="accent-[#735C00]"
            />

            <span className="text-sm">{brand}</span>
          </label>
        ))}

        {visible.length === 0 && (
          <p className="text-xs text-[#A29D91]">Chưa có thương hiệu.</p>
        )}
      </div>

      {canToggle && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#735C00] transition hover:text-[#4D410F]"
        >
          {showAll ? "Thu gọn" : `Show all (${brands.length})`}
        </button>
      )}
    </div>
  );
}
