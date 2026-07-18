import { useState, useEffect, useCallback } from "react";

// ─── Fonts (thêm vào index.html hoặc layout root nếu chưa có) ───────────────
// <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap" rel="stylesheet">

const GOLD = "#B8973A";
const GOLD_DIM = "rgba(184,151,58,0.22)";
const CREAM = "#F4EFE6";

// ─── Dữ liệu ────────────────────────────────────────────────────────────────
const COLLECTIONS = [
  {
    id: "collection-01",
    tab: "Collection 01",
    eyebrow: "Collection 01 — Dark Series",
    headlinePlain: "The Essence of",
    headlineItalic: "Luxury",
    lead: "Nước hoa là ký ức mãnh liệt nhất. Một chữ ký vô hình kiến trúc nên linh hồn của không gian. Mỗi chai trong bộ sưu tập là minh chứng cho nghệ thuật kiên nhẫn của sự xếp lớp.",
    pillars: [
      { num: "01", label: "Nguồn gốc", body: "Nhựa cây từ cao nguyên Oman, hoa nhài từ những cánh đồng Grasse lúc bình minh — nguyên liệu sống của ký ức." },
      { num: "02", label: "Chưng cất", body: "Phương pháp chiết xuất chậm hàng thế kỷ, bảo toàn tinh chất dễ bay hơi của thảo mộc." },
      { num: "03", label: "Kiến trúc", body: "Chai thuỷ tinh nặng thiết kế với tính toàn vẹn cấu trúc — xứng tầm nghệ thuật tạo hình." },
      { num: "04", label: "Bền vững", body: "Từ bao bì phân huỷ sinh học đến chuỗi cung ứng đạo đức — vẻ đẹp không đánh đổi thiên nhiên." },
    ],
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=1600&q=80",
  },
  {
    id: "archive-notes",
    tab: "Archive Notes",
    eyebrow: "Archive Notes — 1991–2024",
    headlinePlain: "Notes from the",
    headlineItalic: "Archive",
    lead: "Mỗi công thức bắt đầu bằng một trang ghi tay. Kho lưu trữ chứa hơn ba thập kỷ thử nghiệm — những mẻ thử, phác thảo hợp chất, và những thất bại lặng thầm dẫn đến tác phẩm tinh tuý nhất.",
    pillars: [
      { num: "01", label: "Accord 1991", body: "Hợp chất vetiver-amber đầu tiên tại Grasse — bị bỏ mười lăm năm trước khi trở thành nền tảng của Velvet Oud." },
      { num: "02", label: "Công thức thất lạc", body: "Tinh dầu hoa hồng Damascus 1998 không thể tái tạo — bóng ma vẫn ảnh hưởng đến cách chúng tôi xây dựng hương floral." },
      { num: "03", label: "Phương pháp", body: "180 nguyên liệu cố định, không dùng chất tổng hợp. Giới hạn là động cơ của sáng tạo." },
      { num: "04", label: "Lưu trữ", body: "Mỗi mẻ được ghi lại nhiệt độ, độ ẩm và cảm nhận chủ quan của người pha chế — khoa học và trực giác ngang nhau." },
    ],
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1600&q=80",
  },
  {
    id: "process-film",
    tab: "Process Film",
    eyebrow: "Process Film — Behind the Craft",
    headlinePlain: "The Art of",
    headlineItalic: "Making",
    lead: "Từ thảo mộc thô đến chai thành phẩm, quy trình trải dài trên bốn châu lục và mười tám tháng. Chúng tôi ghi lại từng giai đoạn — không phải để quảng cáo, mà vì minh bạch là hình thức xa xỉ riêng của nó.",
    pillars: [
      { num: "01", label: "Từ đồng đến chai", body: "Ghi lại thu hoạch hoa nhài lúc bình minh tại Grasse và gỗ oud tại Assam — nguồn gốc của mỗi nốt hương." },
      { num: "02", label: "Phòng thí nghiệm", body: "Phòng pha trộn vừa là lab vừa là studio — nơi khám phá bất ngờ và sự tĩnh lặng của tập trung." },
      { num: "03", label: "Thuỷ tinh & Hình thức", body: "Thợ thổi thuỷ tinh Murano thế hệ thứ tư cộng tác qua từng khuôn mẫu — mỗi chai mất nhiều tuần để hoàn thiện." },
      { num: "04", label: "Biên tập cuối", body: "Bộ phim ghi lại trung thực và không vội vã — giá trị thực sự của nghề thủ công tinh tế." },
    ],
    image: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=1600&q=80",
  },
  {
    id: "material-origin",
    tab: "Material Origin",
    eyebrow: "Material Origin — Four Continents",
    headlinePlain: "Where",
    headlineItalic: "Materials Begin",
    lead: "Chất lượng nước hoa được quyết định trước khi pha trộn một giọt nào. Chúng tôi đến tận nguồn — đồn điền, rừng, vùng biển — và xây dựng mối quan hệ trực tiếp với những người chăm sóc chúng.",
    pillars: [
      { num: "01", label: "Nhũ hương Oman", body: "Hợp tác với 40 gia đình ở Dhofar thu hoạch Boswellia sacra — mẻ nhỏ, chỉ trong mùa khô." },
      { num: "02", label: "Hoa nhài Grasse", body: "Jasminum grandiflorum phải hái trước bình minh khi cường độ indolic đạt đỉnh — độc quyền hai cánh đồng." },
      { num: "03", label: "Vetiver Haiti", body: "Cao nguyên Haiti tạo ra rễ vetiver phức tạp nhất thế giới. Chúng tôi tài trợ chương trình phục hồi đất." },
      { num: "04", label: "Đàn hương Mysore", body: "Hiếm nhất trong nghề pha chế. Nguồn từ đồn điền bền vững được chứng nhận — sử dụng có chủ đích và tiết kiệm." },
    ],
    image: "https://images.unsplash.com/photo-1556760544-74068565f05c?w=1600&q=80",
  },
  {
    id: "new-arrivals",
    tab: "New Arrivals",
    eyebrow: "New Arrivals — Autumn · Winter 2025",
    headlinePlain: "Mùa Thu",
    headlineItalic: "Đông 2025",
    lead: "Bốn tác phẩm mới, mỗi tác phẩm là hồi đáp cho mùa chuyển giao. Khói, da thuộc và nhựa cây trầm sâu — những nguyên liệu mang trọng lượng của thay đổi và hơi ấm của những gì còn lại.",
    pillars: [
      { num: "01", label: "Noir de Fumée", body: "Nhựa cây bạch dương và guaiac mở bằng khói, nhường chỗ cho violet leaf và ambrette bất ngờ." },
      { num: "02", label: "Cuir Nomade", body: "Hợp chất da từ bảy nguyên liệu tự nhiên — warmth gợi nhớ làn da hơn là thuộc da." },
      { num: "03", label: "Résine d'Or", body: "Benzoin, tolu balsam và myrrh xoay quanh lõi hoa hồng vintage. Khô xuống như ánh hổ phách." },
      { num: "04", label: "Bois Silencieux", body: "Nhẹ nhàng nhất trong bộ sưu tập. Hinoki và xạ hương trắng với sợi chỉ trầm lạnh — chỉ nhận ra khi đến gần." },
    ],
    image: "https://images.unsplash.com/photo-1590156562745-5d04b9f634d8?w=1600&q=80",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function BannerSection() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === active || fading) return;
      setFading(true);
      setTimeout(() => {
        setActive(idx);
        setFading(false);
      }, 550);
    },
    [active, fading],
  );

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => goTo((active + 1) % COLLECTIONS.length), 7000);
    return () => clearInterval(t);
  }, [active, autoplay, goTo]);

  const col = COLLECTIONS[active];

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        height: "min(100vh, 760px)",
        minHeight: 560,
        background: "#0e0b08",
      }}
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {/* Background */}
      {COLLECTIONS.map((c, i) => (
        <div
          key={c.id}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${c.image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === active ? (fading ? 0 : 1) : 0,
            transition: "opacity 0.9s ease",
          }}
        />
      ))}

      {/* Left-to-right vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(8,6,4,0.92) 0%, rgba(8,6,4,0.62) 50%, rgba(8,6,4,0.22) 100%)",
        }}
      />

      {/* Gold accent bar — left edge */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 3,
          height: "100%",
          background: GOLD,
        }}
      />

      {/* ── Content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "48px 52px 36px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: CREAM,
        }}
      >
        {/* TOP: eyebrow + headline + lead + divider + pillars */}
        <div
          style={{
            opacity: fading ? 0 : 1,
            transform: fading ? "translateY(10px)" : "translateY(0)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <div style={{ width: 28, height: 1, background: GOLD }} />
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 10,
                fontWeight: 300,
                letterSpacing: "0.22em",
                color: GOLD,
                textTransform: "uppercase",
              }}
            >
              {col.eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', 'Spectral', Georgia, serif",
              fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
              fontWeight: 300,
              lineHeight: 1.1,
              maxWidth: 500,
              marginBottom: "1rem",
              letterSpacing: "-0.01em",
            }}
          >
            {col.headlinePlain}{" "}
            <br />
            <em style={{ fontStyle: "italic", color: "#c9a84c" }}>{col.headlineItalic}</em>
          </h2>

          {/* Lead */}
          <p
            style={{
              fontFamily: "'Jost', 'Manrope', sans-serif",
              fontSize: "clamp(0.78rem, 1.1vw, 0.9rem)",
              fontWeight: 300,
              lineHeight: 1.82,
              maxWidth: 430,
              color: "rgba(244,239,230,0.62)",
              marginBottom: "2rem",
              letterSpacing: "0.02em",
            }}
          >
            {col.lead}
          </p>

          {/* Diamond divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1.75rem" }}>
            <div style={{ flex: 1, height: 1, background: GOLD_DIM }} />
            <div
              style={{
                width: 5,
                height: 5,
                background: GOLD,
                transform: "rotate(45deg)",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, height: 1, background: GOLD_DIM }} />
          </div>

          {/* 4-column pillars */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.5rem",
            }}
          >
            {col.pillars.map((p) => (
              <div
                key={p.num}
                style={{
                  borderLeft: `1px solid ${GOLD_DIM}`,
                  paddingLeft: 14,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 11,
                    fontWeight: 400,
                    color: "rgba(184,151,58,0.45)",
                    letterSpacing: "0.1em",
                    marginBottom: 4,
                  }}
                >
                  {p.num}
                </div>
                <div
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 9.5,
                    fontWeight: 400,
                    letterSpacing: "0.16em",
                    color: GOLD,
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  {p.label}
                </div>
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 11.5,
                    fontWeight: 300,
                    lineHeight: 1.68,
                    color: "rgba(244,239,230,0.58)",
                  }}
                >
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM: tabs left · cta + dots right */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: "2rem",
          }}
        >
          {/* Tab bar — underline style */}
          <div style={{ display: "flex", gap: 0 }}>
            {COLLECTIONS.map((c, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={c.id}
                  onClick={() => goTo(idx)}
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: isActive
                      ? `1px solid ${GOLD}`
                      : "1px solid transparent",
                    color: isActive ? CREAM : "rgba(244,239,230,0.35)",
                    padding: "10px 22px 10px 0",
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 9.5,
                    fontWeight: 300,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "color 0.25s, border-color 0.25s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "rgba(244,239,230,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "rgba(244,239,230,0.35)";
                  }}
                >
                  {c.tab}
                </button>
              );
            })}
          </div>

          {/* Right col: CTA + dots */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
            <button
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 9,
                fontWeight: 300,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: GOLD,
                background: "transparent",
                border: `1px solid rgba(184,151,58,0.35)`,
                padding: "9px 22px",
                cursor: "pointer",
                transition: "background 0.25s, border-color 0.25s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(184,151,58,0.08)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(184,151,58,0.7)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(184,151,58,0.35)";
              }}
            >
              Xem bộ sưu tập
            </button>

            {/* Thin bar dots */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {COLLECTIONS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  style={{
                    width: idx === active ? 24 : 14,
                    height: 1,
                    background:
                      idx === active ? GOLD : "rgba(184,151,58,0.28)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "width 0.4s ease, background 0.4s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}