import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import Footer from "../components/Footer";
import { toast } from "../store/toast.store";

interface Archetype {
  name: string;
  image: string;
}

interface Article {
  id: number;
  category: string;
  title: string;
  description: string;
  image: string;
  slug?: string;
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

const fallbackArchetypes: Archetype[] = [
  {
    name: "Smoked Vetiver",
    image: "/images/blog/smoked-vetiver.jpg",
  },
  {
    name: "Ancient Resin",
    image: "/images/blog/ancient-resin.jpg",
  },
  {
    name: "Highland Lavender",
    image: "/images/blog/highland-lavender.jpg",
  },
  {
    name: "Bitter Bergamot",
    image: "/images/blog/bitter-bergamot.jpg",
  },
  {
    name: "Damask Rose",
    image: "/images/blog/damask-rose.jpg",
  },
  {
    name: "Sandalwood",
    image: "/images/blog/sandalwood.jpg",
  },
];

const fallbackArticles: Article[] = [
  {
    id: 1,
    category: "Art & Olfaction",
    title: "Visualizing the Invisible: The Synesthesia Project",
    description:
      "Can you see a scent? We collaborate with three digital artists to translate our latest collection into visual symphonies.",
    image: "/images/blog/article-bottle.jpg",
  },
  {
    id: 2,
    category: "Space",
    title: "Scenting Brutalism: The Architecture of Cold Air",
    description:
      "Exploring how mineral notes of concrete and cold metal can evoke a sense of grounding peace in modern living.",
    image: "/images/blog/article-architecture.jpg",
  },
  {
    id: 3,
    category: "Sustainability",
    title: "The Ethics of Extraction: Preserving Endangered Florals",
    description:
      "A deep dive into our partnership with local conservatories to protect rare botanical species through sustainable technology.",
    image: "/images/blog/article-flowers.jpg",
  },
  {
    id: 4,
    category: "Science",
    title: "The Molecular Poetry of Cedarwood",
    description:
      "Understanding the chemistry that makes wood the backbone of the world's most enduring fragrances.",
    image: "/images/blog/article-wave.jpg",
  },
  {
    id: 5,
    category: "Lifestyle",
    title: "The Lost Art of Scented Correspondence",
    description:
      "Why the intimacy of a perfumed envelope remains one of history's most powerful gestures of connection.",
    image: "/images/blog/article-letter.jpg",
  },
];

export default function Blog() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [email, setEmail] = useState("");

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

  const archetypes = useMemo(() => {
    const seen = new Set<string>();
    const items = products
      .filter(
        (product) =>
          product.fragranceFamily && !seen.has(product.fragranceFamily),
      )
      .map((product) => {
        seen.add(product.fragranceFamily || "");

        return {
          name: product.fragranceFamily || product.name,
          image:
            product.images?.[0] ||
            product.image ||
            fallbackArchetypes[seen.size % fallbackArchetypes.length].image,
        };
      });

    return items.length ? items : fallbackArchetypes;
  }, [products]);

  const articles = useMemo(() => {
    const items = products.slice(0, 5).map((product, index) => ({
      id: index + 1,
      category:
        product.fragranceFamily ||
        product.category ||
        product.brand ||
        "Scent journal",
      title: product.name,
      description:
        product.description ||
        `A closer look at ${product.name}, its mood, character, and olfactory structure.`,
      image:
        product.images?.[0] ||
        product.image ||
        fallbackArticles[index % fallbackArticles.length].image,
      slug: product.slug || product.id,
    }));

    return items.length
      ? items
      : fallbackArticles.map((article) => ({ ...article, slug: "" }));
  }, [products]);

  const scrollArchetypes = (direction: "left" | "right") => {
    const slider = sliderRef.current;

    if (!slider) return;

    slider.scrollBy({
      left: direction === "right" ? 320 : -320,
      behavior: "smooth",
    });
  };

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Email không hợp lệ");
      return;
    }

    toast.success("Đã đăng ký nhận journal");
    setEmail("");
  };

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
                style={{ fontFamily: "'Spectral', serif" }}
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
                src="/images/blog/blog-hero.jpg"
                alt="Editorial perfume bottle"
                className="aspect-[0.78/1] h-full w-full object-cover grayscale"
              />
            </div>
          </div>
        </section>

        {/* FEATURED STORIES */}
        <section className="px-6 pb-20 sm:px-10 lg:px-16 lg:pb-28">
          <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[1.55fr_0.65fr]">
            <article className="group">
              <div className="overflow-hidden bg-[#272727]">
                <img
                  src="/images/blog/featured-rose.jpg"
                  alt="Damask rose plant"
                  className="aspect-[1.45/1] w-full object-cover grayscale transition duration-700 group-hover:scale-[1.03]"
                />
              </div>

              <div className="pt-5">
                <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#997F20]">
                  Ingredient focus
                </p>

                <h2
                  className="mt-3 text-[30px] leading-tight tracking-[-0.025em] lg:text-[35px]"
                  style={{ fontFamily: "'Spectral', serif" }}
                >
                  The Sanguine Heart: Sourcing Damask Rose at Dawn
                </h2>

                <p className="mt-4 max-w-[720px] text-xs leading-5 text-[#706D66]">
                  Every harvest begins before the sun breaks the horizon. We
                  travel to the valleys of Bulgaria to witness the fleeting
                  moment when the rose&apos;s essential oils are at their
                  zenith.
                </p>

                <Link
                  to="/shop?scent=Floral"
                  className="mt-5 inline-flex border-b border-[#AB9851] pb-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#675711]"
                >
                  Read manuscript
                </Link>
              </div>
            </article>

            <article className="flex flex-col bg-[#F1EEE8] p-7 lg:p-8">
              <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#92791D]">
                The process
              </p>

              <h2
                className="mt-4 text-[25px] leading-tight tracking-[-0.02em]"
                style={{ fontFamily: "'Spectral', serif" }}
              >
                In Conversation with our Master Nose: Jean-Pierre Volat
              </h2>

              <p className="mt-5 text-xs leading-5 text-[#68655F]">
                “A fragrance is not a scent. It is a structure of time. I do not
                build top notes; I build memories that refuse to fade.”
              </p>

              <div className="mt-8 overflow-hidden">
                <img
                  src="/images/blog/featured-laboratory.jpg"
                  alt="Perfume laboratory"
                  className="aspect-[0.95/1] w-full object-cover grayscale"
                />
              </div>

              <Link
                to="/about"
                className="mt-6 inline-flex w-max border-b border-[#AB9851] pb-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#675711]"
              >
                Meet the house
              </Link>
            </article>
          </div>
        </section>

        {/* ARCHETYPES SLIDER */}
        <section className="bg-[#F0EDE8] px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <h2
                  className="text-3xl tracking-[-0.02em] lg:text-[38px]"
                  style={{ fontFamily: "'Spectral', serif" }}
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
                <Link
                  key={item.name}
                  to={`/shop?scent=${encodeURIComponent(item.name)}`}
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
                      style={{ fontFamily: "'Spectral', serif" }}
                    >
                      {item.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ARTICLE GRID */}
        <section className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto grid max-w-[1060px] gap-x-10 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={article.slug ? `/products/${article.slug}` : "/shop"}
                className="group block"
              >
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
                    style={{ fontFamily: "'Spectral', serif" }}
                  >
                    {article.title}
                  </h2>

                  <p className="mt-4 text-xs leading-5 text-[#706D66]">
                    {article.description}
                  </p>

                  <span className="mt-5 inline-flex border-b border-[#AB9851] pb-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#675711]">
                    View fragrance
                  </span>
                </div>
              </Link>
            ))}

            {/* SUBSCRIBE CARD */}
            <aside className="flex min-h-[410px] flex-col items-center justify-center bg-[#F0EDE8] p-9 text-center">
              <p
                className="text-[28px] leading-tight"
                style={{ fontFamily: "'Spectral', serif" }}
              >
                Receive the Printed
                <br />
                Journal
              </p>

              <p className="mt-5 max-w-[250px] text-xs leading-5 text-[#706D66]">
                A quarterly publication delivered to your doorstep.
                Complimentary for our Inner Circle members.
              </p>

              <form
                onSubmit={handleSubscribe}
                className="mt-8 w-full max-w-[260px]"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="YOUR EMAIL ADDRESS"
                  className="w-full border-b border-[#D2C9B7] bg-transparent py-3 text-center text-[8px] uppercase tracking-[0.14em] outline-none placeholder:text-[#A9A59D]"
                />

                <button
                  type="submit"
                  className="mt-5 w-full bg-[#8B7200] px-5 py-3 text-[8px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#6F5C00]"
                >
                  Subscribe
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
