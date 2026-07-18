import { Link } from "react-router-dom";

const collections = [
  {
    id: 1,
    title: "Bộ sưu tập mùa đông",
    desc: "Hương thơm ấm áp, sang trọng",
    link: "/shop?season=winter",
    image:
      "https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?w=700",
  },
  {
    id: 2,
    title: "Phiên bản giới hạn",
    desc: "Sang trọng và đẳng cấp",
    link: "/shop?sort=newest",
    image:
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=700",
  },
  {
    id: 3,
    title: "Bộ sưu tập hoa cỏ",
    desc: "Nhẹ nhàng - Thanh lịch",
    link: "/shop?scent=Floral",
    image:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=700",
  },
];

export default function SeasonSection() {
  return (
    <section className="bg-[#faf7f2] py-24">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-center text-5xl font-serif mb-14">
          Bộ sưu tập theo mùa
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {collections.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group cursor-pointer"
            >

              <div className="overflow-hidden">

                <img
                  src={item.image}
                  className="h-[450px] w-full object-cover group-hover:scale-110 duration-500"
                />

              </div>

              <div className="py-6 text-center">

                <h3 className="text-2xl font-serif">
                  {item.title}
                </h3>

                <p className="text-gray-500 mt-2">
                  {item.desc}
                </p>

                <span className="mt-5 inline-block uppercase tracking-[4px] text-sm hover:text-yellow-700">
                  Khám phá
                </span>

              </div>

            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}
