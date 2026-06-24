import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../store/auth.store';

export default function Layout() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b p-4 flex gap-4 items-center">
        <Link to="/" className="font-bold">
          HOC PARFUM
        </Link>
        <Link to="/shop">Shop</Link>
        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">Xin chao, {user.name}</span>
              <button
                type="button"
                onClick={() => logout()}
                className="text-sm underline"
              >
                Dang xuat
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Dang nhap</Link>
              <Link to="/register">Dang ky</Link>
            </>
          )}
        </div>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      <footer className="border-t p-4 text-center text-sm text-gray-500">
        (c) HOC PARFUM
      </footer>
    </div>
  );
}
