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

type ProductListResponse = {
  data: Array<{ brand?: string }>;
};

export default function BrandSection() {
  const [active, setActive] = useState("");
  const [brands, setBrands] = useState<string[]>(fallbackBrands);

  useEffect(() => {
    let mounted = true;

    Promise.allSettled([
      api.get<Brand[]>("/brands"),
      api.get<ProductListResponse>("/products", { params: { page: 1, limit: 100 } }),
    ])
      .then((results) => {
        const brandNames =
          results[0].status === "fulfilled"
            ? results[0].value.data
          .map((brand) => brand.name?.trim())
                .filter((name): name is string => Boolean(name))
            : [];
        const productBrandNames =
          results[1].status === "fulfilled"
            ? results[1].value.data.data
                .map((product) => product.brand?.trim())
                .filter((name): name is string => Boolean(name))
            : [];
        const names = buildBrandList([...brandNames, ...productBrandNames]);

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
    const uniqueBrands = buildBrandList(brands);
    const top = uniqueBrands.filter((_, index) => index % 2 === 0);
    const bottom = uniqueBrands.filter((_, index) => index % 2 === 1);

    return [top.length ? top : fallbackBrands.slice(0, 8), bottom.length ? bottom : top];
  }, [brands]);

  const renderBrandRow = (items: string[]) =>
    expandBrandRow(items).map((brand, index) => (
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
    <div className="overflow-hidden flex justify-start">
  <div className="marquee-right gap-16">
    <div className="marquee-group gap-16">{renderBrandRow(brandsBottom)}</div>
    <div className="marquee-group gap-16" aria-hidden="true">{renderBrandRow(brandsBottom)}</div>
  </div>
</div>

    </section>
  );
}

function buildBrandList(items: string[]) {
  const normalized = items
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, array) => array.findIndex((value) => value.toLowerCase() === item.toLowerCase()) === index);

  const merged = [...normalized];
  for (const fallback of fallbackBrands) {
    if (merged.length >= 18) break;
    if (!merged.some((item) => item.toLowerCase() === fallback.toLowerCase())) {
      merged.push(fallback);
    }
  }

  return merged;
}

function expandBrandRow(items: string[]) {
  if (items.length === 0) return fallbackBrands;

  const repeatCount = Math.max(2, Math.ceil(16 / items.length));
  return Array.from({ length: repeatCount }, () => items).flat();
}
