import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../store/auth.store';
import { useWishlist } from '../store/wishlist.store';

export default function Layout() {
  const user = useAuth((s) => s.user);
  const count = useWishlist((s) => s.products.length);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf6ef] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1200px] items-center gap-6 px-4 py-4 sm:px-6">
          <Link to="/" className="text-xl font-semibold tracking-[0.25em] text-slate-900">
            HOC PARFUM
          </Link>
          <nav className="flex flex-1 flex-wrap items-center gap-3 text-sm text-slate-700">
            <Link to="/" className="rounded-full px-3 py-2 transition hover:bg-slate-100">Trang chủ</Link>
            <Link to="/shop" className="rounded-full px-3 py-2 transition hover:bg-slate-100">Shop</Link>
            {user && (
              <Link to="/wishlist" className="rounded-full px-3 py-2 transition hover:bg-slate-100">
                Wishlist
                <span className="ml-2 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-900">
                  {count}
                </span>
              </Link>
            )}
          </nav>
          <div className="ml-auto text-sm text-slate-700">
            {user ? (
              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2">{user.name}</div>
            ) : (
              <Link to="/login" className="rounded-full border border-slate-200 bg-slate-950 px-4 py-2 text-white transition hover:bg-slate-800">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 px-4 py-8 sm:px-6">
        <div className="mx-auto w-full max-w-[1200px]"><Outlet /></div>
      </main>
      <footer className="border-t border-slate-200 bg-[#fbf6ef] px-4 py-6 text-center text-sm text-slate-600 sm:px-6">
        © 2026 HOC PARFUM
      </footer>
    </div>
  );
}
