import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Heart, MapPin, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "../store/cart.store";
import { useAuth } from "../store/auth.store";

const menu = [
  { name: "Trang chủ", link: "/" },
  { name: "Sản phẩm", link: "/shop" },
  { name: "Thương hiệu", link: "/brand" },
  { name: "Tin tức", link: "/blog" },
  { name: "Giới thiệu", link: "/about" },
];

export default function Header() {
  const count = useCart((state) => state.count);
  const loadCart = useCart((state) => state.loadCart);
  const user = useAuth((state) => state.user);
  const [open, setOpen] = useState(false);

  useEffect(() => { void loadCart(); }, [user]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `block min-h-11 py-3 text-sm uppercase tracking-[2px] ${isActive ? "font-semibold text-black" : "text-[#8B6914] hover:text-black"}`;

  return (
    <header className="relative z-40 border-b bg-[#faf7f2]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:h-20 lg:px-6">
        <button type="button" onClick={() => setOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[#735C00] lg:hidden" aria-label="Mở menu"><Menu size={22} /></button>

        <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {menu.slice(0, 3).map((item) => <NavLink key={item.link} to={item.link} className={navClass}>{item.name}</NavLink>)}
        </nav>

        <Link to="/" aria-label="Trang chủ" className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white transition hover:scale-105 lg:h-14 lg:w-14">LOGO</Link>

        <div className="flex items-center justify-end gap-1 text-[#8B6914] lg:flex-1 lg:gap-4">
          <nav className="mr-5 hidden items-center gap-8 lg:flex">{menu.slice(3).map((item) => <NavLink key={item.link} to={item.link} className={navClass}>{item.name}</NavLink>)}</nav>
          <button type="button" className="hidden h-11 w-11 items-center justify-center rounded-full hover:bg-black/5 lg:flex" aria-label="Tìm kiếm"><Search size={17} /></button>
          <button type="button" className="hidden h-11 w-11 items-center justify-center rounded-full hover:bg-black/5 lg:flex" aria-label="Danh sách yêu thích"><Heart size={17} /></button>
          <Link to="/cart" className="relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5" aria-label={`Giỏ hàng, ${count} sản phẩm`}><ShoppingBag size={18} />{count > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] text-white">{count}</span>}</Link>
          <Link to={user ? "/dashboard" : "/login"} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5" aria-label={user ? "Tài khoản" : "Đăng nhập"}><User size={18} /></Link>
        </div>
      </div>

      {open && <button type="button" className="fixed inset-0 z-40 bg-black/45 lg:hidden" onClick={() => setOpen(false)} aria-label="Đóng menu" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[min(82vw,320px)] flex-col bg-[#faf7f2] p-5 shadow-2xl transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`} aria-hidden={!open}>
        <div className="flex items-center justify-between border-b pb-4"><span className="font-semibold tracking-wider">HOC PARFUM</span><button type="button" onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5" aria-label="Đóng menu"><X size={22} /></button></div>
        <nav className="mt-4 flex-1 overflow-y-auto">{menu.map((item) => <NavLink key={item.link} to={item.link} onClick={() => setOpen(false)} className={navClass}>{item.name}</NavLink>)}</nav>
        <div className="grid grid-cols-3 gap-2 border-t pt-4"><button type="button" className="flex min-h-11 items-center justify-center rounded-lg border" aria-label="Tìm kiếm"><Search size={18} /></button><button type="button" className="flex min-h-11 items-center justify-center rounded-lg border" aria-label="Danh sách yêu thích"><Heart size={18} /></button><button type="button" className="flex min-h-11 items-center justify-center rounded-lg border" aria-label="Vị trí cửa hàng"><MapPin size={18} /></button></div>
      </aside>
    </header>
  );
}
