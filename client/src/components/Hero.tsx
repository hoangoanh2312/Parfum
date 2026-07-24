import { Link } from "react-router-dom";
export default function HeroSection() {
  return (
    <section className="relative min-h-[680px] overflow-hidden bg-[#0e0b08] sm:h-[92vh] sm:min-h-[600px]">
      {/* Ảnh nền */}
      <img
        loading="lazy"
        src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1800&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />

      {/* Lớp phủ chuyển màu */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0e0b08]/90 via-[#0e0b08]/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b08]/60 via-transparent to-transparent" />

      {/* Vạch nhấn màu vàng bên trái */}
      <div className="absolute left-0 top-0 h-full w-[3px] bg-[#B8973A]" />

      {/* Nội dung */}
      <div className="relative mx-auto flex min-h-[680px] w-full max-w-7xl items-center px-5 py-12 sm:h-full sm:min-h-0 sm:px-12 sm:py-0 lg:px-16">
        <div className="min-w-0 w-full max-w-[620px]">
          {/* Dòng giới thiệu nhỏ */}
          <div className="mb-6 flex min-w-0 items-center gap-3 sm:mb-8 sm:gap-4">
            <div className="h-px w-6 shrink-0 bg-[#B8973A] sm:w-8" />
            <p className="min-w-0 text-[9px] font-light uppercase leading-5 tracking-[0.2em] text-[#B8973A] sm:text-[10px] sm:tracking-[0.32em]">
              L&apos;Essence Noire — Bộ sưu tập cao cấp
            </p>
          </div>

          {/* Tiêu đề chính */}
          <h1
            className="text-[44px] leading-[1.02] text-[#F4EFE6] sm:text-[56px] lg:text-[72px] xl:text-[80px]"
            style={{
              fontFamily: "'Noto Serif', 'Noto Serif Display', serif",
              fontWeight: 300,
            }}
          >
            Nghệ thuật của
            <br />
            <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Hương thơm</em>
            <br />
            tinh tế.
          </h1>

          {/* Đoạn mô tả */}
          <p
            className="mt-6 max-w-[460px] break-words text-[#F4EFE6]/70 leading-[1.75] sm:mt-8 sm:leading-[1.85]"
            style={{
              fontFamily: "'Be Vietnam Pro', 'Manrope', sans-serif",
              fontSize: "clamp(0.8rem, 1.1vw, 0.92rem)",
              fontWeight: 300,
              letterSpacing: "0",
            }}
          >
            Khám phá bộ sưu tập nước hoa cao cấp với nguyên liệu hiếm từ bốn châu lục. Mỗi chai là
            một tác phẩm — được chế tác bằng sự kiên nhẫn và nghệ thuật chưng cất thủ công.
          </p>

          {/* Đường chia màu vàng */}
          <div className="my-8 flex items-center gap-4 sm:my-10">
            <div className="h-px flex-1 max-w-[120px] bg-[#B8973A]/30" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#B8973A]" />
            <div className="h-px flex-1 max-w-[120px] bg-[#B8973A]/30" />
          </div>

          {/* Nút điều hướng */}
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              to="/shop"
              className="inline-flex min-h-12 w-full items-center justify-center bg-[#B8973A] px-5 py-4 text-center text-[9px] font-medium uppercase tracking-[0.16em] text-[#0e0b08] transition hover:bg-[#C9A84C] sm:w-auto sm:px-8 sm:text-[10px] sm:tracking-[0.22em]"
            >
              Khám phá sản phẩm
            </Link>
            <Link
              to="/blog"
              className="inline-flex min-h-12 w-full items-center justify-center border border-[#B8973A]/50 px-5 py-4 text-center text-[9px] font-light uppercase tracking-[0.16em] text-[#F4EFE6] transition hover:border-[#B8973A] hover:bg-[#B8973A]/10 sm:w-auto sm:px-8 sm:text-[10px] sm:tracking-[0.22em]"
            >
              Đọc câu chuyện
            </Link>
          </div>
        </div>
      </div>

      {/* Gợi ý cuộn ở cuối màn hình */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-40 sm:bottom-8">
        <div className="h-10 w-px bg-[#B8973A] animate-pulse" />
        <p className="text-[8px] uppercase tracking-[0.25em] text-[#B8973A]">Cuộn</p>
      </div>
    </section>
  );
}
