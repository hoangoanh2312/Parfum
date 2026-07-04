import { Info } from "lucide-react";

export default function About() {
  return (
    <section className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-6">
      <div className="text-center">

        <Info
          size={70}
          className="mx-auto text-[#b8860b] mb-8 animate-pulse"
        />

        <p className="uppercase tracking-[6px] text-[#b8860b] text-sm mb-4">
          Đang cập nhật
        </p>

        <h1 className="font-heading text-7xl mb-6">
          Giới thiệu
        </h1>

        <p className="max-w-xl mx-auto text-gray-500 leading-8">
          Perfume Store sẽ mang đến những sản phẩm nước hoa chính hãng,
          dịch vụ tận tâm và trải nghiệm mua sắm cao cấp.
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