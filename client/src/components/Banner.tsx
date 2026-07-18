import { Link } from "react-router-dom";

export default function BannerSection() {
  return (
    <section
      className="relative h-[700px] bg-fixed bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1595425964071-9e6d1d6c1f0f?w=1600')",
      }}
    >
      <div className="absolute inset-0 bg-black/55"></div>

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 sm:px-8 lg:px-10">

        <div className="max-w-xl text-white">

          <span className="tracking-[6px] uppercase">
            Bộ sưu tập đặc biệt
          </span>

          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-6xl">
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
