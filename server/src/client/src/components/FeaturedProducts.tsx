import { useEffect, useState } from "react";
import { api } from "../lib/api";
import ProductCard, { ProductCardData } from "./ProductCard";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lấy sản phẩm THẬT từ API (Mongo) thay vì file tĩnh assets/data
  useEffect(() => {
    let active = true; // chống StrictMode gọi 2 lần trong môi trường dev
    api
      .get("/products")
      .then(({ data }) => {
        if (!active) return;
        const list = Array.isArray(data) ? data : data.data;
        setProducts(Array.isArray(list) ? list.slice(0, 8) : []);
        setError("");
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.response?.data?.message || "Không tải được sản phẩm");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-20 bg-[#faf7f2]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-5xl font-serif">Sản phẩm nổi bật</h2>
            <p className="text-gray-500 mt-4">
              Những mùi hương được yêu thích nhất
            </p>
          </div>
        </div>

        {loading && (
          <p className="text-center text-gray-400">Đang tải sản phẩm...</p>
        )}
        {/* Chỉ báo lỗi khi KHÔNG có sản phẩm nào, tránh hiện lỗi "ảo" do StrictMode */}
        {!loading && error && products.length === 0 && (
          <p className="text-center text-red-500">{error}</p>
        )}
        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-400">
            Chưa có sản phẩm nào trong cơ sở dữ liệu.
          </p>
        )}

        <div className="grid md:grid-cols-4 gap-8">
          {products.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
