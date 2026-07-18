"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

/* ---------------------------------------------
   Types
--------------------------------------------- */
interface ProductItem {
  id: string;
  slug?: string;
  name: string;
  image?: string | null;
  images?: string[];
  fragranceFamily?: string;
  brand?: string;
  season?: string[];
  notes?: { top?: string[]; middle?: string[]; base?: string[] };
}

type ProductListResponse = { data: ProductItem[] };

interface SlideItem {
  id: string;
  name: string;
  notes: string;
  image: string;
  to: string;
  position: "top" | "bottom";
}

/** Mot mua: nhan + danh sach cac trang (moi trang toi da PER_SLIDE san pham) */
interface SeasonGroup {
  label: string;
  slides: SlideItem[][];
}

/* ---------------------------------------------
   Constants
--------------------------------------------- */
const FALLBACK: string[] = [
  "/images/season/winter-solstice.jpg",
  "/images/season/midnight-opera.jpg",
  "/images/season/linen-sky.jpg",
];

const PER_SLIDE = 3;
const AUTO_MS = 5000;
/** Thoi gian fade-out truoc khi doi slide (ms) */
const FADE_OUT_MS = 500;

/* Chi hien 4 mua + tu khoa nhan dien tuong ung trong du lieu Mongo */
const SEASON_LABELS = ["Spring", "Summer", "Autumn", "Winter"] as const;

const SEASON_ALIASES: Record<string, string[]> = {
  Spring: ["spring", "xuan", "xu\u00e2n"],
  Summer: ["summer", "he", "h\u00e8"],
  Autumn: ["autumn", "fall", "thu"],
  Winter: ["winter", "dong", "\u0111\u00f4ng"],
};

/* ---------------------------------------------
   Helpers
--------------------------------------------- */
function toSlideItem(product: ProductItem, index: number): SlideItem {
  const notes = [
    ...(product.notes?.top ?? []),
    ...(product.notes?.middle ?? []),
    ...(product.notes?.base ?? []),
  ]
    .slice(0, 3)
    .join(" · ");

  return {
    id: product.id,
    name: product.name,
    notes:
      notes || product.fragranceFamily || product.brand || "Signature scent",
    image:
      product.images?.[0] ?? product.image ?? FALLBACK[index % FALLBACK.length],
    to: `/products/${product.slug ?? product.id}`,
    position: index === 1 ? "bottom" : "top",
  };
}

/** Chuan hoa danh sach mua/dip cua 1 san pham */
function productSeasons(product: ProductItem): string[] {
  return (product.season ?? [])
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

/** San pham co thuoc mua `label` hay khong (dua tren du lieu that) */
function matchesSeason(product: ProductItem, label: string): boolean {
  const seasons = productSeasons(product);
  if (!seasons.length) return false;
  const aliases = SEASON_ALIASES[label] ?? [label.toLowerCase()];
  return seasons.some((season) => aliases.includes(season));
}

/**
 * Gom san pham THEO DUNG mua (toi da 4 mua).
 * Moi mua chia thanh nhieu trang, moi trang PER_SLIDE san pham.
 * Mua nao khong co san pham se bi bo qua.
 */
function buildSeasons(products: ProductItem[]): SeasonGroup[] {
  if (!products.length) return [];
  const groups: SeasonGroup[] = [];

  for (const label of SEASON_LABELS) {
    const seasonProducts = products.filter((product) =>
      matchesSeason(product, label),
    );
    if (!seasonProducts.length) continue;

    const slides: SlideItem[][] = [];
    for (let i = 0; i < seasonProducts.length; i += PER_SLIDE) {
      slides.push(
        seasonProducts
          .slice(i, i + PER_SLIDE)
          .map((product, idx) => toSlideItem(product, idx)),
      );
    }

    groups.push({ label, slides });
  }

  return groups;
}

/* ---------------------------------------------
   Arrow icons
--------------------------------------------- */
function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------------------------------------
   NavButton
--------------------------------------------- */
function NavButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 36,
        width: 36,
        flexShrink: 0,
        border: "0.5px solid rgba(26,26,24,0.18)",
        background: "transparent",
        color: "#1D1C19",
        cursor: "pointer",
        transition: "border-color 0.2s, color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#735C00";
        (e.currentTarget as HTMLButtonElement).style.color = "#735C00";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(26,26,24,0.18)";
        (e.currentTarget as HTMLButtonElement).style.color = "#1D1C19";
      }}
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------
   Card - single product tile
--------------------------------------------- */
function ProductCard({
  item,
  visible,
  delayMs,
}: {
  item: SlideItem;
  visible: boolean;
  delayMs: number;
}) {
  return (
    <article
      className="text-center"
      style={{ paddingTop: item.position === "bottom" ? 48 : 0 }}
    >
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0px)" : "translateY(10px)",
          transition: visible
            ? `opacity 0.8s ease ${delayMs}ms, transform 0.8s ease ${delayMs}ms`
            : `opacity 0.45s ease ${delayMs}ms, transform 0.45s ease ${delayMs}ms`,
        }}
      >
        {/* Image */}
        <Link
          to={item.to}
          className="group mx-auto block overflow-hidden"
          style={{
            width: "100%",
            maxWidth: 390,
            aspectRatio: "0.98/1",
            background: "#EEEAE3",
            display: "block",
          }}
        >
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.7s ease-out",
            }}
            className="transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Text */}
        <h3
          style={{
            fontFamily: "'Spectral', Georgia, serif",
            fontSize: 21,
            fontWeight: 300,
            color: "#272521",
            marginTop: 20,
            lineHeight: 1.3,
            minHeight: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="line-clamp-2"
        >
          {item.name}
        </h3>

        <p
          style={{
            fontSize: 9.5,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#7D7870",
            marginTop: 6,
            minHeight: 24,
            lineHeight: 1.5,
            fontFamily: "'Manrope', sans-serif",
          }}
          className="line-clamp-2"
        >
          {item.notes}
        </p>

        <Link
          to={item.to}
          style={{
            display: "inline-block",
            marginTop: 14,
            fontSize: 9.5,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#6D633F",
            borderBottom: "0.5px solid #88783B",
            paddingBottom: 2,
            textDecoration: "none",
            fontWeight: 500,
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          Discover now
        </Link>
      </div>
    </article>
  );
}

/* ---------------------------------------------
   SeasonSection - main export
--------------------------------------------- */
export default function SeasonSection() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [seasonIndex, setSeasonIndex] = useState(0); // thanh tren: 4 mua
  const [slideIndex, setSlideIndex] = useState(0); // mui ten duoi: san pham trong mua
  const [phase, setPhase] = useState<"in" | "out">("out");

  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  /* Ref luon giu gia tri moi nhat - tranh stale closure trong timer */
  const seasonsRef = useRef<SeasonGroup[]>([]);
  const seasonRef = useRef(0);
  const slideRef = useRef(0);
  const isTransitioning = useRef(false);

  /* Fetch - lay nhieu san pham de gom du cac mua */
  useEffect(() => {
    let mounted = true;
    api
      .get<ProductListResponse>("/products", {
        params: { page: 1, limit: 100, sort: "newest" },
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

  const seasons = useMemo(() => buildSeasons(products), [products]);
  const totalSeasons = seasons.length;

  /* Sync refs moi lan render */
  seasonsRef.current = seasons;
  seasonRef.current = seasonIndex;
  slideRef.current = slideIndex;

  const restartProgress = useCallback(() => {
    const el = progressRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.width = "0%";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (progressRef.current) {
          progressRef.current.style.transition = `width ${AUTO_MS}ms linear`;
          progressRef.current.style.width = "100%";
        }
      });
    });
  }, []);

  /* Auto: chay het cac trang cua mua hien tai roi sang mua ke tiep */
  const scheduleNext = useCallback(() => {
    if (autoRef.current) clearTimeout(autoRef.current);
    if (AUTO_MS <= 0) return;
    autoRef.current = setTimeout(() => {
      const list = seasonsRef.current;
      if (!list.length) return;
      const s = seasonRef.current;
      const slidesLen = list[s]?.slides.length ?? 0;
      let nextSeason = s;
      let nextSlide = slideRef.current + 1;
      if (nextSlide >= slidesLen) {
        nextSlide = 0;
        nextSeason = (s + 1) % list.length;
      }
      goToRef.current(nextSeason, nextSlide, false);
    }, AUTO_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Transition: fade-out -> doi du lieu -> fade-in */
  const goTo = useCallback(
    (nextSeason: number, nextSlide: number, resetAuto = true) => {
      const list = seasonsRef.current;
      if (!list.length || isTransitioning.current) return;

      const s = ((nextSeason % list.length) + list.length) % list.length;
      const slidesLen = Math.max(1, list[s].slides.length);
      const sl = ((nextSlide % slidesLen) + slidesLen) % slidesLen;

      isTransitioning.current = true;

      /* 1. Fade out */
      setPhase("out");

      setTimeout(() => {
        /* 2. Doi du lieu */
        seasonRef.current = s;
        slideRef.current = sl;
        setSeasonIndex(s);
        setSlideIndex(sl);

        /* 3. Fade in */
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setPhase("in");
            restartProgress();
            isTransitioning.current = false;

            /* 4. Len lich ke tiep */
            if (resetAuto || AUTO_MS > 0) scheduleNext();
          });
        });
      }, FADE_OUT_MS);

      if (resetAuto && autoRef.current) clearTimeout(autoRef.current);
    },
    [restartProgress, scheduleNext],
  );

  const goToRef = useRef(goTo);
  goToRef.current = goTo;

  /* Auto khoi dong lan dau khi co data */
  useEffect(() => {
    if (!totalSeasons || AUTO_MS <= 0) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhase("in");
        restartProgress();
        scheduleNext();
      });
    });
    return () => {
      if (autoRef.current) clearTimeout(autoRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSeasons]);

  if (!totalSeasons) return null;

  const safeSeason = Math.min(seasonIndex, totalSeasons - 1);
  const season = seasons[safeSeason];
  const slidesLen = season.slides.length;
  const safeSlide = Math.min(slideIndex, slidesLen - 1);
  const slide = season.slides[safeSlide];
  const visible = phase === "in";
  const hasMultipleSlides = slidesLen > 1;

  return (
    <section
      className="overflow-hidden"
      style={{
        background: "#FCF9F4",
        padding: "64px 32px 72px",
        fontFamily: "'Manrope', 'Helvetica Neue', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 4 }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#735C00",
              fontWeight: 500,
              marginBottom: 10,
            }}
          >
            Curated collection
          </p>
          <h2
            style={{
              fontFamily: "'Spectral', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 300,
              color: "#1D1C19",
              lineHeight: 1.15,
            }}
          >
            Scents of the <em style={{ fontStyle: "italic" }}>Season</em>
          </h2>
        </div>

        {/* ===== Thanh TREN: chuyen 4 MUA ===== */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            margin: "28px 0 40px",
          }}
        >
          <NavButton
            onClick={() => goTo(safeSeason - 1, 0, true)}
            label="Previous season"
          >
            <ArrowLeft />
          </NavButton>

          {/* Mot vach cho moi mua */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {seasons.map((group, i) => (
              <button
                key={group.label}
                onClick={() => goTo(i, 0, true)}
                aria-label={`Go to ${group.label}`}
                style={{
                  height: 1.5,
                  width: i === safeSeason ? 36 : 18,
                  background:
                    i === safeSeason ? "#735C00" : "rgba(115,92,0,0.25)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition:
                    "width 0.4s cubic-bezier(0.22,1,0.36,1), background 0.4s",
                }}
              />
            ))}
          </div>

          {/* Ten mua hien tai */}
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#7D7870",
              fontWeight: 500,
              minWidth: 56,
              opacity: visible ? 1 : 0,
              transition: visible
                ? "opacity 0.8s ease 0.2s"
                : "opacity 0.4s ease",
            }}
          >
            {season.label}
          </span>

          <NavButton
            onClick={() => goTo(safeSeason + 1, 0, true)}
            label="Next season"
          >
            <ArrowRight />
          </NavButton>
        </div>

        {/* ===== Mui ten DUOI (2 ben 3 anh): chuyen SAN PHAM cung mua ===== */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {hasMultipleSlides ? (
            <NavButton
              onClick={() => goTo(safeSeason, safeSlide - 1, true)}
              label="Previous scents"
            >
              <ArrowLeft />
            </NavButton>
          ) : (
            <span style={{ width: 36, flexShrink: 0 }} />
          )}

          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0 24px",
            }}
          >
            {slide.map((item, i) => (
              <ProductCard
                key={`${safeSeason}-${safeSlide}-${item.id}`}
                item={item}
                visible={visible}
                delayMs={i * 130}
              />
            ))}
          </div>

          {hasMultipleSlides ? (
            <NavButton
              onClick={() => goTo(safeSeason, safeSlide + 1, true)}
              label="Next scents"
            >
              <ArrowRight />
            </NavButton>
          ) : (
            <span style={{ width: 36, flexShrink: 0 }} />
          )}
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 1,
            background: "rgba(115,92,0,0.12)",
            marginTop: 48,
            maxWidth: 200,
            marginLeft: "auto",
            marginRight: "auto",
            overflow: "hidden",
          }}
        >
          <div
            ref={progressRef}
            style={{ height: "100%", width: "0%", background: "#735C00" }}
          />
        </div>

        {/* Counter - trang san pham trong mua hien tai */}
        <p
          style={{
            textAlign: "center",
            marginTop: 14,
            fontSize: 10,
            letterSpacing: "0.1em",
            color: "#7D7870",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          {String(safeSlide + 1).padStart(2, "0")} /{" "}
          {String(slidesLen).padStart(2, "0")}
        </p>
      </div>
    </section>
  );
}
