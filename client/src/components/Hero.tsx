import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[680px] bg-cover bg-center sm:h-[720px]"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1594035910387-fea47794261f')",
      }}
    >
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 py-14 sm:px-8 lg:justify-end lg:px-10">

        <div className="max-w-xl text-white">

          <p className="uppercase tracking-[6px] text-sm mb-4">
            Thương hiệu cao cấp
          </p>

          <h2 className="text-4xl font-light sm:text-6xl">
            NƯỚC HOA
          </h2>

          <h1 className="mb-5 text-6xl font-extrabold leading-none sm:text-8xl">
            HOA CỎ
          </h1>

          <div className="inline-block bg-white text-black px-5 py-2 tracking-[3px] uppercase font-semibold">
            Hương thơm dành riêng cho bạn
          </div>

          <p className="mt-8 leading-8 text-gray-100">
            Khám phá bộ sưu tập nước hoa cao cấp
            với hương thơm sang trọng,
            tinh tế và lưu hương suốt cả ngày.
          </p>

          <div className="mt-8 flex flex-col gap-3 min-[480px]:flex-row sm:mt-10">
            <a href="#featured-products" className="inline-flex min-h-11 items-center justify-center border border-white px-5 py-3 text-center text-xs uppercase tracking-[2px] transition hover:bg-white hover:text-black sm:px-8 sm:py-4 sm:tracking-[3px]">Khám phá ngay</a>
            <Link to="/shop" className="inline-flex min-h-11 items-center justify-center bg-white px-5 py-3 text-center text-xs uppercase tracking-[2px] text-black transition hover:bg-[#735C00] hover:text-white sm:px-8 sm:py-4 sm:tracking-[3px]">Xem tất cả</Link>
          </div>

        </div>

      </div>
    </section>
  );
}
