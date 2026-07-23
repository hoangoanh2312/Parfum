import ShopSidebar from "../components/Shop/ShopSidebar";
import ProductGrid from "../components/Shop/ProductGrid";
import Pagination from "../components/Shop/Pagination";
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

type ProductFilters = {
  brands: string[];
  fragranceFamilies: string[];
  notes?: string[];
  concentrations: string[];
  genders: string[];
  seasons: string[];
  categories: string[];
  sizes: string[];
  maxPrice: number;
  minPrice?: number;
  brandCounts?: Record<string, number>;
  priceBuckets?: number[];
  total: number;
};

const getSizeNumber = (size: string) => {
  const match = size.match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
};

const normBrand = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");

const normFilter = (value: string) => value.trim().toLowerCase();

// 4 cot x 3 hang = 12 san pham / trang; so trang tang theo so luong san pham
const PAGE_SIZE = 12;

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [productTotal, setProductTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<ProductFilters | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedScents, setSelectedScents] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedConcentrations, setSelectedConcentrations] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(Number.MAX_SAFE_INTEGER);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleSize = (value: string) => {
    setSelectedSizes((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
    );
  };
  const toggleOccasion = (value: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
    );
  };
  const toggleConcentration = (value: string) => {
    setSelectedConcentrations((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
    );
  };
  const toggleScent = (value: string) => {
    setSelectedScents((prev) =>
      prev.some((item) => normFilter(item) === normFilter(value))
        ? prev.filter((item) => normFilter(item) !== normFilter(value))
        : [...prev, value],
    );
  };

  useEffect(() => {
    const nextSearch = searchParams.get("search") || "";
    const nextBrand = searchParams.get("brand") || "";
    const nextScent = searchParams.get("scent") || "";
    const nextSeason = searchParams.get("season") || "";
    const nextGender = searchParams.get("gender") || "";
    const nextSort = searchParams.get("sort") || "";

    setSearch(nextSearch);
    setSelectedBrands(nextBrand ? [nextBrand] : []);
    setSelectedScents(
      nextScent
        ? nextScent.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
    );
    setSelectedSeasons(
      nextSeason
        ? nextSeason.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
    );
    setSelectedGenders(
      nextGender
        ? nextGender.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
    );
    if (nextSort) setSort(nextSort);
  }, [searchParams]);

  // Facet loc lay tu TOAN BO san pham trong MongoDB (khong bi gioi han 100)
  useEffect(() => {
    let active = true;
    async function loadFilterOptions() {
      try {
        const { data } = await api.get<ProductFilters>("/products/filters");
        if (active) setFilters(data);
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
            page,
            limit: PAGE_SIZE,
            search: search || undefined,
            brand: selectedBrands.join(",") || undefined,
            gender: selectedGenders.join(",") || undefined,
            scent: selectedScents.join(",") || undefined,
            size: selectedSizes.join(",") || undefined,
            season:
              [...selectedOccasions, ...selectedSeasons].join(",") ||
              undefined,
            concentration: selectedConcentrations.join(",") || undefined,
            minPrice:
              priceMin > (filters?.minPrice ?? 0) ? priceMin : undefined,
            maxPrice:
              priceMax !== Number.MAX_SAFE_INTEGER &&
              priceMax < (filters?.maxPrice ?? Number.MAX_SAFE_INTEGER)
                ? priceMax
                : undefined,
            sort,
          },
        });
        if (active) {
          setProducts(data.data);
          setProductTotal(data.total);
          setTotalPages(Math.max(1, data.totalPages));
          if (page > data.totalPages) setPage(Math.max(1, data.totalPages));
        }
      } catch (error) {
        console.error("Failed to load products", error);
        if (active) {
          setProducts([]);
          setProductTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (active) setLoading(false);
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
    priceMin,
    priceMax,
    sort,
    page,
  ]);

  // Cac lua chon filter deu lay tu facet MongoDB de dong bo ten & so luong
  const brands = useMemo(() => filters?.brands ?? [], [filters]);
  // Scent Profile CHỈ hiển thị nhóm hương (fragrance families) của sản phẩm,
  // không trộn lẫn các nốt hương lẻ để tránh nhầm với bộ lọc nhóm hương.
  const scents = useMemo(
    () =>
      Array.from(new Set(filters?.fragranceFamilies ?? [])).sort((left, right) =>
        left.localeCompare(right),
      ),
    [filters],
  );
  const concentrations = useMemo(() => filters?.concentrations ?? [], [filters]);
  const sizes = useMemo(
    () =>
      [...(filters?.sizes ?? [])].sort(
        (left, right) =>
          getSizeNumber(left) - getSizeNumber(right) || left.localeCompare(right),
      ),
    [filters],
  );
  const maxPrice = filters?.maxPrice ?? 0;
  const minPrice = filters?.minPrice ?? 0;
  const brandCounts = useMemo(() => filters?.brandCounts ?? {}, [filters]);
  const priceBuckets = useMemo(() => filters?.priceBuckets ?? [], [filters]);

  useEffect(() => {
    if (maxPrice > 0 && priceMax === Number.MAX_SAFE_INTEGER) {
      setPriceMin(minPrice);
      setPriceMax(maxPrice);
    }
  }, [maxPrice, minPrice, priceMax]);

  // Reset ve trang 1 khi doi bo loc / tim kiem / sap xep
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
    priceMin,
    priceMax,
    sort,
  ]);

  const currentPage = Math.min(page, totalPages);

  const changePage = (next: number) => {
    if (next < 1 || next > totalPages) return;
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.some((item) => normBrand(item) === normBrand(brand))
        ? prev.filter((item) => normBrand(item) !== normBrand(brand))
        : [...prev, brand],
    );
  };
  const toggleGender = (gender: string) => {
    setSelectedGenders((prev) => (prev.includes(gender) ? [] : [gender]));
  };

  return (
    <>
      <main className="bg-[#FDF9F4]">
        {/* Hero */}
        <section className="mx-auto max-w-[1536px] px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-heading text-[48px] leading-none text-[#1C1C19] sm:text-[64px] lg:text-[76px] xl:text-[88px]">
                The Seasonal
                <br />
                <span className="italic text-[#8A6D0E]">Archives</span>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#5F5E5E] sm:mt-8 sm:leading-8">
                A curated selection of olfactory experiences, from the smoky
                resins of the Orient to the dew-kissed petals of a Grasse
                morning.
              </p>
            </div>

              <div className="relative aspect-[16/10] min-h-[230px] overflow-hidden rounded-sm bg-[#0E0D0C] sm:h-[330px] sm:aspect-auto">
                <video
                  src="https://res.cloudinary.com/dwj2trmn0/video/upload/v1784437561/t%E1%BA%A1o_cho_t_video_gi%E1%BB%9Bi_thi%E1%BB%87u_m_fk3taq.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-90"
                />

              <div className="absolute left-6 bottom-8 text-[#E8E3D8]">
                <p className="text-[11px] tracking-[0.15em] uppercase leading-tight">
                  Amber Oud
                </p>
                <p className="text-[11px] tracking-[0.15em] uppercase leading-tight">
                  Rare Wood
                </p>
              </div>

              <div className="absolute bottom-3 left-4 right-4 text-right sm:left-auto sm:right-6">
                <p className="text-[8px] uppercase leading-4 tracking-[0.12em] text-[#B9B4A8] sm:text-[10px] sm:tracking-[0.2em]">
                  Issue No. 04 — Autumn/Winter
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto flex max-w-[1536px] min-w-0 gap-10 px-5 pb-20 sm:px-8 lg:gap-12 lg:px-10 xl:gap-16">
          <div className="hidden lg:block">
            <ShopSidebar
            search={search}
            setSearch={setSearch}
            brands={brands}
            selectedBrands={selectedBrands}
            toggleBrand={toggleBrand}
            genders={["female", "male", "unisex"]}
            selectedGenders={selectedGenders}
            toggleGender={toggleGender}
            clearGender={() => setSelectedGenders([])}
            priceMin={priceMin}
            priceMax={priceMax}
            minPrice={minPrice}
            maxPrice={maxPrice}
            setPriceRange={(lo, hi) => {
              setPriceMin(lo);
              setPriceMax(hi);
            }}
            brandCounts={brandCounts}
            priceBuckets={priceBuckets}
            selectedScents={selectedScents}
            scents={scents}
            toggleScent={toggleScent}
            selectedSizes={selectedSizes}
            sizes={sizes}
            toggleSize={toggleSize}
            selectedOccasions={selectedOccasions}
            occasions={filters?.seasons ?? []}
            toggleOccasion={toggleOccasion}
            selectedConcentrations={selectedConcentrations}
            concentrations={concentrations}
            toggleConcentration={toggleConcentration}
            />
          </div>

          {filterOpen && (
            <div className="fixed inset-0 z-[70] lg:hidden">
              <button type="button" className="absolute inset-0 bg-black/35" onClick={() => setFilterOpen(false)} aria-label="Đóng bộ lọc" />
              <div className="absolute inset-y-0 left-0 w-[min(340px,90vw)] overflow-y-auto bg-[#FDF9F4] px-5 pb-10 pt-5 shadow-2xl">
                <div className="mb-5 flex items-center justify-between border-b border-[#E4DACE] pb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#554C42]">Bộ lọc sản phẩm</p>
                  <button type="button" onClick={() => setFilterOpen(false)} className="flex h-10 w-10 items-center justify-center text-[#665D52]" aria-label="Đóng bộ lọc"><X size={19} /></button>
                </div>
                <ShopSidebar
                  search={search}
                  setSearch={setSearch}
                  brands={brands}
                  selectedBrands={selectedBrands}
                  toggleBrand={toggleBrand}
                  genders={["female", "male", "unisex"]}
                  selectedGenders={selectedGenders}
                  toggleGender={toggleGender}
                  clearGender={() => setSelectedGenders([])}
                  priceMin={priceMin}
                  priceMax={priceMax}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  setPriceRange={(lo, hi) => { setPriceMin(lo); setPriceMax(hi); }}
                  brandCounts={brandCounts}
                  priceBuckets={priceBuckets}
                  selectedScents={selectedScents}
                  scents={scents}
                  toggleScent={toggleScent}
                  selectedSizes={selectedSizes}
                  sizes={sizes}
                  toggleSize={toggleSize}
                  selectedOccasions={selectedOccasions}
                  occasions={filters?.seasons ?? []}
                  toggleOccasion={toggleOccasion}
                  selectedConcentrations={selectedConcentrations}
                  concentrations={concentrations}
                  toggleConcentration={toggleConcentration}
                />
              </div>
            </div>
          )}

          {/* Content */}
          <section className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 border-b border-[#e8deca] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-[10px] uppercase tracking-widest text-[#5F5E5E] sm:text-xs">
                Showing {products.length} of {productTotal} products
                </p>
                <button type="button" onClick={() => setFilterOpen(true)} className="flex h-10 w-full shrink-0 items-center justify-center gap-2 border border-[#D8CDBE] px-3 text-[10px] uppercase tracking-[0.12em] text-[#655B50] sm:w-auto lg:hidden">
                  <SlidersHorizontal size={15} /> Bộ lọc
                </button>
              </div>

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
                  <option value="best_selling">Bán chạy nhất</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                </select>
              </label>
            </div>

            {/* Grid 4 x 3 */}
            <ProductGrid products={products} loading={loading} />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={changePage}
            />
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}
