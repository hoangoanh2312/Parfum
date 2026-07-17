import { useState } from "react";

interface PriceFilterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const vnd = (n: number) => (n || 0).toLocaleString("vi-VN") + "₫";

export default function PriceFilter({
  min = 0,
  max = 5000000,
  value,
  onChange,
}: PriceFilterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(Number(e.target.value));
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
        <span>{vnd(min)}</span>

        <span>{vnd(value)}</span>
      </div>
    </div>
  );
}
