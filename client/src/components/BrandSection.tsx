import { useState } from "react";

export const brandsTop = [
  "CHANEL",
  "DIOR",
  "YSL",
  "GUCCI",
  "TOM FORD",
  "CREED",
  "LE LABO",
  "BYREDO",
];

export const brandsBottom = [
  "DIPTYQUE",
  "JO MALONE",
  "AMOUAGE",
  "XERJOFF",
  "INITIO",
  "KILIAN",
  "BVLGARI",
  "HERMES",
];

export default function BrandSection() {
  const [active, setActive] = useState("");

  return (
    <section className="bg-[#faf7f2] py-16 overflow-hidden">
      <h2 className="text-center text-3xl font-serif mb-14">
        Thương hiệu nổi bật
      </h2>

      {/* Hàng 1 */}
      <div className="overflow-hidden mb-8">
        <div className="marquee-left gap-16">
          {[...brandsTop, ...brandsTop].map((brand, index) => (
            <button
              key={index}
              onClick={() => setActive(brand)}
              className={`uppercase tracking-[4px] transition-all duration-300
        ${
          active === brand
            ? "text-[#b8860b] scale-110 font-normal"
            : "text-gray-400 hover:text-[#b8860b]"
        }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Hàng 2 (lệch sang phải) */}
      <div className="overflow-hidden">
        <div className="marquee-right gap-16">
          {[...brandsBottom, ...brandsBottom].map((brand, index) => (
            <button
              key={index}
              onClick={() => setActive(brand)}
              className={`uppercase tracking-[4px] transition-all duration-300
        ${
          active === brand
            ? "text-[#b8860b] scale-110 font-normal"
            : "text-gray-400 hover:text-[#b8860b]"
        }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}


