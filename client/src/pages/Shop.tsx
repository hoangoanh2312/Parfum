import ShopSidebar from "../components/Shop/ShopSidebar";
import ProductCard, { ProductCardData } from "../components/ProductCard";
import Footer from "../components/Footer";
import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

// Map label hiển thị (Women/Men/Unisex) -> giá trị field gender trong DB
const GENDER_MAP: Record<string, string> = {
  Women: "female",
  Men: "male",
  Unisex: "unisex",
};

export default function Shop() {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc">("newest");

  // maxPrice tính động từ dữ liệu thật (giá VND, hàng triệu) để slider không lọc sạch
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 5000000;
    const top = Math.max(...products.map((p) => p.price || 0));
    return Math.ceil(top / 1000000) * 1000000 || 5000000;
  }, [products]);
  const [price, setPrice] = useState<number>(maxPrice);

  // Load dữ liệu THẬT từ MongoDB qua API (không dùng dữ liệu giả)
  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get("/products", { params: { limit: 100 } })
      .then(({ data }) => {
        if (!active) return;
        setProducts(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.response?.data?.message || "Không tải được sản phẩm");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // Danh sách brand lấy từ dữ liệu thật (rút trích unique)
  const brandOptions = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set);
  }, [products]);

  const genderOptions = ["Women", "Men", "Unisex"];

  const toggleBrand = (brand: string) =>
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((i) => i !== brand) : [...prev, brand],
    );

  const toggleGender = (gender: string) =>
    setSelectedGenders((prev) =>
      prev.includes(gender) ? prev.filter((i) => i !== gender) : [...prev, gender],
    );

  // Lọc + sort client-side theo search / brand / gender / price
  const filtered = useMemo(() => {
    const result = products.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchBrand =
        selectedBrands.length === 0 || (p.brand && selectedBrands.includes(p.brand));
      // Map "Women/Men/Unisex" -> "female/male/unisex" theo field gender thật
      const matchGender =
        selectedGenders.length === 0 ||
        selectedGenders.some((g) => p.gender === GENDER_MAP[g]);
      const matchPrice = (p.price || 0) <= price;
      return matchSearch && matchBrand && matchGender && matchPrice;
    });

    if (sort === "price_asc") result.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sort === "price_desc") result.sort((a, b) => (b.price || 0) - (a.price || 0));
    // newest: giữ nguyên thứ tự từ API (mới nhất trước)

    return result;
  }, [products, search, selectedBrands, selectedGenders, price, sort]);

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
            brands={brandOptions}
            selectedBrands={selectedBrands}
            toggleBrand={toggleBrand}
            genders={genderOptions}
            selectedGenders={selectedGenders}
            toggleGender={toggleGender}
            price={price}
            maxPrice={maxPrice}
            setPrice={setPrice}
          />

          {/* Content */}
          <section className="flex-1">
            {/* Toolbar */}
            <div className="flex justify-between border-b pb-5 border-[#e8deca]">
              <p className="uppercase text-xs tracking-widest text-[#5F5E5E]">
                {loading
                  ? "Đang tải..."
                  : `Showing ${filtered.length} products`}
              </p>

              <select
                className="uppercase text-xs tracking-widest bg-transparent outline-none"
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
              </select>
            </div>

            {/* Grid */}
            {loading ? (
              <p className="mt-10 text-[#5F5E5E]">Đang tải sản phẩm...</p>
            ) : !loading && error && products.length === 0 ? (
              <p className="mt-10 text-red-500">{error}</p>
            ) : filtered.length === 0 ? (
              <p className="mt-10 text-[#5F5E5E]">
                Không tìm thấy sản phẩm phù hợp.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10">
                {filtered.map((product) => (
                  <ProductCard key={product.id} item={product} />
                ))}
              </div>
            )}
            {/* Pagination */}
            <div className="border-t mt-16 pt-8 flex justify-center items-center gap-8">
              <button className="uppercase text-xs text-gray-400">Previous</button>
              <button className="text-[#735C00] font-bold">1</button>
              <button>2</button>
              <button>3</button>
              <button className="uppercase text-xs text-[#735C00]">Next</button>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}
