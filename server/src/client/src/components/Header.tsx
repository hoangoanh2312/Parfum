import { useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, MapPin } from "lucide-react";
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

  // Nạp lại giỏ khi khởi động và mỗi khi trạng thái đăng nhập thay đổi
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
            <MapPin
              size={15}
              className="cursor-pointer hover:text-black duration-300"
            />
            <Search
              size={15}
              className="cursor-pointer hover:text-black duration-300"
            />
            <Heart
              size={15}
              className="cursor-pointer hover:text-black duration-300"
            />

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
              to={user ? "/dashboard" : "/login"}
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
    </header>
  );
}
