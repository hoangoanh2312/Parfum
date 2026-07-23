import { useCallback, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type Collection = {
  id: string;
  tab: string;
  label: string;
  title: string;
  accent: string;
  description: string;
  image: string;
  href: string;
};

const COLLECTIONS: Collection[] = [
  {
    id: "best-sellers",
    tab: "Best Sellers",
    label: "CURATED COLLECTION — SIGNATURE FRAGRANCES",
    title: "The Art of",
    accent: "Choosing",
    description:
      "Chúng tôi không chỉ lựa chọn những mùi hương nổi tiếng. Mỗi chai nước hoa được tuyển chọn dựa trên chất lượng, cá tính và cảm xúc mà nó mang lại, để mỗi lần xịt đều trở thành một dấu ấn riêng.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?auto=format&fit=crop&w=2000&q=88",
    href: "/shop?sort=best_selling",
  },
  {
    id: "new-arrivals",
    tab: "New Arrivals",
    label: "NEW ARRIVALS — FRESHLY CURATED",
    title: "Beyond",
    accent: "Fragrance",
    description:
      "Những sáng tạo mới nhất được chọn vì cách chúng kể một câu chuyện khác biệt. Từ các bản phối hiện đại đến những nguyên liệu bất ngờ, đây là nơi bạn gặp mùi hương trước khi nó trở nên quen thuộc.",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=2000&q=88",
    href: "/shop?sort=newest",
  },
  {
    id: "for-him",
    tab: "For Him",
    label: "FOR HIM — MODERN MASCULINITY",
    title: "Quiet",
    accent: "Confidence",
    description:
      "Một lựa chọn dành cho phong thái điềm tĩnh nhưng có sức nặng. Gỗ, da thuộc, gia vị và hương thơm sạch được cân bằng để tạo nên nét nam tính hiện đại, không cần phô trương.",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=2000&q=88",
    href: "/shop?gender=male",
  },
  {
    id: "for-her",
    tab: "For Her",
    label: "FOR HER — DISTINCTIVE FEMININITY",
    title: "Every Bottle",
    accent: "Has a Story",
    description:
      "Không có một khuôn mẫu duy nhất cho sự nữ tính. Bộ sưu tập đi từ hoa trắng trong trẻo, trái cây rạng rỡ đến hổ phách sâu lắng, để mỗi cá tính tìm thấy cách hiện diện của riêng mình.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=2000&q=88",
    href: "/shop?gender=female",
  },
  {
    id: "niche-collection",
    tab: "Niche Collection",
    label: "NICHE COLLECTION — RARE COMPOSITIONS",
    title: "Beyond",
    accent: "The Familiar",
    description:
      "Dành cho người tìm kiếm nhiều hơn một mùi hương dễ đoán. Những nhà hương độc lập, cấu trúc táo bạo và nguyên liệu hiếm mở ra một trải nghiệm gần gũi với nghệ thuật hơn là xu hướng.",
    image: "https://images.unsplash.com/photo-1556760544-74068565f05c?auto=format&fit=crop&w=2000&q=88",
    href: "/shop?gender=unisex",
  },
];

const AUTOPLAY_MS = 7000;

export default function BannerSection() {
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  const changeCollection = useCallback(
    (nextIndex: number) => {
      if (nextIndex === active || transitioning) return;
      setTransitioning(true);
      window.setTimeout(() => {
        setActive(nextIndex);
        setTransitioning(false);
      }, 380);
    },
    [active, transitioning],
  );

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setInterval(
      () => changeCollection((active + 1) % COLLECTIONS.length),
      8000,
    );
    return () => window.clearInterval(timer);
  }, [active, autoplay, changeCollection]);

  const collection = COLLECTIONS[active];

  return (
    <section
      id="collection-story"
      className="relative isolate min-h-[720px] w-full max-w-[100vw] overflow-hidden bg-[#0C0A08] text-[#F5EFE5]"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {COLLECTIONS.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 bg-cover bg-center transition-[opacity,transform] duration-1000 ease-out ${
            index === active && !transitioning
              ? "scale-100 opacity-100"
              : "scale-[1.025] opacity-0"
          }`}
          style={{ backgroundImage: `url('${item.image}')` }}
          aria-hidden="true"
        />
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,6,4,0.97)_0%,rgba(8,6,4,0.88)_36%,rgba(8,6,4,0.52)_68%,rgba(8,6,4,0.24)_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 0.8px, transparent 0.9px)",
          backgroundSize: "7px 7px",
        }}
        aria-hidden="true"
      />
      <div className="absolute left-[5%] top-[38%] h-24 w-[58%] bg-[linear-gradient(90deg,transparent,rgba(201,169,106,0.1),transparent)] blur-2xl" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span
            key={index}
            className="absolute h-px w-px rounded-full bg-[#E7D5AC] opacity-0 [animation:bannerDust_linear_infinite] motion-reduce:hidden"
            style={{
              left: `${(index * 37 + 9) % 96}%`,
              top: `${(index * 29 + 13) % 88}%`,
              animationDelay: `${(index % 7) * 1.7}s`,
              animationDuration: `${16 + (index % 6) * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[720px] max-w-[1500px] flex-col justify-between px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <div
          className={`max-w-[650px] transition-all duration-500 ${
            transitioning ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-[#C9A96A]" />
            <p className="text-[9px] font-medium uppercase leading-5 tracking-[0.2em] text-[#D4B978] sm:text-[10px]">
              {collection.label}
            </p>
          </div>

          <h2 className="font-title text-[clamp(48px,7vw,96px)] font-light leading-[0.88] text-[#F8F2E8]">
            {collection.title}
            <br />
            <em className="font-normal text-[#C9A96A]">{collection.accent}</em>
          </h2>

          <p className="mt-9 max-w-[590px] text-[14px] font-light leading-7 text-[#D1C8BB] sm:text-[15px] sm:leading-8">
            {collection.description}
          </p>

          <Link
            to={collection.href}
            className="group mt-10 inline-flex items-center gap-3 border-b border-[#C9A96A]/50 pb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#E0C98F] transition hover:border-[#E0C98F] hover:text-[#F5DFC0]"
          >
            Khám phá bộ sưu tập
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="mt-16 border-t border-[#C9A96A]/20 pt-7">
          <div className="flex gap-7 overflow-x-auto pb-2 [scrollbar-width:none] sm:gap-9 [&::-webkit-scrollbar]:hidden">
            {COLLECTIONS.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => changeCollection(index)}
                  className={`relative shrink-0 pb-3 text-[9px] font-medium uppercase tracking-[0.17em] transition-colors duration-300 sm:text-[10px] ${
                    selected ? "text-[#F5EFE5]" : "text-[#8F887F] hover:text-[#D7CFC4]"
                  }`}
                  aria-pressed={selected}
                >
                  <span className="mr-2 text-[#A98D54]">{String(index + 1).padStart(2, "0")}</span>
                  {item.tab}
                  <span
                    className={`absolute bottom-0 left-0 h-px bg-[#C9A96A] transition-all duration-500 ${
                      selected ? "w-full" : "w-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
        {COLLECTIONS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={item.tab}
            onClick={() => changeCollection(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === active ? "w-8 bg-[#d8c990]" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
