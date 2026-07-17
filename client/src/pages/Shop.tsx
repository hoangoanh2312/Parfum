import { Search, ChevronDown } from "lucide-react";
import ShopSidebar from "../components/Shop/ShopSidebar";
import ProductCard from "../components/Shop/ProductCard";
import { useState } from "react";

export default function Shop() {
  const products = Array.from({ length: 12 }, (_, index) => ({ id: index })) as any[];
const [search,setSearch]=useState("");

const [selectedBrands,setSelectedBrands]=useState<string[]>([]);

const [selectedGenders,setSelectedGenders]=useState<string[]>([]);

const [price,setPrice]=useState(500);
const toggleBrand=(brand:string)=>{

setSelectedBrands(prev=>

prev.includes(brand)

?prev.filter(item=>item!==brand)

:[...prev,brand]

);

}
const toggleGender=(gender:string)=>{

setSelectedGenders(prev=>

prev.includes(gender)

?prev.filter(item=>item!==gender)

:[...prev,gender]

);

}
  return (
    <main className="bg-[#FDF9F4]">
      {/* Hero */}
      <section className="max-w-[1536px] mx-auto px-10 pt-32 pb-16">
       <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="font-heading text-[88px] leading-[88px] text-[#1C1C19]">
              The Seasonal
              <br />
              Archives
            </h1>

            <p className="mt-8 max-w-md text-[#5F5E5E] leading-8">
              Discover timeless fragrances curated from the world's finest
              perfume houses.
            </p>
          </div>

          <div className="bg-[#F3EEE7] h-[330px] rounded-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

<section className="max-w-[1536px] mx-auto px-10 flex gap-16 pb-24">
  <ShopSidebar
    search={search}
    setSearch={setSearch}
    brands={[
      "Byredo",
      "Diptyque",
      "Tom Ford",
      "Creed",
    ]}
    selectedBrands={selectedBrands}
    toggleBrand={toggleBrand}
    genders={[
      "Women",
      "Men",
      "Unisex",
    ]}
    selectedGenders={selectedGenders}
    toggleGender={toggleGender}
    price={price}
    setPrice={setPrice}
  />

        {/* Content */}
        <section className="flex-1">
          {/* Toolbar */}
          <div className="flex justify-between border-b pb-5 border-[#e8deca]">
            <p className="uppercase text-xs tracking-widest text-[#5F5E5E]">
              Showing 12 products
            </p>

            <select className="uppercase text-xs tracking-widest bg-transparent outline-none">
              <option>Newest</option>
              <option>Price ↑</option>
              <option>Price ↓</option>
            </select>
          </div>

          {/* Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
          {/* Pagination */}
          <div className="border-t mt-16 pt-8 flex justify-center items-center gap-8">
            <button className="uppercase text-xs text-gray-400">
              Previous
            </button>

            <button className="text-[#735C00] font-bold">1</button>
            <button>2</button>
            <button>3</button>

            <button className="uppercase text-xs text-[#735C00]">
              Next
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}