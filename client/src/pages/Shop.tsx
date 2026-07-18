import ShopSidebar from "../components/Shop/ShopSidebar";
import ProductGrid from "../components/Shop/ProductGrid";
import Pagination from "../components/Shop/Pagination";
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

type ProductFilters = {
  brands: string[];
  fragranceFamilies: string[];
  concentrations: string[];
  genders: string[];
  seasons: string[];
  categories: string[];
  sizes: string[];
  maxPrice: number;
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

// 4 cot x 3 hang = 12 san pham / trang; so trang tang theo so luong san pham
const PAGE_SIZE = 12;

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
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
  const [price, setPrice] = useState(Number.MAX_SAFE_INTEGER);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

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
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
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
            page: 1,
            limit: 100,
            search: search || undefined,
            brand: selectedBrands.join(",") || undefined,
            gender: selectedGenders.join(",") || undefined,
            scent: selectedScents.join(",") || undefined,
            size: selectedSizes.join(",") || undefined,
            season:
              [...selectedOccasions, ...selectedSeasons].join(",") ||
              undefined,
            concentration: selectedConcentrations.join(",") || undefined,
            maxPrice: price === Number.MAX_SAFE_INTEGER ? undefined : price,
            sort,
          },
        });
        if (active) setProducts(data.data);
      } catch (error) {
        console.error("Failed to load products", error);
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
    price,
    sort,
  ]);

  // Cac lua chon filter deu lay tu facet MongoDB de dong bo ten & so luong
  const brands = useMemo(() => filters?.brands ?? [], [filters]);
  const scents = useMemo(() => filters?.fragranceFamilies ?? [], [filters]);
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

  useEffect(() => {
    if (maxPrice > 0 && price === Number.MAX_SAFE_INTEGER) {
      setPrice(maxPrice);
    }
  }, [maxPrice, price]);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch = product.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesBrand =
          selectedBrands.length === 0 ||
          (product.brand
            ? selectedBrands.some(
                (brand) => normBrand(brand) === normBrand(product.brand!),
              )
            : false);
        const matchesGender =
          selectedGenders.length === 0 ||
          (product.gender ? selectedGenders.includes(product.gender) : false);
        const matchesScent =
          selectedScents.length === 0 ||
          selectedScents.some(
            (scent) =>
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
            product.season?.includes(occasion),
          );
        const matchesSeason =
          selectedSeasons.length === 0 ||
          selectedSeasons.some((season) => product.season?.includes(season));
        const matchesConcentration =
          selectedConcentrations.length === 0 ||
          (product.concentration
            ? selectedConcentrations.includes(product.concentration)
            : false);
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
    price,
    sort,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = useMemo(
    () =>
      filteredProducts.slice(
        (currentPage - 1) * PAGE_SIZE,
        (currentPage - 1) * PAGE_SIZE + PAGE_SIZE,
      ),
    [filteredProducts, currentPage],
  );

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
    setSelectedGenders([gender]);
  };

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
                <span className="italic text-[#8A6D0E]">Archives</span>
              </h1>

              <p className="mt-8 max-w-md text-[#5F5E5E] leading-8">
                A curated selection of olfactory experiences, from the smoky
                resins of the Orient to the dew-kissed petals of a Grasse
                morning.
              </p>
            </div>

            <div className="relative bg-[#0E0D0C] h-[330px] rounded-sm overflow-hidden">
              <img
                src="https://res.cloudinary.com/dwj2trmn0/image/upload/v1784370620/Gemini_Generated_Image_b00ra5b00ra5b00r_hqe2zp.png"
                alt=""
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

              <div className="absolute right-6 bottom-3">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#B9B4A8]">
                  Issue No. 04 — Autumn/Winter
                </p>
              </div>
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
            genders={["female", "male", "unisex"]}
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
            occasions={filters?.seasons ?? []}
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
                Showing {paginatedProducts.length} of {filteredProducts.length} products
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

            {/* Grid 4 x 3 */}
            <ProductGrid products={paginatedProducts} loading={loading} />

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
