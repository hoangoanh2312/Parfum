const categories = [
  "Byredo",
  "Diptyque",
  "Creed",
  "Tom Ford",
  "Le Labo",
];

const products = [
  {
    id: 1,
    name: "Valaya",
    price: "$240",
  },
  {
    id: 2,
    name: "Tom Ford",
    price: "$320",
  },
  {
    id: 3,
    name: "Valentino",
    price: "$280",
  },
  {
    id: 4,
    name: "Byredo",
    price: "$220",
  },
    {
    id: 5,
    name: "Gucci flora",
    price: "$220",
  },
];

export default function Home() {
  return (
    <div>
      {/* Banner */}
          <section
      className="h-[650px] bg-cover bg-center flex items-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200')",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 text-white">
        <p className="uppercase tracking-[4px] text-sm">
          PREMIUM BRAND
        </p>

        <h2 className="text-5xl mt-4">
          FLOWER
        </h2>

        <h1 className="text-7xl font-bold">
          PERFUME
        </h1>

        <button className="mt-8 bg-white text-black px-6 py-3 font-semibold">
          SHOP NOW
        </button>
      </div>
    </section>

      {/* Danh mục */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        <h2 className="text-4xl font-serif text-center mb-10">
          Our Curated Houses
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((item) => (
            <button
              key={item}
              className="px-5 py-2 text-sm tracking-widest uppercase hover:text-amber-700"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold mb-8">
          Featured Products
        </h2>

        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 hover:shadow-lg transition duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=500"
                alt=""
                className="w-full h-60 object-cover mb-4"
              />

              <h3 className="font-semibold">
                {product.name}
              </h3>

              <p>{product.price}</p>

              <button className="mt-3 border px-4 py-2">
                Add To Cart
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}