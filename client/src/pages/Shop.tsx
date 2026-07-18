import ShopSidebar from "../components/Shop/ShopSidebar";
import ProductGrid from "../components/Shop/ProductGrid";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import { api } from "../lib/api";
import { SlidersHorizontal, X } from "lucide-react";

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
const [filterOpen, setFilterOpen] = useState(false);

useEffect(() => {
  if (!filterOpen) return;

  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") setFilterOpen(false);
  };
  const desktopQuery = window.matchMedia("(min-width: 1024px)");
  const closeOnDesktop = (event: MediaQueryListEvent) => {
    if (event.matches) setFilterOpen(false);
  };

  document.addEventListener("keydown", closeOnEscape);
  desktopQuery.addEventListener("change", closeOnDesktop);
  document.body.style.overflow = "hidden";

  return () => {
    document.removeEventListener("keydown", closeOnEscape);
    desktopQuery.removeEventListener("change", closeOnDesktop);
    document.body.style.overflow = "";
  };
}, [filterOpen]);

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
  setPage(1);
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

useEffect(() => {
  let active = true;

  async function loadProducts() {
    try {
      setLoading(true);
      const { data } = await api.get<ProductListResponse>("/products", {
        params: {
          page,
          limit: 12,
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
        setTotalPages(data.totalPages || 1);
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
  page,
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
      <section className="mx-auto max-w-[1536px] px-5 pb-4 pt-8 sm:px-8 sm:pb-10 sm:pt-20 lg:px-10 lg:pb-16 lg:pt-32">
       <div className="grid items-center gap-5 sm:gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="font-heading text-[44px] leading-[0.98] text-[#1C1C19] sm:text-6xl sm:leading-none lg:text-[88px] lg:leading-[88px]">
              The Seasonal
              <br />
              Archives
            </h1>

            <p className="mt-4 max-w-md text-base leading-6 text-[#5F5E5E] sm:mt-8 sm:leading-8">
              Discover timeless fragrances curated from the world's finest
              perfume houses.
            </p>
          </div>

          <div className="h-[250px] overflow-hidden rounded-sm bg-[#F3EEE7] sm:h-auto sm:aspect-[16/9] lg:h-[330px] lg:aspect-auto">
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200"
              alt="Bộ sưu tập nước hoa theo mùa"
              className="h-full w-full object-cover object-center"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>

<section className="mx-auto max-w-[1536px] px-5 pb-16 sm:px-8 lg:flex lg:gap-12 lg:px-10 lg:pb-24 xl:gap-16">
  {filterOpen && <button type="button" className="fixed inset-0 z-40 bg-black/45 lg:hidden" onClick={() => setFilterOpen(false)} aria-label="Đóng bộ lọc" />}
  <div
    className={`fixed inset-y-0 left-0 z-50 w-[min(86vw,320px)] overflow-y-auto bg-[#FDF9F4] p-5 shadow-2xl transition-transform duration-300 lg:visible lg:static lg:z-auto lg:block lg:w-64 lg:shrink-0 lg:translate-x-0 lg:overflow-visible lg:bg-transparent lg:p-0 lg:shadow-none lg:pointer-events-auto ${filterOpen ? "visible translate-x-0" : "invisible -translate-x-full pointer-events-none"}`}
    aria-label="Bộ lọc sản phẩm"
  >
    <div className="mb-4 flex items-center justify-between lg:hidden"><h2 className="font-semibold">Bộ lọc sản phẩm</h2><button type="button" onClick={() => setFilterOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full border" aria-label="Đóng bộ lọc"><X size={20} /></button></div>
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
  </div>

        {/* Content */}
        <section className="min-w-0 flex-1">
          <button type="button" onClick={() => setFilterOpen(true)} className="mb-5 inline-flex min-h-11 items-center gap-2 border border-[#D0C5AF] px-4 text-sm font-semibold text-[#4F4942] lg:hidden"><SlidersHorizontal size={18} /> Bộ lọc</button>
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-[#e8deca] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs uppercase tracking-widest text-[#5F5E5E]">
              Showing {products.length} of {total} products
            </p>

            <label className="flex min-w-0 items-center justify-between gap-3 sm:justify-end">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#8A8176]">
                Sắp xếp
              </span>

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="min-w-0 flex-1 border border-[#e8deca] bg-[#FDF9F4] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[#4F4942] outline-none transition hover:border-[#735C00] focus:border-[#735C00] sm:w-[190px] sm:flex-none sm:px-4 sm:tracking-[0.16em]"
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
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="uppercase text-xs text-[#735C00] disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter((item) => {
                if (totalPages <= 5) return true;
                return item === 1 || item === totalPages || Math.abs(item - page) <= 1;
              })
              .map((item, index, array) => (
                <span key={item} className="flex items-center gap-8">
                  {index > 0 && item - array[index - 1] > 1 && (
                    <span className="text-gray-400">...</span>
                  )}

                  <button
                    type="button"
                    onClick={() => setPage(item)}
                    className={
                      item === page
                        ? "text-[#735C00] font-bold"
                        : "text-[#4F4942] hover:text-[#735C00]"
                    }
                  >
                    {item}
                  </button>
                </span>
              ))}

            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
              className="uppercase text-xs text-[#735C00] disabled:text-gray-400 disabled:cursor-not-allowed"
            >
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
