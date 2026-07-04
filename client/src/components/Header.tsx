import { NavLink, Link } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  MapPin,
} from "lucide-react";

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
              isActive
                ? "text-black"
                : "text-[#a67c1a] hover:text-black"
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
    isActive
      ? "text-black"
      : "text-[#a67c1a] hover:text-black"
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

  <ShoppingBag
    size={15}
    className="cursor-pointer hover:text-black duration-300"
  />

  <Link to="/login">
    <User
      size={15}
      className="cursor-pointer hover:text-black duration-300"
    />
  </Link>

</div>

    </div>

  </div>
  
</header>

  );
}