import { useState } from "react";

interface PriceFilterProps{
    value:number;
    onChange:(value:number)=>void;
    min?: number;
    max?: number;
}

export default function PriceFilter({
  min = 0,
  max = 500,
  onChange,
}: PriceFilterProps) {
  const [value, setValue] = useState(max);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = Number(e.target.value);

    setValue(price);
    onChange?.(price);
  };

  return (
    <div className="mt-8">
      <h3 className="uppercase tracking-[2px] text-[11px] font-semibold text-[#735C00] mb-4">
        Price Range
      </h3>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="w-full accent-[#735C00]"
      />

      <div className="flex justify-between mt-3 text-xs text-gray-500">
        <span>${min}</span>

        <span>${value}</span>
      </div>
    </div>
  );
}