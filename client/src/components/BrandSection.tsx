import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

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

type MongoBrand = {
  _id?: string;
  id?: string;
  name: string;
};

export default function BrandSection() {
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    api
      .get<{ data?: MongoBrand[] } | MongoBrand[]>("/brands")
      .then(({ data }) => {
        if (!mounted) return;
        const rows = Array.isArray(data) ? data : data.data || [];
        const names = rows
          .map((brand) => brand.name?.trim())
          .filter((name): name is string => Boolean(name));

        setBrands(names);
      })
      .catch(() => {
        if (mounted) setBrands([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const displayBrands = brands.length ? brands : [...brandsTop, ...brandsBottom];
  const splitIndex = Math.ceil(displayBrands.length / 2);
  const marqueeRows = useMemo(
    () => [
      displayBrands.slice(0, splitIndex),
      displayBrands.slice(splitIndex),
    ],
    [displayBrands, splitIndex],
  );

  const brandLink = (brand: string) => `/shop?brand=${encodeURIComponent(brand)}`;

  return (
    <section className="bg-[#faf7f2] py-16 overflow-hidden">
      <h2 className="text-center text-3xl font-serif mb-14">
        Thương hiệu nổi bật
      </h2>

      {/* Hàng 1 */}
      <div className="brand-marquee-fade overflow-hidden mb-8">
        <div className="marquee-left">
          {[0, 1].map((copy) => (
            <div
              key={`top-copy-${copy}`}
              className="marquee-group"
              aria-hidden={copy === 1}
            >
              {marqueeRows[0].map((brand, index) => (
                <Link
                  key={`${brand}-top-${copy}-${index}`}
                  to={brandLink(brand)}
                  tabIndex={copy === 1 ? -1 : undefined}
                  className="uppercase tracking-[4px] text-gray-400 transition duration-10000 hover:scale-110 hover:text-[#b8860b]"
                >
                  {brand}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hàng 2 (lệch sang phải) */}
      <div className="brand-marquee-fade overflow-hidden">
        <div className="marquee-right">
          {[0, 1].map((copy) => (
            <div
              key={`bottom-copy-${copy}`}
              className="marquee-group"
              aria-hidden={copy === 1}
            >
              {marqueeRows[1].map((brand, index) => (
                <Link
                  key={`${brand}-bottom-${copy}-${index}`}
                  to={brandLink(brand)}
                  tabIndex={copy === 1 ? -1 : undefined}
                  className="uppercase tracking-[4px] text-gray-400 transition duration-10000 hover:scale-110 hover:text-[#b8860b]"
                >
                  {brand}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
