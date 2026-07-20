import SearchBox from "./SearchBox";
import BrandFilter from "./BrandFilter";
import GenderFilter from "./GenderFilter";
import PriceFilter from "./PriceFilter";
import ScentFilter from "./ScentFilter";
import SizeFilter from "./SizeFilter";
import OccasionFilter from "./OccasionFilter";
import ConcentrationFilter from "./ConcentrationFilter";
interface Props{
  scents:string[];
  selectedSizes: string[];
sizes:string[];
toggleSize: (size: string) => void;

selectedOccasions: string[];
occasions:string[];
toggleOccasion: (item: string) => void;

selectedConcentrations: string[];
concentrations:string[];
toggleConcentration: (item: string) => void;
  selectedScents: string[];
toggleScent: (value: string) => void;
    search:string;
    setSearch:(v:string)=>void;

    brands:string[];
    selectedBrands:string[];
    toggleBrand:(brand:string)=>void;

    genders:string[];
    selectedGenders:string[];
    toggleGender:(gender:string)=>void;
    clearGender:()=>void;

    price:number;
    maxPrice:number;
    setPrice:(value:number)=>void;
}

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
    onClear={props.clearGender}
/>

<PriceFilter
    value={props.price}
    max={props.maxPrice || 500}
    onChange={props.setPrice}
/>

      {/* Scent */}
     <ScentFilter
    scents={props.scents}
    selected={props.selectedScents}
    onToggle={props.toggleScent}
/>

      {/* Size */}
      <SizeFilter
    sizes={props.sizes}
    selected={props.selectedSizes}
    onToggle={props.toggleSize}
/>
      {/* Occasion */}
     <OccasionFilter
    occasions={props.occasions}
    selected={props.selectedOccasions}
    onToggle={props.toggleOccasion}
/>
<ConcentrationFilter
  concentrations={props.concentrations}
  selected={props.selectedConcentrations}
  onToggle={props.toggleConcentration}
/>
    </aside>
  );
}
