import { LayoutDashboard, LogOut, Menu, ShoppingBag, Tags, X } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../store/auth.store";
import Toaster from "./Toaster";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/brands", label: "Thương hiệu", icon: Tags },
  { to: "/admin/categories", label: "Danh mục", icon: ShoppingBag },
];

export default function AdminLayout() {
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const sidebar = (
    <>
      <div className="flex items-start justify-between border-b border-gray-800 p-5">
        <div className="min-w-0">
          <h1 className="text-xl font-bold">PARFUM Admin</h1>
          <p className="mt-1 truncate text-sm text-gray-400">{user?.email}</p>
        </div>
        <button onClick={() => setMenuOpen(false)} className="rounded p-1 text-gray-400 hover:bg-gray-800 lg:hidden" aria-label="Đóng menu"><X size={20} /></button>
      </div>
      <nav className="space-y-1 p-4">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
        <NavLink to="/" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"><ShoppingBag size={18} /> Về trang bán hàng</NavLink>
      </nav>
      <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">
        <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold hover:bg-red-700"><LogOut size={17} /> Đăng xuất</button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-gray-950 text-white lg:block">{sidebar}</aside>
      {menuOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-gray-950 text-white transition-transform lg:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>{sidebar}</aside>
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-200 bg-white px-4 lg:hidden">
        <button onClick={() => setMenuOpen(true)} className="rounded-lg border border-gray-300 p-2 text-gray-700" aria-label="Mở menu"><Menu size={21} /></button>
        <span className="ml-3 font-bold text-gray-900">PARFUM Admin</span>
      </header>
      <main className="min-h-screen p-4 sm:p-6 lg:ml-64 lg:p-8"><Outlet /></main>
      <Toaster />
    </div>
  );
}
