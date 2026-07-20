import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface FilterSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function FilterSection({
  title,
  children,
  defaultOpen = true,
}: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mt-10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between"
      >
        <span className="uppercase tracking-[2px] text-[11px] font-semibold text-[#735C00]">
          {title}
        </span>

        <ChevronDown
          size={16}
          className={`duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`overflow-hidden duration-300 ${
          open ? "max-h-[500px] mt-5" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}