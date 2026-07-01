import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../store/auth.store';

export default function Layout() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-6">
        <Link to="/" className="font-bold text-xl">HOC PARFUM</Link>
        <Link to="/shop" className="text-gray-600 hover:text-black">Shop</Link>

        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.name || user.email}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-black"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login" className="text-gray-600 hover:text-black">
              Đăng nhập
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 p-6">
        <Outlet />
      </main>

      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        (c) HOC PARFUM
      </footer>
    </div>
  );
}