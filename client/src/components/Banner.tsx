import { useCallback, useEffect, useRef, useState } from "react";

type Collection = {
  id: string;
  tab: string;
  title: string;
  description: string;
  image: string;
  columns: string[];
};

const COLLECTIONS: Collection[] = [
  {
    id: "collection-01",
    tab: "Collection 01",
    title: "The Essence of Luxury",
    description:
      "Perfume is the most intense form of memory. It is a signature, an invisible layer of architecture that defines the soul of a space. Every bottle in our editorial collection is a testament to the patient art of layering. We source our resins from the high plateaus of Oman.",
    image: "/images/dior-homme-banner.jpg",
    columns: [
      "We source our resins from the high plateaus of Oman and our jasmines from the dawn-lit fields of Grasse. Our master perfumers treat scent as a liquid poetry, capturing fleeting moments in crystal vessels. Each note is carefully weighed against the silence it fills, creating a harmony that resonates with the wearer’s unique chemistry.",

      "The art of distillation has remained unchanged for centuries. We honor this tradition by employing slow extraction methods that preserve the volatile heart of the botanical. Our laboratories in Grasse serve as sanctuaries of experimentation, where ancient knowledge meets modern analytical precision to ensure every drop meets our exacting editorial standards.",

      "Architecture, much like scent, defines the volume of our experience. Our bottles are designed with structural integrity in mind, utilizing heavy glass that feels substantial in the hand. The tactile experience of the weighted cap and the fine mist delivery system are integral parts of the daily ritual we offer to our discerning community.",

      "Sustainability is not a trend, but a responsibility we owe to the earth that provides our raw materials. From biodegradable packaging to ethical sourcing partnerships with local farmers, we ensure that the beauty we create does not come at the cost of the environment. Luxury, in its truest form, is the preservation of nature’s most precious gifts.",
    ],
  },

  {
    id: "archive-notes",
    tab: "Archive Notes",
    title: "The Memory of Scent",
    description:
      "Fragrance preserves moments that words often fail to describe. Each composition becomes an archive of places, materials and emotions, patiently layered into a form that evolves beautifully on the skin.",
    image: "/images/dior-homme-banner.jpg",
    columns: [
      "Every fragrance begins with a memory. A place, a season or an intimate moment becomes the starting point for an olfactory composition shaped through careful observation.",

      "Our archives contain materials collected across generations. Each ingredient carries a distinct origin and reveals a different character through extraction, blending and maturation.",

      "The structure of a scent unfolds gradually. Bright opening notes give way to a textured heart before settling into a lasting base that remains close to the skin.",

      "These compositions are created not simply to be worn, but to become part of the wearer’s own history, gathering new meaning through every encounter.",
    ],
  },

  {
    id: "process-film",
    tab: "Process Film",
    title: "The Ritual of Creation",
    description:
      "Every perfume passes through a deliberate process of selection, extraction, composition and maturation. Time is treated not as a limitation, but as one of the most essential materials.",
    image: "/images/dior-homme-banner.jpg",
    columns: [
      "Raw materials are selected for their purity, texture and ability to reveal multiple dimensions throughout the life of the fragrance.",

      "Extraction is performed slowly to preserve the most delicate aromatic qualities of flowers, woods, spices and natural resins.",

      "Each formula is revised repeatedly until balance is achieved between clarity, depth, projection and the intimate character of the dry down.",

      "The completed fragrance is left to mature before filtration and bottling, allowing every element to settle into a unified composition.",
    ],
  },

  {
    id: "material-origin",
    tab: "Material Origin",
    title: "From Earth to Essence",
    description:
      "The identity of a fragrance begins long before it reaches the bottle. Climate, soil, harvest and craftsmanship influence the character of every individual material.",
    image: "/images/dior-homme-banner.jpg",
    columns: [
      "Resins gathered from the high plateaus of Oman bring mineral warmth, smoke and a luminous depth to the finished composition.",

      "Flowers harvested in Grasse are collected during the cooler hours of the morning to preserve their most delicate aromatic qualities.",

      "Woods are selected according to age, origin and texture, creating structure and an enduring presence within the base of the perfume.",

      "Every material is traced to its source so that quality, responsibility and respect for the natural environment remain inseparable.",
    ],
  },
];

export default function BannerSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const changeTimerRef = useRef<number | null>(null);

  const changeCollection = useCallback(
    (nextIndex: number) => {
      if (nextIndex === activeIndex) return;

      if (changeTimerRef.current) window.clearTimeout(changeTimerRef.current);
      setContentVisible(false);
      changeTimerRef.current = window.setTimeout(() => {
        setActiveIndex(nextIndex);
        setContentVisible(true);
        changeTimerRef.current = null;
      }, 280);
    },
    [activeIndex],
  );

  useEffect(() => {
    return () => {
      if (changeTimerRef.current) window.clearTimeout(changeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!autoplay) return;

    const timer = window.setInterval(() => {
      changeCollection((activeIndex + 1) % COLLECTIONS.length);
    }, 8000);

    return () => window.clearInterval(timer);
  }, [activeIndex, autoplay, changeCollection]);

  const activeCollection = COLLECTIONS[activeIndex];

  return (
    <section
      id="collection-story"
      className="relative isolate w-full overflow-hidden bg-[#0C0A08] text-white"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {/* Background */}
      {COLLECTIONS.map((collection, index) => (
        <div
          key={collection.id}
          aria-hidden="true"
          className={`absolute inset-0 bg-cover bg-center transition-[opacity,transform] duration-1000 ease-out will-change-[opacity,transform] ${
            index === activeIndex
              ? "scale-100 opacity-100"
              : "scale-[1.025] opacity-0"
          }`}
          style={{
            backgroundImage: `url("${collection.image}")`,
          }}
        />
      ))}

      {/* Overlay xám giống thiết kế cũ, chuyển mượt hơn */}
      <div className="absolute inset-0 bg-[#626262]/72" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,31,28,0.42)_0%,rgba(57,55,52,0.18)_42%,rgba(32,29,26,0.52)_100%)]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px,#fff 0.8px,transparent 0.9px)",
          backgroundSize: "7px 7px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute left-[5%] top-[38%] h-24 w-[58%] bg-[linear-gradient(90deg,transparent,rgba(201,169,106,0.10),transparent)] blur-2xl"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }, (_, index) => (
          <span
            key={index}
            className="absolute h-px w-px rounded-full bg-[#E7D5AC]"
            style={{
              left: `${(index * 37 + 9) % 96}%`,
              top: `${(index * 29 + 13) % 88}%`,
              animation: `bannerDust ${16 + (index % 6) * 3}s linear ${(index % 7) * 1.7}s infinite`,
            }}
          />
        ))}
      </div>

      <div
        className="relative z-10 flex min-h-[560px] flex-col px-6 pb-[96px] pt-[92px] sm:px-9 lg:min-h-[640px] lg:px-8 lg:pb-[118px] lg:pt-[112px] xl:min-h-[720px] xl:px-12"
      >
        {/* Nội dung trên */}
        <div
          className={`w-full max-w-[760px] transition-[opacity,transform] duration-300 ease-out ${
            contentVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <h2 className="font-title text-[34px] font-semibold leading-[1.08] text-white sm:text-[40px] lg:text-[46px] xl:text-[52px]">
            {activeCollection.title}
          </h2>

          <p className="mt-7 max-w-[740px] text-[13px] font-normal leading-[1.45] text-white/88 sm:text-[14px] lg:text-[16px]">
            {activeCollection.description}
          </p>
        </div>

        {/* Divider */}
        <div className="mt-[34px] h-px w-full max-w-[1040px] bg-white/20 lg:mt-[42px]" />

        {/* 4 cột */}
        <div
          className={`mt-[30px] grid w-full max-w-[1040px] grid-cols-1 gap-7 transition-[opacity,transform] duration-300 ease-out sm:grid-cols-2 lg:grid-cols-4 lg:gap-[36px] ${
            contentVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          {activeCollection.columns.map((column, index) => (
            <p
              key={`${activeCollection.id}-${index}`}
              className="text-[9px] font-normal leading-[1.72] text-white/78 sm:text-[10px] lg:text-[11px] xl:text-[12px]"
            >
              {column}
            </p>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-[55px] border-t border-white/20 pt-7 lg:mt-[64px]">
          <div className="flex flex-wrap gap-x-9 gap-y-3">
          {COLLECTIONS.map((collection, index) => {
            const selected = index === activeIndex;

            return (
              <button
                key={collection.id}
                type="button"
                onClick={() => changeCollection(index)}
                onMouseEnter={() => changeCollection(index)}
                aria-pressed={selected}
                className={`group relative flex h-[34px] min-w-[108px] items-center justify-center px-0 pb-3 text-[8px] font-medium uppercase tracking-[0.08em] transition-colors duration-300 sm:min-w-[124px] lg:h-[38px] lg:min-w-[150px] lg:text-[9px] ${
                  selected
                    ? "text-white/95"
                    : "text-white/62 hover:text-white"
                }`}
              >
                {collection.tab}
                <span
                  className={`absolute bottom-0 left-0 h-px bg-[#C9A96A] transition-[width] duration-500 ease-out ${
                    selected ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>
            );
          })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bannerDust {
          0% { opacity: 0; transform: translate3d(0, 18px, 0); }
          20% { opacity: .32; }
          75% { opacity: .14; }
          100% { opacity: 0; transform: translate3d(16px, -42px, 0); }
        }
      `}</style>
    </section>
  );
}
