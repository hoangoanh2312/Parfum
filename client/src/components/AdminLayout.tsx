import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth.store';
import Toaster from './Toaster';
import { toast } from '../store/toast.store';

export default function AdminLayout() {
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);

  function handleLogout() { logout(); setOpen(false); toast.info('Đã đăng xuất'); navigate('/login'); }
  const navClass = ({ isActive }: { isActive: boolean }) => `block rounded-lg px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`;

  const sidebar = (
    <>
      <div className="flex items-start justify-between border-b border-gray-800 p-5"><div className="min-w-0"><h1 className="text-xl font-bold">PARFUM Admin</h1><p className="mt-1 truncate text-sm text-gray-400">{user?.email}</p></div><button type="button" onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-800 lg:hidden" aria-label="Đóng menu Admin"><X size={21} /></button></div>
      <nav className="flex-1 space-y-2 overflow-y-auto p-4"><NavLink to="/admin" end onClick={() => setOpen(false)} className={navClass}>Dashboard</NavLink><NavLink to="/admin/brands" onClick={() => setOpen(false)} className={navClass}>Quản lý thương hiệu</NavLink><NavLink to="/" onClick={() => setOpen(false)} className={navClass}>Về trang bán hàng</NavLink></nav>
      <div className="border-t border-gray-800 p-4"><button type="button" onClick={handleLogout} className="w-full rounded-lg border border-red-900 bg-gray-900 px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-950">Đăng xuất</button></div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex h-16 items-center justify-between bg-gray-950 px-4 text-white lg:hidden"><div><p className="font-bold">PARFUM Admin</p><p className="max-w-[220px] truncate text-xs text-gray-400">{user?.email}</p></div><button type="button" onClick={() => setOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-700" aria-label="Mở menu Admin"><Menu size={22} /></button></header>
      {open && <button type="button" className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} aria-label="Đóng menu Admin" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-gray-950 text-white shadow-2xl transition-transform lg:w-64 lg:translate-x-0 lg:shadow-none ${open ? 'translate-x-0' : '-translate-x-full'}`}>{sidebar}</aside>
      <main className="min-h-screen p-4 sm:p-6 lg:ml-64 lg:p-8"><Outlet /></main><Toaster />
    </div>
  );
}
