import ShopSidebar from "../components/Shop/ShopSidebar";
import ProductGrid from "../components/Shop/ProductGrid";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import { api } from "../lib/api";

type Product = {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  price?: number | null;
  images?: string[];
  image?: string | null;
  priceText?: string;
  variantId?: string | null;
  volume?: string;
  stock?: number;
  fragranceFamily?: string;
  notes?: {
    top?: string[];
    middle?: string[];
    base?: string[];
  };
  concentration?: string;
  gender?: string;
  season?: string[];
  sizes?: string[];
  brand?: string;
  category?: string;
};

type ProductListResponse = {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const occasionSeasonMap: Record<string, string[]> = {
  Day: ["spring", "summer", "all"],
  Night: ["autumn", "winter", "all"],
  Formal: ["autumn", "winter", "all"],
  Work: ["spring", "summer", "autumn", "all"],
};

const getSizeNumber = (size: string) => {
  const match = size.match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
};

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
const [search,setSearch]=useState("");
const [selectedScents, setSelectedScents] = useState<string[]>([]);
const [selectedBrands,setSelectedBrands]=useState<string[]>([]);

const [selectedGenders,setSelectedGenders]=useState<string[]>([]);
const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);

const [selectedConcentrations, setSelectedConcentrations] = useState<string[]>([]);
const [price,setPrice]=useState(Number.MAX_SAFE_INTEGER);
const [sort,setSort]=useState("newest");
const toggleSize = (value: string) => {
  setSelectedSizes((prev) =>
    prev.includes(value)
      ? prev.filter((x) => x !== value)
      : [...prev, value]
  );
};

const toggleOccasion = (value: string) => {
  setSelectedOccasions((prev) =>
    prev.includes(value)
      ? prev.filter((x) => x !== value)
      : [...prev, value]
  );
};

const toggleConcentration = (value: string) => {
  setSelectedConcentrations((prev) =>
    prev.includes(value)
      ? prev.filter((x) => x !== value)
      : [...prev, value]
  );
};
const toggleScent = (value: string) => {
  setSelectedScents((prev) =>
    prev.includes(value)
      ? prev.filter((item) => item !== value)
      : [...prev, value]
  );
};

useEffect(() => {
  const nextSearch = searchParams.get("search") || "";
  const nextBrand = searchParams.get("brand") || "";
  const nextScent = searchParams.get("scent") || "";
  const nextSeason = searchParams.get("season") || "";
  const nextSort = searchParams.get("sort") || "";

  setSearch(nextSearch);
  setSelectedBrands(nextBrand ? [nextBrand] : []);
  setSelectedScents(nextScent ? nextScent.split(",").map((item) => item.trim()).filter(Boolean) : []);
  setSelectedSeasons(nextSeason ? nextSeason.split(",").map((item) => item.trim()).filter(Boolean) : []);
  if (nextSort) setSort(nextSort);
}, [searchParams]);

useEffect(() => {
  let active = true;

  async function loadFilterOptions() {
    try {
      const { data } = await api.get<ProductListResponse>("/products", {
        params: { page: 1, limit: 100, sort: "newest" },
      });

      if (active) {
        setAllProducts(data.data);
      }
    } catch (error) {
      console.error("Failed to load filter options", error);
    }
  }

  loadFilterOptions();

  return () => {
    active = false;
  };
}, []);

useEffect(() => {
  let active = true;

  async function loadProducts() {
    try {
      setLoading(true);
      const { data } = await api.get<ProductListResponse>("/products", {
        params: {
          page: 1,
          limit: 100,
          search: search || undefined,
          brand: selectedBrands.join(",") || undefined,
          gender: selectedGenders.join(",") || undefined,
          scent: selectedScents.join(",") || undefined,
          size: selectedSizes.join(",") || undefined,
          season: [
            ...selectedOccasions.flatMap((occasion) => occasionSeasonMap[occasion] ?? []),
            ...selectedSeasons,
          ].join(",") || undefined,
          concentration: selectedConcentrations.join(",") || undefined,
          maxPrice: price === Number.MAX_SAFE_INTEGER ? undefined : price,
          sort,
        },
      });

      if (active) {
        setProducts(data.data);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  }

  loadProducts();

  return () => {
    active = false;
  };
}, [
  search,
  selectedBrands,
  selectedGenders,
  selectedScents,
  selectedSizes,
  selectedOccasions,
  selectedSeasons,
  selectedConcentrations,
  price,
  sort,
]);

const brands = useMemo(
  () =>
    Array.from(
      new Set(
        allProducts
          .map((product) => product.brand)
          .filter((brand): brand is string => Boolean(brand)),
      ),
    ),
  [allProducts],
);

const scents = useMemo(
  () =>
    Array.from(
      new Set(
        allProducts.flatMap((product) => [
          ...(product.notes?.top || []),
          ...(product.notes?.middle || []),
          ...(product.notes?.base || []),
          ...(product.fragranceFamily ? [product.fragranceFamily] : []),
        ]).filter(Boolean),
      ),
    ).sort((left, right) => left.localeCompare(right)),
  [allProducts],
);

const sizes = useMemo(
  () =>
    Array.from(new Set(allProducts.flatMap((product) => product.sizes ?? []))).sort(
      (left, right) => getSizeNumber(left) - getSizeNumber(right) || left.localeCompare(right),
    ),
  [allProducts],
);

const concentrations = useMemo(
  () =>
    Array.from(
      new Set(
        allProducts
          .map((product) => product.concentration)
          .filter((concentration): concentration is string => Boolean(concentration)),
      ),
    ),
  [allProducts],
);

const maxPrice = useMemo(
  () => allProducts.reduce((max, product) => Math.max(max, product.price ?? 0), 0),
  [allProducts],
);

useEffect(() => {
  if (maxPrice > 0 && price === Number.MAX_SAFE_INTEGER) {
    setPrice(maxPrice);
  }
}, [maxPrice, price]);

const filteredProducts = useMemo(
  () =>
    products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesBrand =
        selectedBrands.length === 0 ||
        (product.brand ? selectedBrands.includes(product.brand) : false);
      const matchesGender =
        selectedGenders.length === 0 ||
        (product.gender ? selectedGenders.includes(product.gender) : false);
      const matchesScent =
        selectedScents.length === 0 ||
        selectedScents.some((scent) =>
          product.fragranceFamily === scent ||
          product.notes?.top?.includes(scent) ||
          product.notes?.middle?.includes(scent) ||
          product.notes?.base?.includes(scent),
        );
      const matchesSize =
        selectedSizes.length === 0 ||
        selectedSizes.some((size) => product.sizes?.includes(size));
      const matchesOccasion =
        selectedOccasions.length === 0 ||
        selectedOccasions.some((occasion) =>
          occasionSeasonMap[occasion]?.some((season) => product.season?.includes(season)),
        );
      const matchesSeason =
        selectedSeasons.length === 0 ||
        selectedSeasons.some((season) => product.season?.includes(season));
      const matchesConcentration =
        selectedConcentrations.length === 0 ||
        (product.concentration ? selectedConcentrations.includes(product.concentration) : false);
      const matchesPrice = (product.price ?? 0) <= price;

      return (
        matchesSearch &&
        matchesBrand &&
        matchesGender &&
        matchesScent &&
        matchesSize &&
        matchesOccasion &&
        matchesSeason &&
        matchesConcentration &&
        matchesPrice
      );
    }),
  [
    products,
    search,
    selectedBrands,
    selectedGenders,
    selectedScents,
    selectedSizes,
    selectedOccasions,
    selectedSeasons,
    selectedConcentrations,
    price,
  ],
);

const toggleBrand=(brand:string)=>{

setSelectedBrands(prev=>

prev.includes(brand)

?prev.filter(item=>item!==brand)

:[...prev,brand]

);

}
const toggleGender=(gender:string)=>{
  setSelectedGenders([gender]);
}
  return (
    <>
    <main className="bg-[#FDF9F4]">
      {/* Hero */}
      <section className="max-w-[1536px] mx-auto px-10 pt-32 pb-16">
       <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="font-heading text-[88px] leading-[88px] text-[#1C1C19]">
              The Seasonal
              <br />
              Archives
            </h1>

            <p className="mt-8 max-w-md text-[#5F5E5E] leading-8">
              Discover timeless fragrances curated from the world's finest
              perfume houses.
            </p>
          </div>

          <div className="bg-[#F3EEE7] h-[330px] rounded-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

<section className="max-w-[1536px] mx-auto px-10 flex gap-16 pb-24">
  <ShopSidebar

    search={search}
    setSearch={setSearch}
    brands={brands}
    selectedBrands={selectedBrands}
    toggleBrand={toggleBrand}
    genders={[
      "female",
      "male",
      "unisex",
    ]}
    selectedGenders={selectedGenders}
    toggleGender={toggleGender}
    clearGender={() => setSelectedGenders([])}
    price={price}
    maxPrice={maxPrice}
    setPrice={setPrice}
      selectedScents={selectedScents}
      scents={scents}
toggleScent={toggleScent}
    selectedSizes={selectedSizes}
sizes={sizes}
toggleSize={toggleSize}

selectedOccasions={selectedOccasions}
occasions={["Day", "Night", "Formal", "Work"]}
toggleOccasion={toggleOccasion}

selectedConcentrations={selectedConcentrations}
concentrations={concentrations}
toggleConcentration={toggleConcentration}
  />

        {/* Content */}
        <section className="flex-1">
          {/* Toolbar */}
          <div className="flex justify-between border-b pb-5 border-[#e8deca]">
            <p className="uppercase text-xs tracking-widest text-[#5F5E5E]">
              Showing {filteredProducts.length} of {total} products
            </p>

            <label className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#8A8176]">
                Sắp xếp
              </span>

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="min-w-[190px] border border-[#e8deca] bg-[#FDF9F4] px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-[#4F4942] outline-none transition hover:border-[#735C00] focus:border-[#735C00]"
              >
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
              </select>
            </label>
          </div>

          {/* Grid */}
          <ProductGrid products={filteredProducts} loading={loading} />
          {/* Pagination */}
          <div className="border-t mt-16 pt-8 flex justify-center items-center gap-8">
            <button className="uppercase text-xs text-gray-400">
              Previous
            </button>

            <button className="text-[#735C00] font-bold">1</button>
            <button>2</button>
            <button>3</button>

            <button className="uppercase text-xs text-[#735C00]">
              Next
            </button>
          </div>
        </section>
      </section>
    </main>
    
    <Footer />
</>
  );
}
