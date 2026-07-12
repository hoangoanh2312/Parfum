import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import ProductCard, { ProductCardData } from './ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lấy sản phẩm THẬT từ API (Mongo) thay vì file tĩnh assets/data
  useEffect(() => {
    api
      .get('/products')
      .then(({ data }) => setProducts(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch((e) => setError(e?.response?.data?.message || 'Không tải được sản phẩm'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-[#faf7f2]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-5xl font-serif">Sản phẩm nổi bật</h2>
            <p className="text-gray-500 mt-4">Những mùi hương được yêu thích nhất</p>
          </div>
        </div>

        {loading && <p className="text-center text-gray-400">Đang tải sản phẩm...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-400">Chưa có sản phẩm nào trong cơ sở dữ liệu.</p>
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
