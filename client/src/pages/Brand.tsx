import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import Footer from "../components/Footer";
import { toast } from "../store/toast.store";
import { DEFAULT_BRANDS, type BrandItem } from "./brandData";

type MongoBrand = {
  _id?: string;
  id?: string;
  name: string;
};

const ITEMS_PER_PAGE = 6;

const defaultBrandImage = "/images/brand/signature-background.jpg";
const defaultBrandDescription =
  "A distinguished perfume house selected for its distinctive approach to scent, craft, and timeless olfactory character.";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function hydrateBrand(brand: MongoBrand, index: number): BrandItem {
  const name = brand.name.trim();
  const slug = slugify(name);
  const fallback = DEFAULT_BRANDS.find(
    (item) =>
      item.slug === slug || item.name.toLowerCase() === name.toLowerCase(),
  );

  return {
    id: brand._id || brand.id || `${slug}-${index}`,
    name,
    slug: name,
    image: fallback?.image || defaultBrandImage,
    description: fallback?.description || defaultBrandDescription,
  };
}

export default function Brand() {
  const [currentPage, setCurrentPage] = useState(1);
  const [brands, setBrands] = useState<BrandItem[]>(DEFAULT_BRANDS);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    let mounted = true;

    api
      .get<MongoBrand[]>("/brands")
      .then(({ data }) => {
        if (!mounted) return;

        const mongoBrands = data
          .map((brand, index) => hydrateBrand(brand, index))
          .filter((brand) => brand.name);

        setBrands(mongoBrands.length ? mongoBrands : DEFAULT_BRANDS);
        setCurrentPage(1);
      })
      .catch(() => {
        if (mounted) setBrands(DEFAULT_BRANDS);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const totalPages = Math.ceil(brands.length / ITEMS_PER_PAGE);

  const displayedBrands = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return brands.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [brands, currentPage]);

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Email không hợp lệ");
      return;
    }

    toast.success("Đã đăng ký nhận tin");
    setEmail("");
  };

  return (
    <>
      <main className="overflow-hidden bg-[#FCF9F4] text-[#201F1B]">
        {/* INTRO */}
        <section className="px-6 pb-10 pt-16 sm:px-10 lg:px-16 lg:pb-14 lg:pt-24">
          <div className="mx-auto max-w-[1420px]">
            <h1
              className="max-w-[580px] text-[58px] leading-[1.02] tracking-[-0.045em] sm:text-[72px] lg:text-[92px]"
              style={{ fontFamily: "'Spectral', serif" }}
            >
              Curated
              <br />
              Houses
            </h1>

            <p className="mt-8 max-w-[670px] text-sm leading-7 text-[#69665F] lg:mt-10">
              From the historic ateliers of Paris to the avant-garde
              laboratories of Stockholm, we present a collection of the
              world&apos;s most distinguished perfumeries. Each brand in our
              portfolio is selected for its architectural approach to scent and
              uncompromising commitment to the olfactory arts.
            </p>

            {loading && (
              <p className="mt-5 text-[9px] uppercase tracking-[0.18em] text-[#9B8125]">
                Đang tải thương hiệu từ MongoDB...
              </p>
            )}
          </div>
        </section>

        {/* BRAND GRID */}
        <section className="px-6 pb-16 sm:px-10 lg:px-16 lg:pb-24">
          <div className="mx-auto grid max-w-[1420px] gap-x-10 gap-y-16 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-12 xl:gap-y-20">
            {displayedBrands.map((brand) => (
              <div key={brand.id} className="group block">
                <div className="overflow-hidden bg-[#EFECE7]">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="aspect-[1.28/1] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
                  />
                </div>

                <div className="pt-6">
                  <h2
                    className="text-[28px] leading-none tracking-[-0.02em]"
                    style={{ fontFamily: "'Spectral', serif" }}
                  >
                    {brand.name}
                  </h2>

                  <p className="mt-4 min-h-[72px] max-w-[400px] text-xs leading-5 text-[#6E6A63]">
                    {brand.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                    <Link
                      to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                      className="inline-flex items-center border-b border-[#A8944B] pb-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#675711] transition hover:text-[#9A7C00]"
                    >
                      View collection
                    </Link>
                    <Link
                      to={`/blog?brand=${encodeURIComponent(brand.name)}`}
                      className="inline-flex items-center border-b border-transparent pb-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#9A8A63] transition hover:border-[#A8944B] hover:text-[#675711]"
                    >
                      Read journal
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PAGINATION */}
        <section className="px-6 pb-16 sm:px-10 lg:px-16 lg:pb-20">
          <div className="mx-auto flex max-w-[800px] items-center justify-center border-t border-[#E1DDD5] pt-7">
            <button
              type="button"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="mr-7 text-[8px] uppercase tracking-[0.18em] text-[#A29D91] transition hover:text-[#756000] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Previous
            </button>

            <div className="flex items-center gap-5">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                const active = currentPage === page;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => changePage(page)}
                    className={`border-b pb-1 text-[9px] transition ${
                      active
                        ? "border-[#8B7419] text-[#8B7419]"
                        : "border-transparent text-[#817D75] hover:text-[#8B7419]"
                    }`}
                  >
                    {String(page).padStart(2, "0")}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-7 text-[8px] uppercase tracking-[0.18em] text-[#8B7419] transition hover:text-[#4D410F] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Next
            </button>
          </div>
        </section>

        {/* CTA */}
        <section className="relative min-h-[470px] overflow-hidden">
          <img
            src="/images/brand/signature-background.jpg"
            alt="Golden fragrance background"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/20" />

          <div className="relative z-10 flex min-h-[470px] flex-col items-center justify-center px-6 py-20 text-center text-white">
            <h2
              className="text-[48px] leading-none tracking-[-0.035em] sm:text-[60px] lg:text-[72px]"
              style={{ fontFamily: "'Spectral', serif" }}
            >
              Your Signature Awaits
            </h2>

            <div className="mt-10 flex w-full max-w-[430px] flex-col justify-center gap-3 sm:flex-row sm:gap-0">
              <Link
                to="/shop"
                className="inline-flex min-h-12 flex-1 items-center justify-center bg-[#FCF9F4] px-7 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#28251F] transition hover:bg-white"
              >
                Find your scent
              </Link>

              <Link
                to="/about"
                className="inline-flex min-h-12 flex-1 items-center justify-center border border-white/60 bg-transparent px-7 text-[8px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#28251F]"
              >
                Private consultation
              </Link>
            </div>
          </div>
        </section>

        {/* MOBILE NEWSLETTER */}
        <section className="border-b border-[#E6E1D9] px-6 py-16 text-center lg:hidden">
          <h2 className="text-3xl" style={{ fontFamily: "'Spectral', serif" }}>
            Join the Editorial
          </h2>

          <form
            onSubmit={handleSubscribe}
            className="mx-auto mt-7 flex max-w-sm items-center border-b border-[#D6CEBC]"
          >
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="YOUR EMAIL ADDRESS"
              className="min-w-0 flex-1 bg-transparent py-4 text-[8px] tracking-[0.15em] outline-none placeholder:text-[#A8A49B]"
            />

            <button
              type="submit"
              aria-label="Subscribe"
              className="px-2 text-[#8B7419]"
            >
              <ArrowRight size={17} strokeWidth={1.4} />
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
