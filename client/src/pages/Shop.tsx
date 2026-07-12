import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import ProductCard, { ProductCardData } from '../components/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/products')
      .then(({ data }) => setProducts(Array.isArray(data) ? data : []))
      .catch((e) => setError(e?.response?.data?.message || 'Không tải được sản phẩm'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen bg-[#faf7f2] px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-heading text-6xl mb-2 text-center">Cửa hàng</h1>
        <p className="text-center text-gray-500 mb-12">
          Toàn bộ sản phẩm nước hoa chính hãng
        </p>

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
