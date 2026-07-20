import { useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, Contact as ContactIcon } from "lucide-react";
import { useCart } from "../store/cart.store";
import { useAuth } from "../store/auth.store";

const leftMenu = [
  { name: "Trang chủ", link: "/" },
  { name: "Sản phẩm", link: "/shop" },
  { name: "Thương hiệu", link: "/brand" },
];

const rightMenu = [
  { name: "Tin tức", link: "/blog" },
  { name: "Giới thiệu", link: "/about" },
];

export default function Header() {
  const count = useCart((s) => s.count);
  const loadCart = useCart((s) => s.loadCart);
  const user = useAuth((s) => s.user);

  useEffect(() => {
    loadCart();
  }, [user]);

  return (
    <header className="bg-[#EDE8DF] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-6 h-20 grid grid-cols-[1fr_auto_1fr] items-center">

        {/* Menu trái */}
        <div className="flex items-center gap-24">
          {leftMenu.map((item) => (
            <NavLink
              key={item.name}
              to={item.link}
              className={({ isActive }) =>
                `uppercase text-[11px] tracking-[3px] transition-colors duration-300 whitespace-nowrap ${
                  isActive ? "text-[#8A8176]" : "text-[#B5A47A] hover:text-[#8A8176]"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Logo — luôn ở giữa */}
        <div className="flex justify-center">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dwj2trmn0/image/upload/v1784438101/Screenshot_2026-07-19_121449_kus9fn.png"
              alt="Logo"
              className="h-14 w-auto object-contain hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Menu phải + icons */}
        <div className="flex items-center justify-end gap-8">
          {rightMenu.map((item) => (
            <NavLink
              key={item.name}
              to={item.link}
              className={({ isActive }) =>
                `uppercase text-[11px] tracking-[3px] transition-colors duration-300 whitespace-nowrap ${
                  isActive ? "text-[#8A8176]" : "text-[#B5A47A] hover:text-[#8A8176]"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <div className="h-5 w-px bg-[#B5B0A8]" />

          <div className="flex items-center gap-4 text-[#B5A47A]">
            <Link to="/contact">
              <ContactIcon size={15} className="cursor-pointer hover:text-[#8A8176] duration-300" />
            </Link>
            <Link to="/Shop">
              <Search size={15} className="cursor-pointer hover:text-[#8A8176] duration-300" />
            </Link>
            <Link to="/account/wishlist">
              <Heart size={15} className="cursor-pointer hover:text-[#8A8176] duration-300" />
            </Link>
            <Link to="/cart" className="relative">
              <ShoppingBag size={15} className="cursor-pointer hover:text-[#8A8176] duration-300" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#8A8176] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <Link to={user ? "/account" : "/login"} title={user ? user.name : "Đăng nhập"}>
              <User size={15} className="cursor-pointer hover:text-[#8A8176] duration-300" />
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="uppercase text-[11px] tracking-[3px] text-[#B5A47A] hover:text-[#8A8176] duration-300 whitespace-nowrap"
              >
                Quản trị
              </Link>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}