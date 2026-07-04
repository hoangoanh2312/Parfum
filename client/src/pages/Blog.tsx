import { Newspaper } from "lucide-react";

export default function Blog() {
  return (
    <section className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-6">
      <div className="text-center">

        <Newspaper
          size={70}
          className="mx-auto text-[#b8860b] mb-8 animate-pulse"
        />

        <p className="uppercase tracking-[6px] text-[#b8860b] text-sm mb-4">
          Đang xây dựng
        </p>

        <h1 className="font-heading text-7xl mb-6">
          Tin tức
        </h1>

        <p className="max-w-xl mx-auto text-gray-500 leading-8">
          Các bài viết về nước hoa, xu hướng và kinh nghiệm lựa chọn
          sẽ sớm được đăng tải.
        </p>

        <button
          onClick={() => window.history.back()}
          className="mt-10 border border-black px-8 py-3 uppercase tracking-[4px]
          hover:bg-black hover:text-white duration-300"
        >
          Quay lại
        </button>

      </div>
    </section>
  );
}