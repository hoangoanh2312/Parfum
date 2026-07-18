export default function Newsletter() {
  return (
    <section className="bg-[#f8f5ef] py-24">
      <div className="max-w-3xl mx-auto text-center">
        <span className="uppercase tracking-[5px] text-gray-500">
          Đăng ký nhận ưu đãi
        </span>

        <h2 className="font-serif text-6xl text-center leading-tight w-full">
          Nhận tin tức mới nhất
        </h2>

        <p className="mt-6 text-gray-500 leading-8">
          Đăng ký email để nhận thông tin về sản phẩm mới, chương trình khuyến
          mãi và các bộ sưu tập độc quyền.
        </p>

        <div className="flex mt-12 shadow-lg">
          <input
            type="email"
            placeholder="Nhập email của bạn"
            className="flex-1 px-6 py-5 outline-none"
          />

          <button className="bg-black text-white px-10 uppercase tracking-[3px] hover:bg-yellow-700 duration-300">
            Đăng ký
          </button>
        </div>
      </div>
    </section>
  );
}
