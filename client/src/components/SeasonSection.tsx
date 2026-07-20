import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

interface ProductItem {
  id: string;
  slug?: string;
  name: string;
  image?: string | null;
  images?: string[];
  fragranceFamily?: string;
  brand?: string;
  notes?: {
    top?: string[];
    middle?: string[];
    base?: string[];
  };
}

type ProductListResponse = {
  data: ProductItem[];
};

const fallbackImages = [
  "/images/season/winter-solstice.jpg",
  "/images/season/midnight-opera.jpg",
  "/images/season/linen-sky.jpg",
];

export default function SeasonSection() {
  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    let mounted = true;

    api
      .get<ProductListResponse>("/products", { params: { page: 1, limit: 12, sort: "newest" } })
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

  const seasonItems = useMemo(
    () =>
      products.slice(0, 3).map((product, index) => {
        const notes = [
          ...(product.notes?.top || []),
          ...(product.notes?.middle || []),
          ...(product.notes?.base || []),
        ];

        return {
          id: product.id,
          name: product.name,
          notes: notes.slice(0, 3).join(", ") || product.fragranceFamily || product.brand || "Signature scent",
          image: product.images?.[0] || product.image || fallbackImages[index] || fallbackImages[0],
          position: index === 1 ? "bottom" : "top",
          to: `/products/${product.slug || product.id}`,
        };
      }),
    [products],
  );

  return (
    <section className="overflow-hidden bg-[#FCF9F4] px-5 py-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="text-center font-serif text-4xl font-semibold text-[#1D1C19] md:text-5xl">
          Scents of the Season
        </h2>

        <div className="mt-2 grid grid-cols-1 items-start gap-12 md:grid-cols-3 md:gap-8">
          {seasonItems.map((item) => (
            <article
              key={item.id}
              className={`text-center ${
                item.position === "bottom" ? "md:mt-24" : "md:mt-0"
              }`}
            >
              <Link
                to={item.to}
                className="mx-auto block aspect-[0.98/1] w-full max-w-[390px] overflow-hidden bg-[#EEEAE3]"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
              </Link>

              <h3 className="mt-6 min-h-[64px] font-serif text-2xl font-semibold leading-tight text-[#272521] line-clamp-2">
                {item.name}
              </h3>

              <p className="mt-2 min-h-[28px] text-[10px] uppercase tracking-[0.17em] text-[#7D7870] line-clamp-2">
                {item.notes}
              </p>

              <Link
                to={item.to}
                className="mt-5 inline-flex border-b border-[#88783B] pb-1 text-[10px] uppercase tracking-[0.18em] text-[#6D633F]"
              >
                Discover now
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
