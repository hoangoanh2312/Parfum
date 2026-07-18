interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

<<<<<<< HEAD
export default function SearchBox({
  value,
  onChange,
}: SearchBoxProps) {
=======
export default function SearchBox({ value, onChange }: SearchBoxProps) {
>>>>>>> feature/pf-32-category-brand-crud
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products..."
        className="w-full h-11 border border-[#D0C5AF] px-4 pr-10 outline-none"
      />
    </div>
  );
}
