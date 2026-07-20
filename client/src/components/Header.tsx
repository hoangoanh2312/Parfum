import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, Contact as ContactIcon } from "lucide-react";
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
    loadCart();
  }, [user]);

  return (
    <header className="bg-[#faf7f2] border-b">
      <div className="max-w-7xl mx-auto h-20 flex items-center">
        {/* Menu trái */}
        <div className="flex-1 flex justify-center gap-10">
          {leftMenu.map((item) => (
            <NavLink
              key={item.name}
              to={item.link}
              className={({ isActive }) =>
                `uppercase text-[11px] tracking-[3px] transition-colors duration-300 ${
                  isActive ? "text-black" : "text-[#a67c1a] hover:text-black"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Logo */}
        <div className="w-14 flex justify-center">
          <Link to="/">
            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold hover:scale-105 duration-300">
              LOGO
            </div>
          </Link>
        </div>

        {/* Menu phải + icon */}
        <div className="flex-1 flex items-center justify-center gap-10">
          {rightMenu.map((item) => (
            <NavLink
              key={item.name}
              to={item.link}
              className={({ isActive }) =>
                `uppercase text-[11px] tracking-[3px] transition-colors duration-300 ${
                  isActive ? "text-black" : "text-[#a67c1a] hover:text-black"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <div className="h-5 w-px bg-[#a67c1a]" />
          <div className="flex items-center gap-4 text-[#a67c1a]">
            <Link to="/contact">
              <ContactIcon
                size={15}
                className="cursor-pointer hover:text-black duration-300"
              />
            </Link>
            <Link to="/Shop">
              <Search
                size={15}
                className="cursor-pointer hover:text-black duration-300"
              />
            </Link>
            <Link to="/account/wishlist" className="relative">
              <Heart
                size={15}
                className="cursor-pointer hover:text-black duration-300"
              />
            </Link>

            {/* Giỏ hàng + badge số lượng */}
            <Link to="/cart" className="relative">
              <ShoppingBag
                size={15}
                className="cursor-pointer hover:text-black duration-300"
              />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            <Link
              to={user ? "/account" : "/login"}
              title={user ? user.name : "Đăng nhập"}
            >
              <User
                size={15}
                className="cursor-pointer hover:text-black duration-300"
              />
            </Link>

            {/* Link vào khu vực quản trị - chỉ hiện với admin */}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="uppercase text-[11px] tracking-[3px] text-[#a67c1a] hover:text-black duration-300"
              >
                Quản trị
              </Link>
            )}
          </div>
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
