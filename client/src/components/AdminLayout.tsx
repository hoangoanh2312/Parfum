import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth.store';

export default function AdminLayout() {
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-950 text-white">
        <div className="border-b border-gray-800 p-5">
          <h1 className="text-xl font-bold">PARFUM Admin</h1>
          <p className="mt-1 text-sm text-gray-400">{user?.email}</p>
        </div>

        <nav className="space-y-2 p-4">
          <Link
            to="/admin"
            className="block rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-800"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/brands"
            className="block rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-800"
          >
            Quản lý thương hiệu
          </Link>

          <Link
            to="/"
            className="block rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-800"
          >
            Về trang bán hàng
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  );
}