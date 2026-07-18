export default function HeroSection() {
  return (
    <section
      className="relative h-[720px] bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1594035910387-fea47794261f')",
      }}
    >
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative max-w-7xl mx-auto h-full flex items-center justify-end">
        <div className="max-w-xl text-white">
          <p className="uppercase tracking-[6px] text-sm mb-4">
            Thương hiệu cao cấp
          </p>

          <h2 className="text-6xl font-light">NƯỚC HOA</h2>

          <h1 className="text-8xl font-extrabold leading-none mb-5">HOA CỎ</h1>

          <div className="inline-block bg-white text-black px-5 py-2 tracking-[3px] uppercase font-semibold">
            Hương thơm dành riêng cho bạn
          </div>

          <p className="mt-8 leading-8 text-gray-100">
            Khám phá bộ sưu tập nước hoa cao cấp với hương thơm sang trọng, tinh
            tế và lưu hương suốt cả ngày.
          </p>

          <button className="mt-10 border border-white px-8 py-4 uppercase tracking-[3px] hover:bg-white hover:text-black transition">
            Khám phá ngay
          </button>
        </div>
      </div>
    </section>
  );
}
