import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../store/wishlist.store';
import WishlistButton from '../components/WishlistButton';

export default function WishlistPage() {
  const products = useWishlist((s) => s.products);
  const loading = useWishlist((s) => s.loading);
  const error = useWishlist((s) => s.error);

  if (loading && products.length === 0) return <div className="text-center text-slate-600">Đang tải danh sách...</div>;
  if (error) return <div className="text-center text-rose-600">{error}</div>;

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-200/50 sm:p-8">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.35em] text-amber-800">DANH SÁCH CỦA BẠN</div>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Sản phẩm yêu thích</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          Lưu lại những mùi hương cao cấp bạn yêu thích để dễ dàng khám phá và lựa chọn trong lần tiếp theo.
        </p>
        <div className="mt-6">
          <Link to="/shop" className="inline-flex rounded-full border border-slate-200 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Quay lại Shop
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-[#f9f4ea] p-10 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-3xl text-amber-800">♥</div>
          <h2 className="text-xl font-semibold text-slate-900">Danh sách yêu thích đang trống</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
            Hãy lưu lại những mùi hương bạn yêu thích để dễ dàng tìm lại sau.
          </p>
          <Link to="/shop" className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <article key={p._id} className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="relative overflow-hidden bg-slate-100">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-64 w-full items-center justify-center bg-gradient-to-br from-amber-50 via-slate-100 to-slate-200 text-slate-500">
                    <div className="text-sm uppercase tracking-[0.2em]">Chưa có ảnh</div>
                  </div>
                )}
                <div className="absolute right-4 top-4">
                  <WishlistButton productId={p._id} />
                </div>
              </div>
              <div className="space-y-3 p-5">
                {p.brand?.name && <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{p.brand.name}</div>}
                <h2 className="text-lg font-semibold text-slate-900">{p.name}</h2>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
