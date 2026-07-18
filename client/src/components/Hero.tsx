import { Link } from "react-router-dom";
export default function HeroSection() {
  return (
    <section className="relative h-[92vh] min-h-[600px] overflow-hidden bg-[#0e0b08]">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1800&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0e0b08]/90 via-[#0e0b08]/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b08]/60 via-transparent to-transparent" />

      {/* Gold left accent bar */}
      <div className="absolute left-0 top-0 h-full w-[3px] bg-[#B8973A]" />

      {/* Content */}
      <div className="relative flex h-full max-w-7xl mx-auto items-center px-8 sm:px-12 lg:px-16">
        <div className="max-w-[620px]">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-8 bg-[#B8973A]" />
            <p className="text-[10px] font-light uppercase tracking-[0.32em] text-[#B8973A]">
              L&apos;Essence Noire — Bộ sưu tập cao cấp
            </p>
          </div>

          {/* Headline */}
          <h1
            className="text-[#F4EFE6] leading-[1.05] tracking-[-0.02em]"
            style={{
              fontFamily: "'Cormorant Garamond', 'Spectral', Georgia, serif",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              fontWeight: 300,
            }}
          >
            Nghệ thuật của
            <br />
            <em
              style={{ fontStyle: "italic", color: "#C9A84C" }}
            >
              Hương thơm
            </em>
            <br />
            tinh tế.
          </h1>

          {/* Lead text */}
          <p
            className="mt-8 text-[#F4EFE6]/60 leading-[1.85] max-w-[460px]"
            style={{
              fontFamily: "'Jost', 'Manrope', sans-serif",
              fontSize: "clamp(0.8rem, 1.1vw, 0.92rem)",
              fontWeight: 300,
              letterSpacing: "0.02em",
            }}
          >
            Khám phá bộ sưu tập nước hoa cao cấp với nguyên liệu hiếm từ bốn
            châu lục. Mỗi chai là một tác phẩm — được chế tác bằng sự kiên nhẫn
            và nghệ thuật chưng cất thủ công.
          </p>

          {/* Gold divider */}
          <div className="flex items-center gap-4 my-10">
            <div className="h-px flex-1 max-w-[120px] bg-[#B8973A]/30" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#B8973A]" />
            <div className="h-px flex-1 max-w-[120px] bg-[#B8973A]/30" />
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-[#B8973A] px-8 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-[#0e0b08] transition hover:bg-[#C9A84C]"
            >
              Khám phá sản phẩm
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center gap-3 border border-[#B8973A]/50 px-8 py-4 text-[10px] font-light uppercase tracking-[0.22em] text-[#F4EFE6] transition hover:border-[#B8973A] hover:bg-[#B8973A]/10"
            >
              Đọc câu chuyện
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="h-10 w-px bg-[#B8973A] animate-pulse" />
        <p className="text-[8px] uppercase tracking-[0.25em] text-[#B8973A]">Scroll</p>
      </div>
    </section>
  );
}
