import { ShieldCheck, Truck, Gem, Headphones } from "lucide-react";

const data = [
  {
    icon: ShieldCheck,
    title: "Chính hãng 100%",
    desc: "Cam kết sản phẩm chính hãng.",
  },
  {
    icon: Truck,
    title: "Giao hàng toàn quốc",
    desc: "Miễn phí vận chuyển từ 2 triệu.",
  },
  {
    icon: Gem,
    title: "Nước hoa cao cấp",
    desc: "Chọn lọc từ nhiều thương hiệu nổi tiếng.",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    desc: "Luôn đồng hành cùng khách hàng.",
  },
];

export default function WhyChoose() {
  return (
    <section className="py-24 bg-[#faf7f2]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-5xl font-serif mb-20">
          Tại sao chọn chúng tôi
        </h2>

        <div className="grid md:grid-cols-4 gap-10">
          {data.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="text-center">
                <div className="flex justify-center mb-6">
                  <Icon size={40} />
                </div>

                <h3 className="text-2xl font-serif">{item.title}</h3>

                <p className="mt-4 text-gray-500 leading-7">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
