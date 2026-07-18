import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { api } from "../lib/api";
import Footer from "../components/Footer";

type ProductListItem = {
  id: string;
  slug?: string;
  name: string;
  brand?: string;
  category?: string;
  description?: string;
  image?: string | null;
  images?: string[];
  fragranceFamily?: string;
  concentration?: string;
  priceText?: string;
};

type ProductListResponse = {
  data: ProductListItem[];
  total: number;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80";

// Trang "tin của brand": bài viết/journal cho một thương hiệu,
// nội dung sinh từ chính sản phẩm của brand đó trong MongoDB.
export default function BrandJournal({ brand }: { brand: string }) {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .get<ProductListResponse>("/products", {
        params: { brand, limit: 100, sort: "newest" },
      })
      .then(({ data }) => {
        if (!mounted) return;
        setProducts(Array.isArray(data.data) ? data.data : []);
        setTotal(data.total ?? (data.data ? data.data.length : 0));
      })
      .catch(() => {
        if (mounted) {
          setProducts([]);
          setTotal(0);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [brand]);

  const heroImage = useMemo(
    () => products[0]?.images?.[0] || products[0]?.image || FALLBACK_IMAGE,
    [products],
  );

  const families = useMemo(() => {
    const set = new Set<string>();
    products.forEach((product) => {
      if (product.fragranceFamily) set.add(product.fragranceFamily);
    });
    return Array.from(set);
  }, [products]);

  return (
    <>
      <main className="overflow-hidden bg-[#FCF9F4] text-[#211F1B]">
        {/* HERO */}
        <section className="relative min-h-[420px] overflow-hidden bg-[#1a1714]">
          <img
            src={heroImage}
            alt={brand}
            className="absolute inset-0 h-full w-full object-cover opacity-55 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b08]/85 via-transparent to-transparent" />
          <div className="relative z-10 mx-auto flex min-h-[420px] max-w-[1180px] flex-col justify-end px-6 pb-14 sm:px-10 lg:px-16">
            <Link
              to="/brand"
              className="mb-6 inline-flex w-max items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#E7DFD0]/80 transition hover:text-white"
            >
              <ArrowLeft size={13} strokeWidth={1.5} />
              Curated Houses
            </Link>
            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C9A84C]">
              House Journal
            </p>
            <h1
              className="text-[46px] leading-[1.02] tracking-[-0.03em] text-[#F4EFE6] sm:text-[64px] lg:text-[80px]"
              style={{ fontFamily: "'Cormorant Garamond', 'Spectral', serif" }}
            >
              {brand}
            </h1>
            <p className="mt-5 max-w-[620px] text-sm leading-7 text-[#E7DFD0]/75">
              Khám phá câu chuyện, triết lý sáng tạo và toàn bộ tác phẩm của nhà
              {" "}
              {brand} hiện có tại cửa hàng.
            </p>
          </div>
        </section>

        {/* INTRO / STATS */}
        <section className="px-6 pt-14 sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1.4fr_0.6fr]">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#937B1D]">
                The House of {brand}
              </p>
              <h2
                className="mt-4 max-w-[640px] text-[30px] leading-tight tracking-[-0.02em] sm:text-[38px]"
                style={{ fontFamily: "'Cormorant Garamond', 'Spectral', serif" }}
              >
                Những sáng tạo định hình phong cách của {brand}.
              </h2>
              <p className="mt-5 max-w-[640px] text-sm leading-7 text-[#6B6861]">
                Mỗi chai hương của {brand} là một chương trong câu chuyện olfactory
                riêng biệt. Dưới đây là tuyển tập được lấy trực tiếp từ kho dữ
                liệu của chúng tôi.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-4 border-l border-[#E1DDD5] pl-8">
              <div>
                <p
                  className="text-[40px] leading-none text-[#8B7419]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {loading ? "—" : total}
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#A19D94]">
                  Fragrances in stock
                </p>
              </div>
              {families.length > 0 && (
                <div>
                  <p className="text-sm text-[#44413C]">{families.join(" · ")}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#A19D94]">
                    Olfactive families
                  </p>
                </div>
              )}
              <Link
                to={`/shop?brand=${encodeURIComponent(brand)}`}
                className="mt-2 inline-flex w-max items-center gap-2 border-b border-[#A8944B] pb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#675711] transition hover:text-[#9A7C00]"
              >
                Shop the collection
                <ArrowRight size={13} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>

        {/* ARTICLES / PRODUCT STORIES */}
        <section className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1180px]">
            {loading ? (
              <p className="text-sm text-[#6B6861]">Đang tải tin của {brand}...</p>
            ) : products.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center border border-[#E2DBD2] bg-[#FFFDF9] text-center">
                <h3
                  className="text-3xl"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Chưa có bài viết cho {brand}
                </h3>
                <p className="mt-3 max-w-md text-sm text-[#706D66]">
                  Hiện chưa có sản phẩm nào của thương hiệu này trong kho. Vui lòng
                  quay lại sau.
                </p>
                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center gap-2 border border-[#8B7200] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6F5C00] transition hover:bg-[#8B7200] hover:text-white"
                >
                  Xem toàn bộ cửa hàng
                </Link>
              </div>
            ) : (
              <div className="grid gap-x-10 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => {
                  const image =
                    product.images?.[0] || product.image || FALLBACK_IMAGE;
                  return (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug || product.id}`}
                      className="group block"
                    >
                      <div className="overflow-hidden bg-[#EEEAE4]">
                        <img
                          src={image}
                          alt={product.name}
                          className="aspect-[1/1.05] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                        />
                      </div>
                      <div className="pt-5">
                        <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#9B8125]">
                          {product.fragranceFamily ||
                            product.category ||
                            "Scent journal"}
                        </p>
                        <h2
                          className="mt-3 text-[25px] leading-[1.15] tracking-[-0.02em]"
                          style={{
                            fontFamily:
                              "'Cormorant Garamond', 'Spectral', serif",
                          }}
                        >
                          {product.name}
                        </h2>
                        <p className="mt-4 line-clamp-3 text-xs leading-5 text-[#706D66]">
                          {product.description ||
                            `Một góc nhìn cận cảnh về ${product.name} — tâm trạng, cá tính và cấu trúc hương.`}
                        </p>
                        <span className="mt-5 inline-flex border-b border-[#AB9851] pb-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#675711]">
                          View fragrance
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
