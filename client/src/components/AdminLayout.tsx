import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth.store';

export default function AdminLayout() {
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/login');
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
      isActive ? 'bg-[#263244] text-[#E8C97A]' : 'text-[#CBD5E1] hover:bg-[#1E293B] hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-[#F6F4EF]">
      <header className="flex h-16 items-center justify-between bg-[#0F172A] px-4 text-white shadow lg:hidden">
        <div>
          <p className="font-bold">PARFUM Admin</p>
          <p className="max-w-[220px] truncate text-xs text-[#94A3B8]">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="rounded-lg border border-[#334155] p-2.5 transition-colors hover:bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#C6A15B]"
          aria-label="Mở menu quản trị"
        >
          <Menu size={22} />
        </button>
      </header>

      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[rgba(15,23,42,0.55)] lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Đóng menu quản trị"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#0F172A] text-white shadow-2xl transition-transform duration-300 lg:w-64 lg:translate-x-0 lg:shadow-none ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-start justify-between border-b border-[#1E293B] p-5">
          <div className="min-w-0">
            <h1 className="text-xl font-bold">PARFUM Admin</h1>
            <p className="mt-1 truncate text-sm text-[#94A3B8]">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg p-2 text-[#CBD5E1] hover:bg-[#1E293B] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#C6A15B] lg:hidden"
            aria-label="Đóng menu"
          >
            <X size={21} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          <NavLink
            to="/admin"
            end
            onClick={() => setMenuOpen(false)}
            className={navClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/brands"
            onClick={() => setMenuOpen(false)}
            className={navClass}
          >
            Quản lý thương hiệu
          </NavLink>

          <NavLink
            to="/admin/orders"
            onClick={() => setMenuOpen(false)}
            className={navClass}
          >
            Đơn hàng
          </NavLink>

          <NavLink
            to="/"
            end
            onClick={() => setMenuOpen(false)}
            className={navClass}
          >
            Về trang bán hàng
          </NavLink>
        </nav>

        <div className="border-t border-[#1E293B] p-4">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-[#7F1D1D] bg-[#1E293B] px-4 py-2.5 text-sm font-semibold text-[#FCA5A5] transition-colors hover:bg-[#3F1D24] focus:outline-none focus:ring-2 focus:ring-[#C6A15B]"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="min-h-screen p-4 sm:p-6 lg:ml-64 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
