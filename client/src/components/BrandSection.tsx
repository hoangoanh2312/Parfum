import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const fallbackBrands = [
  "CHANEL",
  "DIOR",
  "YSL",
  "GUCCI",
  "TOM FORD",
  "CREED",
  "LE LABO",
  "BYREDO",
  "DIPTYQUE",
  "JO MALONE",
  "AMOUAGE",
  "XERJOFF",
  "INITIO",
  "KILIAN",
  "BVLGARI",
  "HERMES",
];

type Brand = {
  _id?: string;
  id?: string;
  name: string;
};

export default function BrandSection() {
  const [active, setActive] = useState("");
  const [brands, setBrands] = useState<string[]>(fallbackBrands);

  useEffect(() => {
    let mounted = true;

    api
      .get<Brand[]>("/brands")
      .then(({ data }) => {
        const names = data
          .map((brand) => brand.name?.trim())
          .filter((name): name is string => Boolean(name));

        if (mounted && names.length) {
          setBrands(names);
          setActive((current) => (names.includes(current) ? current : ""));
        }
      })
      .catch(() => {
        if (mounted) setBrands(fallbackBrands);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const [brandsTop, brandsBottom] = useMemo(() => {
    const midpoint = Math.ceil(brands.length / 2);
    const top = brands.slice(0, midpoint);
    const bottom = brands.slice(midpoint);
    return [top.length ? top : fallbackBrands.slice(0, 8), bottom.length ? bottom : top];
  }, [brands]);

  const repeatedTop = useMemo(() => repeatBrands(brandsTop), [brandsTop]);
  const repeatedBottom = useMemo(() => repeatBrands(brandsBottom), [brandsBottom]);

  return (
    <section className="bg-[#faf7f2] py-16 overflow-hidden">

      <h2 className="text-center text-3xl font-serif mb-14">
        Thương hiệu nổi bật
      </h2>

      {/* Hàng 1 */}
<div className="overflow-hidden mb-8 flex justify-start">
  <div className="marquee-left gap-16">

    {repeatedTop.map((brand, index) => (
      <button
        key={index}
        onClick={() => setActive(brand)}
        className={`shrink-0 whitespace-nowrap uppercase tracking-[4px] transition-all duration-300
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
    <div className="overflow-hidden flex justify-end">
  <div className="marquee-right gap-16">

    {repeatedBottom.map((brand, index) => (
      <button
        key={index}
        onClick={() => setActive(brand)}
        className={`shrink-0 whitespace-nowrap uppercase tracking-[4px] transition-all duration-300
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

function repeatBrands(items: string[]) {
  const source = items.length ? items : fallbackBrands;
  const repeatCount = Math.max(4, Math.ceil(18 / source.length));
  return Array.from({ length: repeatCount }, () => source).flat();
}
