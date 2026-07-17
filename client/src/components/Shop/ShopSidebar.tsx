import { ChevronDown } from "lucide-react";
import SearchBox from "./SearchBox";
import BrandFilter from "./BrandFilter";
import GenderFilter from "./GenderFilter";
import PriceFilter from "./PriceFilter";

interface Props{
    search:string;
    setSearch:(v:string)=>void;

    brands:string[];
    selectedBrands:string[];
    toggleBrand:(brand:string)=>void;

    genders:string[];
    selectedGenders:string[];
    toggleGender:(gender:string)=>void;

    price:number;
    setPrice:(value:number)=>void;
}
const genders = ["Women", "Men", "Unisex"];

const scents = ["Floral", "Woody", "Citrus", "Oriental"];

const sizes = ["30ml", "50ml", "75ml", "100ml", "200ml"];

const occasions = ["Day", "Night", "Formal", "Work"];

export default function ShopSidebar(props:Props){
  return (
    <aside className="w-64 shrink-0">
<SearchBox
    value={props.search}
    onChange={props.setSearch}
/>

<BrandFilter
    brands={props.brands}
    selected={props.selectedBrands}
    onToggle={props.toggleBrand}
/>

<GenderFilter
    genders={props.genders}
    selected={props.selectedGenders}
    onToggle={props.toggleGender}
/>

<PriceFilter
    value={props.price}
    onChange={props.setPrice}
/>

      {/* Scent */}

      <FilterTitle title="Scent Profile" />

      <div className="space-y-3 mt-6">
        {scents.map((item) => (
          <Checkbox key={item} label={item} />
        ))}
      </div>

      {/* Size */}

      <div className="mt-10">
        <h3 className="uppercase tracking-[2px] text-[11px] font-semibold text-[#735C00] mb-5">
          Size
        </h3>

        <div className="flex flex-wrap gap-3">
          {sizes.map((item) => (
            <button
              key={item}
              className="border border-[#D0C5AF] px-4 py-2 text-[11px] uppercase tracking-widest hover:bg-[#735C00] hover:text-white transition"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Occasion */}

      <div className="mt-10">
        <h3 className="uppercase tracking-[2px] text-[11px] font-semibold text-[#735C00] mb-5">
          Occasion
        </h3>

        <div className="flex flex-wrap gap-3">
          {occasions.map((item) => (
            <button
              key={item}
              className="border border-[#D0C5AF] px-4 py-2 text-[11px] uppercase tracking-widest hover:bg-[#735C00] hover:text-white transition"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function FilterTitle({ title }: { title: string }) {
  return (
    <button className="flex justify-between items-center w-full mt-10">
      <span className="uppercase tracking-[2px] text-[11px] font-semibold text-[#735C00]">
        {title}
      </span>

      <ChevronDown size={16} />
    </button>
  );
}

function Checkbox({ label }: { label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer text-sm text-[#1C1C19]">
      <input
        type="checkbox"
        className="accent-[#735C00] w-4 h-4"
      />

      {label}
    </label>
  );
}