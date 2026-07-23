import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import Footer from "../components/Footer";
import BrandJournal from "./BrandJournal";
import { toast } from "../store/toast.store";
import { BLOG_ARTICLES, ARCHETYPES, type BlogArticle } from "./blogData";

interface Archetype {
  name: string;
  image: string;
  slug: string; // slug bài viết tương ứng
}

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
};

type ProductListResponse = {
  data: ProductListItem[];
};
type BlogListResponse = {
  data: BlogArticle[];
};

const fallbackArchetypes: Archetype[] = [
  {
    name: "Smoked Vetiver",
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80",
    slug: "archetype-smoked-vetiver",
  },
  {
    name: "Ancient Resin",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80",
    slug: "archetype-ancient-resin",
  },
  {
    name: "Highland Lavender",
    image: "https://images.unsplash.com/photo-1490750967868-88df5691cc87?w=600&q=80",
    slug: "archetype-highland-lavender",
  },
  {
    name: "Bitter Bergamot",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80",
    slug: "archetype-bitter-bergamot",
  },
  {
    name: "Damask Rose",
    image: "https://images.unsplash.com/photo-1490750967868-88df5691cc87?w=600&q=80",
    slug: "archetype-damask-rose",
  },
  {
    name: "Sandalwood",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80",
    slug: "archetype-sandalwood",
  },
];

export default function Blog() {
  const [searchParams] = useSearchParams();
  const brandParam = searchParams.get("brand");
  const sliderRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [managedArticles, setManagedArticles] = useState<BlogArticle[] | null>(null);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    let mounted = true;
    api
      .get<ProductListResponse>("/products", {
        params: { limit: 12, sort: "newest" },
      })
      .then(({ data }) => {
        if (mounted) setProducts(Array.isArray(data.data) ? data.data : []);
      })
      .catch(() => {
        if (mounted) setProducts([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    api
      .get<BlogListResponse>("/blog")
      .then(({ data }) => {
        if (mounted) setManagedArticles(Array.isArray(data.data) ? data.data : []);
      })
      .catch(() => {
        if (mounted) setManagedArticles([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Archetypes: mỗi item có slug trỏ tới bài viết /blog/:slug
  const archetypes = ARCHETYPES.length ? ARCHETYPES : fallbackArchetypes;

  // Article grid: 5 bài tĩnh + bổ sung product nếu thiếu, tối đa 6
  const articles = useMemo(() => {
    const fromProducts = products.slice(0, 3).map((p, i) => ({
      id: 100 + i,
      slug: p.slug || p.id,
      category: p.fragranceFamily || p.category || p.brand || "Scent journal",
      title: p.name,
      description:
        p.description ||
        `A closer look at ${p.name}, its mood, character, and olfactory structure.`,
      image:
        p.images?.[0] ||
        p.image ||
        fallbackArchetypes[i % fallbackArchetypes.length].image,
      heroImage: "",
      date: "",
      readTime: "",
      author: p.brand || "",
      sections: [],
      relatedSlugs: [],
      isProduct: true,
    }));

    // Ưu tiên bài viết tĩnh; ghép thêm product nếu chưa đủ 6
    const managed = managedArticles?.length ? managedArticles : BLOG_ARTICLES;
    const merged = [...managed, ...fromProducts].slice(0, 6);
    return merged;
  }, [managedArticles, products]);

  const scrollArchetypes = (dir: "left" | "right") => {
    sliderRef.current?.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  // Cuộn chuột dọc trong phạm vi card -> chuyển card sang trái / phải.
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (event.deltaY === 0) return;
      event.preventDefault();
      el.scrollBy({ left: event.deltaY * 1.4, behavior: "smooth" });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.error("Email không hợp lệ");
      return;
    }
    try {
      setSubscribing(true);
      await api.post("/blog/subscribe", { email: normalizedEmail });
      toast.success("Đã đăng ký nhận journal");
      setEmail("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể đăng ký nhận journal lúc này");
    } finally {
      setSubscribing(false);
    }
  };

  // Nếu có ?brand=... -> hiển thị trang tin riêng của brand đó
  if (brandParam) {
    return <BrandJournal brand={brandParam} />;
  }

  return (
    <>
      <main className="overflow-hidden bg-[#FCF9F4] text-[#211F1B]">
        {/* HERO */}
        <section className="px-6 pb-16 pt-16 sm:px-10 lg:px-16 lg:pb-24 lg:pt-24">
          <div className="mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-[1.08fr_0.72fr]">
            <div>
              <p className="mb-6 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#937B1D]">
                The curator&apos;s journal
              </p>
              <h1
                className="max-w-[650px] text-[58px] leading-[1.02] tracking-[-0.04em] sm:text-[72px] lg:text-[86px]"
                style={{ fontFamily: "'Cormorant Garamond', 'Spectral', serif" }}
              >
                Notes on the
                <br />
                Ephemeral.
              </h1>
              <p className="mt-8 max-w-[590px] text-sm leading-7 text-[#6B6861]">
                An editorial exploration into the architecture of scent, the
                poetry of raw ingredients, and the invisible threads that bind
                memory to fragrance.
              </p>
            </div>

            <div className="mx-auto w-full max-w-[390px] overflow-hidden bg-[#2D2D2D]">
              <img
                src="https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=800&q=80"
                alt="Editorial perfume bottle"
                className="aspect-[0.78/1] h-full w-full object-cover grayscale"
              />
            </div>
          </div>
        </section>

        {/* FEATURED STORIES */}
        <section className="px-6 pb-20 sm:px-10 lg:px-16 lg:pb-28">
          <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[1.55fr_0.65fr]">
            {/* Featured left */}
            <article className="group">
              <Link to={`/blog/${articles[2]?.slug || BLOG_ARTICLES[2].slug}`}>
                <div className="overflow-hidden bg-[#272727]">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS__htyuJgvZWWlJPkJTpMlgM6ej2uVAbxXjAnsUoiIEg&s=10"
                    alt="Endangered florals"
                    className="aspect-[1.45/1] w-full object-cover grayscale transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="pt-5">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#997F20]">
                    Sustainability
                  </p>
                  <h2
                    className="mt-3 text-[30px] leading-tight tracking-[-0.025em] lg:text-[35px]"
                    style={{ fontFamily: "'Cormorant Garamond', 'Spectral', serif" }}
                  >
                    The Ethics of Extraction: Preserving Endangered Florals
                  </h2>
                  <p className="mt-4 max-w-[720px] text-xs leading-5 text-[#706D66]">
                    A deep dive into our partnership with local conservatories to protect
                    rare botanical species through sustainable technology.
                  </p>
                  <span className="mt-5 inline-flex border-b border-[#AB9851] pb-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#675711]">
                    Read manuscript
                  </span>
                </div>
              </Link>
            </article>

            {/* Featured right */}
            <article className="flex flex-col bg-[#F1EEE8] p-7 lg:p-8">
              <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#92791D]">
                The process
              </p>
              <h2
                className="mt-4 text-[25px] leading-tight tracking-[-0.02em]"
                style={{ fontFamily: "'Cormorant Garamond', 'Spectral', serif" }}
              >
                In Conversation with our Master Nose: Jean-Pierre Volat
              </h2>
              <p className="mt-5 text-xs leading-5 text-[#68655F]">
                &ldquo;A fragrance is not a scent. It is a structure of time. I do not
                build top notes; I build memories that refuse to fade.&rdquo;
              </p>
              <div className="mt-8 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?w=800&q=80"
                  alt="Perfume laboratory"
                  className="aspect-[0.95/1] w-full object-cover grayscale"
                />
              </div>
              <Link
                to={`/blog/${articles[3]?.slug || BLOG_ARTICLES[3].slug}`}
                className="mt-6 inline-flex w-max border-b border-[#AB9851] pb-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#675711]"
              >
                Read the science
              </Link>
            </article>
          </div>
        </section>

        {/* ARCHETYPES SLIDER — link tới trang bài viết chi tiết /blog/:slug */}
        <section className="bg-[#F0EDE8] px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <h2
                  className="text-3xl tracking-[-0.02em] lg:text-[38px]"
                  style={{ fontFamily: "'Cormorant Garamond', 'Spectral', serif" }}
                >
                  Olfactory Archetypes
                </h2>
                <p className="mt-1 text-[8px] uppercase tracking-[0.15em] text-[#A19D94]">
                  Explore our palette of raw materials
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  aria-label="Scroll left"
                  onClick={() => scrollArchetypes("left")}
                  className="flex h-10 w-10 items-center justify-center border border-[#D4CDC0] transition hover:bg-[#201F1B] hover:text-white"
                >
                  <ArrowLeft size={16} strokeWidth={1.4} />
                </button>
                <button
                  type="button"
                  aria-label="Scroll right"
                  onClick={() => scrollArchetypes("right")}
                  className="flex h-10 w-10 items-center justify-center border border-[#D4CDC0] transition hover:bg-[#201F1B] hover:text-white"
                >
                  <ArrowRight size={16} strokeWidth={1.4} />
                </button>
              </div>
            </div>

            <div
              ref={sliderRef}
              className="flex snap-x gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {archetypes.map((item) => (
                // ← Link tới trang bài viết chi tiết của archetype đó
                <Link
                  key={item.name}
                  to={`/blog/${item.slug}`}
                  className="group relative min-w-[230px] snap-start overflow-hidden sm:min-w-[260px]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="aspect-[0.75/1] w-full object-cover grayscale transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-5 pb-5 pt-20">
                    <h3
                      className="text-xl text-white"
                      style={{ fontFamily: "'Cormorant Garamond', 'Spectral', serif" }}
                    >
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-white/50">
                      Đọc câu chuyện →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ARTICLE GRID — tất cả link tới /blog/:slug */}
        <section className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto grid max-w-[1060px] gap-x-10 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => {
              const isProduct =
                "isProduct" in article && (article as Record<string, unknown>).isProduct;
              // Bài tĩnh → /blog/:slug | Product → /products/:slug
              const href = isProduct ? `/products/${article.slug}` : `/blog/${article.slug}`;
              const cta = isProduct ? "View fragrance" : "Read article";

              return (
                <Link key={article.id} to={href} className="group block">
                  <div className="overflow-hidden bg-[#EEEAE4]">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="aspect-[1/1.05] w-full object-cover grayscale transition duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="pt-5">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#9B8125]">
                      {article.category}
                    </p>
                    <h2
                      className="mt-3 text-[25px] leading-[1.15] tracking-[-0.02em]"
                      style={{ fontFamily: "'Cormorant Garamond', 'Spectral', serif" }}
                    >
                      {article.title}
                    </h2>
                    <p className="mt-4 text-xs leading-5 text-[#706D66]">
                      {article.description}
                    </p>
                    <span className="mt-5 inline-flex border-b border-[#AB9851] pb-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#675711]">
                      {cta}
                    </span>
                  </div>
                </Link>
              );
            })}

            {/* SUBSCRIBE CARD */}
            <aside className="flex min-h-[410px] flex-col items-center justify-center bg-[#F0EDE8] p-9 text-center">
              <p
                className="text-[28px] leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', 'Spectral', serif" }}
              >
                Receive the Printed
                <br />
                Journal
              </p>
              <p className="mt-5 max-w-[250px] text-xs leading-5 text-[#706D66]">
                A quarterly publication delivered to your doorstep.
                Complimentary for our Inner Circle members.
              </p>
              <form onSubmit={handleSubscribe} className="mt-8 w-full max-w-[260px]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="YOUR EMAIL ADDRESS"
                  className="w-full border-b border-[#D2C9B7] bg-transparent py-3 text-center text-[8px] uppercase tracking-[0.14em] outline-none placeholder:text-[#A9A59D]"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="mt-5 w-full bg-[#8B7200] px-5 py-3 text-[8px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#6F5C00]"
                >
                  {subscribing ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
