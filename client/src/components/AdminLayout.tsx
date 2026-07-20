import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth.store';
import Toaster from './Toaster';
import { toast } from '../store/toast.store';

export default function AdminLayout() {
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const navItems = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/brands', label: 'Quản lý thương hiệu' },
    { to: '/', label: 'Về trang bán hàng' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="lg:hidden">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
          <button
            type="button"
            aria-label="Mở menu quản trị"
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-xl border border-gray-200 p-2 text-gray-700"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-gray-900">PARFUM Admin</h1>
            <p className="truncate text-xs text-gray-500">{user?.email ?? 'Admin'}</p>
          </div>
        </header>
      </div>

      <div className="lg:hidden">
        {isMobileMenuOpen ? (
          <div className="fixed inset-0 z-40 bg-black/40" aria-hidden="true" onClick={closeMenu} />
        ) : null}
      </div>

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 -translate-x-full bg-gray-950 text-white transition-transform duration-200 lg:translate-x-0 lg:w-72 ${isMobileMenuOpen ? 'translate-x-0' : ''}`}
        aria-label="Menu quản trị"
        aria-modal="true"
        role="dialog"
        aria-hidden={!isMobileMenuOpen && window.innerWidth < 1024 ? 'true' : 'false'}
      >
        <div className="flex items-center justify-between border-b border-gray-800 p-5">
          <div>
            <h1 className="text-xl font-bold">PARFUM Admin</h1>
            <p className="mt-1 text-sm text-gray-400">{user?.email}</p>
          </div>
          <button
            type="button"
            aria-label="Đóng menu quản trị"
            onClick={closeMenu}
            className="rounded-lg p-2 text-gray-300 hover:bg-gray-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-2 p-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-800 p-4">
          <button
            onClick={() => {
              handleLogout();
              closeMenu();
            }}
            className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="min-h-screen w-full max-w-none min-w-0 bg-gray-100 px-4 py-4 sm:px-6 sm:py-6 lg:ml-72 lg:px-8 lg:py-8">
        <div className="w-full min-w-0 max-w-none">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
