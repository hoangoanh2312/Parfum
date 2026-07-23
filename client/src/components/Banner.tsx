import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

type Collection = {
  id: string;
  tab: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  columns: { label: string; value: string }[];
};

const COLLECTIONS: Collection[] = [
  {
    id: "collection-01",
    tab: "Bộ sưu tập",
    title: "L'Essence Noire",
    subtitle: "Bộ sưu tập chữ ký 2025",
    description:
      "Những mùi hương được chưng cất thủ công, gói trọn chiều sâu của gỗ quý, hổ phách và hoa đêm — dành cho người biết trân trọng sự tinh tế.",
    image: "/images/dior-homme-banner.jpg",
    columns: [
      { label: "Phong cách", value: "Phương Đông gỗ" },
      { label: "Nồng độ", value: "Eau de Parfum" },
      { label: "Độ lưu hương", value: "8–12 giờ" },
      { label: "Dịp dùng", value: "Tối / Sự kiện" },
    ],
  },
  {
    id: "archive-notes",
    tab: "Câu chuyện hương",
    title: "Ký ức mùi hương",
    subtitle: "Từ nốt hương đến cảm xúc",
    description:
      "Mỗi lọ nước hoa là một trang nhật ký khứu giác — nơi bergamot buổi sớm gặp gỡ hoa nhài nồng nàn và tan vào nền gỗ đàn hương ấm áp.",
    image: "/images/dior-homme-banner.jpg",
    columns: [
      { label: "Hương đầu", value: "Bergamot, Cam" },
      { label: "Hương giữa", value: "Hoa nhài, Hồng" },
      { label: "Hương nền", value: "Gỗ, Hổ phách" },
      { label: "Cảm hứng", value: "Đêm Địa Trung Hải" },
    ],
  },
  {
    id: "process-film",
    tab: "Nghệ thuật chế tác",
    title: "Bàn tay nghệ nhân",
    subtitle: "Chưng cất theo mẻ nhỏ",
    description:
      "Chúng tôi tuyển chọn từng nguyên liệu thô, kiên nhẫn ủ hương và tinh chỉnh đến khi từng nốt hương kể đúng câu chuyện của nó.",
    image: "/images/dior-homme-banner.jpg",
    columns: [
      { label: "Nguyên liệu", value: "Tuyển chọn" },
      { label: "Quy trình", value: "Mẻ nhỏ" },
      { label: "Ủ hương", value: "6–8 tuần" },
      { label: "Kiểm định", value: "Thủ công" },
    ],
  },
  {
    id: "material-origin",
    tab: "Nguồn nguyên liệu",
    title: "Cội nguồn thiên nhiên",
    subtitle: "Nguyên liệu bền vững",
    description:
      "Từ cánh đồng oải hương đến rừng gỗ trầm, mỗi thành phần đều được khai thác có trách nhiệm, tôn trọng thiên nhiên và con người.",
    image: "/images/dior-homme-banner.jpg",
    columns: [
      { label: "Oải hương", value: "Provence" },
      { label: "Gỗ trầm", value: "Đông Nam Á" },
      { label: "Hổ phách", value: "Baltic" },
      { label: "Cam kết", value: "Bền vững" },
    ],
  },
];

const AUTOPLAY_MS = 7000;

export default function BannerSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const activeIndexRef = useRef(0);

  const changeCollection = useCallback((next: number) => {
    const total = COLLECTIONS.length;
    const normalizedIndex = ((next % total) + total) % total;

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    if (normalizedIndex === activeIndexRef.current) {
      setContentVisible(true);
      return;
    }
    setContentVisible(false);
    transitionTimerRef.current = window.setTimeout(() => {
      activeIndexRef.current = normalizedIndex;
      setActiveIndex(normalizedIndex);
      setContentVisible(true);
      transitionTimerRef.current = null;
    }, 260);
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = window.setTimeout(() => {
      changeCollection(activeIndex + 1);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [activeIndex, paused, changeCollection]);

  useEffect(() => () => {
    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
  }, []);

  const active = COLLECTIONS[activeIndex];

  return (
    <section
      className="relative isolate min-h-[92vh] w-full overflow-hidden bg-[#111]"
    >
      <style>{`
        @keyframes bannerDust {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 0.5; }
          100% { transform: translateY(-40px) translateX(12px); opacity: 0; }
        }
      `}</style>

      {COLLECTIONS.map((item, index) => (
        <div
          key={item.id}
          aria-hidden={index !== activeIndex}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: index === activeIndex ? 1 : 0 }}
        >
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#e9dcae]/60"
            style={{
              left: `${12 + i * 15}%`,
              bottom: `${10 + (i % 3) * 12}%`,
              animation: `bannerDust ${6 + i}s ease-in-out ${i * 0.8}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-[1240px] flex-col justify-center px-6 py-24 md:px-10 lg:px-14">
        <div
          className="max-w-[640px] transition-all duration-500 ease-out"
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#d8c990]">
            {active.subtitle}
          </p>
          <h1 className="font-title mt-5 text-[46px] leading-[1.02] text-white md:text-[68px]">
            {active.title}
          </h1>
          <p className="mt-6 max-w-[520px] text-[14px] leading-[1.9] text-white/75 md:text-[15px]">
            {active.description}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="bg-[#d8c990] px-9 py-4 text-[11px] font-semibold uppercase tracking-[2px] text-[#1a1a1a] transition hover:bg-white"
            >
              Khám phá bộ sưu tập
            </Link>
            <Link
              to="/about"
              className="border border-white/40 px-9 py-4 text-[11px] font-semibold uppercase tracking-[2px] text-white transition hover:border-white hover:bg-white/10"
            >
              Câu chuyện thương hiệu
            </Link>
          </div>

          <div className="mt-14 grid max-w-[640px] grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4">
            {active.columns.map((col) => (
              <div key={col.label}>
                <p className="text-[10px] uppercase tracking-[1.5px] text-white/45">{col.label}</p>
                <p className="mt-2 text-[13px] font-medium text-white md:text-[14px]">{col.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-10 flex flex-wrap gap-x-8 gap-y-2"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
          }}
        >
          {COLLECTIONS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => changeCollection(index)}
              onMouseEnter={() => changeCollection(index)}
              onFocus={() => changeCollection(index)}
              aria-pressed={index === activeIndex}
              className={`relative pb-2 text-[11px] font-medium uppercase tracking-[2px] transition-colors duration-300 ${
                index === activeIndex ? "text-white" : "text-white/45 hover:text-white/80"
              }`}
            >
              {item.tab}
              <span
                className={`absolute inset-x-0 bottom-0 h-px origin-left bg-[#d8c990] transition-transform duration-500 ${
                  index === activeIndex ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
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
              index === activeIndex ? "w-8 bg-[#d8c990]" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
