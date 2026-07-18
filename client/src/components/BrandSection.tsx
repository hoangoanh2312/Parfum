import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
    const uniqueBrands = Array.from(new Set(brands));
    const top = uniqueBrands.filter((_, index) => index % 2 === 0);
    const bottom = uniqueBrands.filter((_, index) => index % 2 === 1);

    return [top.length ? top : fallbackBrands.slice(0, 8), bottom.length ? bottom : top];
  }, [brands]);

  const renderBrandRow = (items: string[]) =>
    items.map((brand, index) => (
      <Link
        key={`${brand}-${index}`}
        to={`/shop?brand=${encodeURIComponent(brand)}`}
        onMouseEnter={() => setActive(brand)}
        className={`shrink-0 whitespace-nowrap uppercase tracking-[4px] transition-all duration-300
        ${
          active === brand
            ? "text-[#b8860b] scale-110 font-normal"
            : "text-gray-400 hover:text-[#b8860b]"
        }`}
      >
        {brand}
      </Link>
    ));

  return (
    <section className="bg-[#faf7f2] py-16 overflow-hidden">

      <h2 className="text-center text-3xl font-serif mb-14">
        Thương hiệu nổi bật
      </h2>

      {/* Hàng 1 */}
<div className="overflow-hidden mb-8 flex justify-start">
  <div className="marquee-left gap-16">
    <div className="marquee-group gap-16">{renderBrandRow(brandsTop)}</div>
    <div className="marquee-group gap-16" aria-hidden="true">{renderBrandRow(brandsTop)}</div>
  </div>
</div>

      {/* Hàng 2 (lệch sang phải) */}
    <div className="overflow-hidden flex justify-end">
  <div className="marquee-right gap-16">
    <div className="marquee-group gap-16">{renderBrandRow(brandsBottom)}</div>
    <div className="marquee-group gap-16" aria-hidden="true">{renderBrandRow(brandsBottom)}</div>
  </div>
</div>

    </section>
  );
}
