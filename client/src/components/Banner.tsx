import { Link } from "react-router-dom";

export default function BannerSection() {
  return (
    <section className="relative h-[700px] overflow-hidden bg-[#DDD5CA]">
      <img
        src="https://images.unsplash.com/photo-1595425964071-9e6d1d6c1f0f?auto=format&fit=crop&w=1600&q=80"
        alt="Bộ sưu tập nước hoa đặc biệt"
        loading="lazy"
        decoding="async"
        width={1600}
        height={1050}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/55"></div>

      <div className="relative h-full max-w-7xl mx-auto flex items-center">

        <div className="max-w-xl text-white">

          <span className="tracking-[6px] uppercase">
            Bộ sưu tập đặc biệt
          </span>

          <h2 className="text-6xl font-serif mt-6 leading-tight">
            Tinh hoa của
            <br />
            nghệ thuật nước hoa
          </h2>

          <p className="mt-8 leading-8 text-gray-200">
            Chúng tôi mang đến những mùi hương
            được tuyển chọn từ các thương hiệu
            nổi tiếng trên thế giới với chất lượng
            chính hãng và dịch vụ cao cấp.
          </p>

          <Link
            to="/shop"
            className="mt-10 inline-block px-8 py-4 border border-white uppercase tracking-[4px] hover:bg-white hover:text-black duration-300"
          >
            Xem bộ sưu tập
          </Link>

        </div>

      </div>
    </section>
  );
}
