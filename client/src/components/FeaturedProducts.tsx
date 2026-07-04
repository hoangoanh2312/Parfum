import { Heart } from "lucide-react";
import { products } from "../assets/data";

export default function FeaturedProducts() {
  return (
    <section className="py-20 bg-[#faf7f2]">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-12">

          <div>

            <h2 className="text-5xl font-serif">
              Sản phẩm nổi bật
            </h2>

            <p className="text-gray-500 mt-4">
              Những mùi hương được yêu thích nhất
            </p>

          </div>

          <div className="flex gap-4">

            <button className="px-5 py-2 rounded-full bg-black text-white">
              Nổi bật
            </button>

            <button className="px-5 py-2 rounded-full bg-white shadow">
              Mới nhất
            </button>

            <button className="px-5 py-2 rounded-full bg-white shadow">
              Bán chạy
            </button>

          </div>

        </div>

        <div className="grid md:grid-cols-4 gap-8">

          {products.map((item) => (

            <div
              key={item.id}
              className="bg-white p-5 hover:shadow-2xl duration-300 group"
            >

              <div className="overflow-hidden">

                <img
                  src={item.image}
                  className="h-72 w-full object-cover group-hover:scale-110 duration-500"
                />

              </div>

              <p className="uppercase text-gray-400 text-xs mt-5">
                {item.brand}
              </p>

              <h3 className="text-2xl font-serif mt-2">
                {item.name}
              </h3>

              <div className="flex justify-between mt-3">

                <span className="font-semibold">
                  {item.price}
                </span>

                <Heart size={18} />

              </div>

              <button className="mt-6 w-full border py-3 uppercase tracking-widest hover:bg-black hover:text-white duration-300">
                Thêm vào giỏ
              </button>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}