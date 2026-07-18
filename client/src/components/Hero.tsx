import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative h-[720px] overflow-hidden bg-[#DDD5CA]">
      <img
        src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1600&q=72"
        srcSet="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=640&q=72 640w, https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=960&q=72 960w, https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1280&q=72 1280w, https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1600&q=72 1600w"
        sizes="100vw"
        alt="Bộ sưu tập nước hoa cao cấp"
        width={1600}
        height={900}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative max-w-7xl mx-auto h-full flex items-center justify-end">

        <div className="max-w-xl text-white">

          <p className="uppercase tracking-[6px] text-sm mb-4">
            Thương hiệu cao cấp
          </p>

          <h2 className="text-6xl font-light">
            NƯỚC HOA
          </h2>

          <h1 className="text-8xl font-extrabold leading-none mb-5">
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

          <a
            href="#featured-products"
            className="mt-10 inline-block border border-white px-8 py-4 uppercase tracking-[3px] hover:bg-white hover:text-black transition"
          >
            Khám phá ngay
          </a>

          <Link
            to="/shop"
            className="ml-4 mt-10 inline-block bg-white px-8 py-4 uppercase tracking-[3px] text-black transition hover:bg-[#735C00] hover:text-white"
          >
            Xem tất cả
          </Link>

        </div>

      </div>
    </section>
  );
}
