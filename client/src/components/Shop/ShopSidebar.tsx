import SearchBox from "./SearchBox";
import BrandFilter from "./BrandFilter";
import GenderFilter from "./GenderFilter";
import PriceFilter from "./PriceFilter";
import ScentFilter from "./ScentFilter";
import SizeFilter from "./SizeFilter";
import OccasionFilter from "./OccasionFilter";
import ConcentrationFilter from "./ConcentrationFilter";

interface Props {
  scents: string[];
  selectedSizes: string[];
  sizes: string[];
  toggleSize: (size: string) => void;

  selectedOccasions: string[];
  occasions: string[];
  toggleOccasion: (item: string) => void;

  selectedConcentrations: string[];
  concentrations: string[];
  toggleConcentration: (item: string) => void;
  selectedScents: string[];
  toggleScent: (value: string) => void;
  search: string;
  setSearch: (v: string) => void;

  brands: string[];
  selectedBrands: string[];
  toggleBrand: (brand: string) => void;

  genders: string[];
  selectedGenders: string[];
  toggleGender: (gender: string) => void;
  clearGender: () => void;

  price: number;
  maxPrice: number;
  setPrice: (value: number) => void;
}

// Anh banner o sidebar - THAY ANH CUA BAN TAI DAY
const SIDEBAR_IMAGE = "/images/shop/sidebar-banner.jpg";
const SIDEBAR_IMAGE_FALLBACK =
  "https://placehold.co/500x680/1C1C19/E8E3D8?text=Your+Image+Here";

export default function ShopSidebar(props: Props) {
  return (
    <aside className="w-64 shrink-0 self-start lg:sticky lg:top-28">
      <SearchBox value={props.search} onChange={props.setSearch} />

      <BrandFilter
        brands={props.brands}
        selected={props.selectedBrands}
        onToggle={props.toggleBrand}
        initialVisible={6}
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
        initialVisible={8}
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

      {/* =========================================================
          SECTION ANH TUY CHINH - chen anh cua ban vao day.
          Doi bien SIDEBAR_IMAGE o tren, hoac thay src ben duoi.
          ========================================================= */}
      <div className="mt-10 border-t border-[#e8deca] pt-8">
        <h3 className="uppercase tracking-[2px] text-[11px] font-semibold text-[#735C00] mb-4">
          Featured
        </h3>
        <div className="relative overflow-hidden rounded-sm bg-[#EFECE7]">
          <img
            src={SIDEBAR_IMAGE}
            alt="Featured"
            className="aspect-[3/4] w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = SIDEBAR_IMAGE_FALLBACK;
            }}
          />
        </div>
      </div>
    </aside>
  );
}
