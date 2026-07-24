import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Heart, LayoutDashboard, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "../store/cart.store";
import { useAuth } from "../store/auth.store";

const menuItems = [
  { vi: "Trang chủ", en: "Home", link: "/" },
  { vi: "Sản phẩm", en: "Products", link: "/shop" },
  { vi: "Thương hiệu", en: "Brands", link: "/brand" },
  { vi: "Tin tức", en: "Journal", link: "/blog" },
  { vi: "Giới thiệu", en: "About", link: "/about" },
  { vi: "Liên hệ", en: "Contact", link: "/contact" },
];

export default function Header() {
  const count = useCart((state) => state.count);
  const loadCart = useCart((state) => state.loadCart);
  const user = useAuth((state) => state.user);
  const [isVisible, setIsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    loadCart();
  }, [loadCart, user]);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 8) setIsVisible(true);
      else if (currentScrollY > lastScrollY.current) setIsVisible(false);
      else if (currentScrollY < lastScrollY.current) setIsVisible(true);
      lastScrollY.current = currentScrollY;
    };
    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const label = (vi: string, _en?: string) => vi;
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex h-20 w-full items-center justify-center whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 after:absolute after:bottom-0 after:left-1/2 after:h-px after:-translate-x-1/2 after:bg-[#8B784B] after:transition-all after:duration-300 ${
      isActive
        ? "text-[#5F554A] after:w-8"
        : "text-[#9A824C] after:w-0 hover:text-[#5F554A] hover:after:w-5"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-[#DED3C7] bg-[#F7EFE7]/95 shadow-[0_8px_28px_rgba(70,54,35,0.04)] backdrop-blur-md transition-transform duration-300 ease-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="relative mx-auto grid h-20 w-full max-w-[1680px] grid-cols-[44px_1fr_auto] items-center gap-2 px-5 sm:px-8 lg:px-10 2xl:block 2xl:px-2.5">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center text-[#8B784B] 2xl:hidden"
          aria-label={label(
            menuOpen ? "Đóng menu" : "Mở menu",
            menuOpen ? "Close menu" : "Open menu",
          )}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav
          className="absolute inset-y-0 left-2.5 hidden w-[660px] grid-cols-3 items-center min-[1680px]:w-[720px] 2xl:grid"
          aria-label="Primary"
        >
          {menuItems.slice(0, 3).map((item) => (
            <NavLink key={item.link} to={item.link} className={navClass}>
              {label(item.vi, item.en)}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/"
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          aria-label="L'Essence Noire"
        >
          <img
            loading="lazy"
            src="https://res.cloudinary.com/dwj2trmn0/image/upload/v1784798994/1784798990705-226061.png"
            alt="L'Essence Noire"
            className="h-11 w-auto max-w-[112px] object-contain transition-transform duration-300 hover:scale-105 sm:h-14 sm:max-w-[170px] 2xl:max-w-[190px]"
          />
        </Link>

        <nav
          className="absolute inset-y-0 left-[calc(50%+120px)] right-[260px] hidden grid-cols-3 items-center 2xl:grid"
          aria-label="Secondary"
        >
          {menuItems.slice(3).map((item) => (
            <NavLink key={item.link} to={item.link} className={navClass}>
              {label(item.vi, item.en)}
            </NavLink>
          ))}
        </nav>

        <div className="col-start-3 flex min-w-0 items-center justify-end gap-1.5 sm:gap-2.5 2xl:absolute 2xl:right-2.5 2xl:top-1/2 2xl:-translate-y-1/2">
          <Link
            to="/order-lookup"
            className="header-icon-button hidden sm:flex"
            title={label("Tra cứu đơn hàng", "Order lookup")}
          >
            <Search size={17} />
          </Link>
          <Link
            to="/account/wishlist"
            className="header-icon-button hidden md:flex"
            title="Wishlist"
          >
            <Heart size={17} />
          </Link>
          <Link
            to="/cart"
            className="header-icon-button relative"
            title={label("Giỏ hàng", "Cart")}
          >
            <ShoppingBag size={17} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#746A5F] px-1 text-[8px] text-white">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
          <Link
            to={user ? "/account" : "/login"}
            className="header-icon-button hidden xl:flex"
            title={user?.name || label("Đăng nhập", "Sign in")}
          >
            <User size={17} />
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="header-icon-button hidden xl:flex"
              title={label("Trang quản trị", "Admin dashboard")}
              aria-label={label("Trang quản trị", "Admin dashboard")}
            >
              <LayoutDashboard size={17} />
            </Link>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="max-h-[calc(100dvh-80px)] overflow-y-auto border-t border-[#E4DACE] bg-[#F5ECE3] px-5 pb-6 pt-3 shadow-lg 2xl:hidden">
          <nav className="mx-auto grid max-w-xl" aria-label="Mobile">
            {menuItems.map((item) => (
              <NavLink
                key={item.link}
                to={item.link}
                className={({ isActive }) =>
                  `border-b border-[#E6DDD2] py-4 text-[11px] uppercase tracking-[2px] ${isActive ? "text-[#5F554A]" : "text-[#907C4D]"}`
                }
              >
                {label(item.vi, item.en)}
              </NavLink>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-5">
              <Link to="/order-lookup" className="mobile-header-command">
                <Search size={16} />
                {label("Tra cứu đơn", "Order lookup")}
              </Link>
              <Link to="/account/wishlist" className="mobile-header-command">
                <Heart size={16} />
                Wishlist
              </Link>
              <Link to={user ? "/account" : "/login"} className="mobile-header-command">
                <User size={16} />
                {user ? label("Tài khoản", "Account") : label("Đăng nhập", "Sign in")}
              </Link>
              {user?.role === "admin" && (
                <Link to="/admin" className="mobile-header-command">
                  <LayoutDashboard size={16} />
                  {label("Quản trị", "Admin")}
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
