import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth.store";
import { Icon, type AdminIconName } from "./admin/Icon";

type NavItem = { to: string; label: string; icon: AdminIconName; end?: boolean };
type NavSection = { title?: string; items: NavItem[] };

const NAV_SECTIONS: NavSection[] = [
  { items: [{ to: "/admin", label: "Tổng quan", icon: "grid", end: true }] },
  {
    title: "Kinh doanh",
    items: [
      { to: "/admin/products", label: "Sản phẩm", icon: "box" },
      { to: "/admin/variants", label: "Biến thể / Tồn kho", icon: "layers" },
      { to: "/admin/orders", label: "Đơn hàng", icon: "cart" },
    ],
  },
  {
    title: "Danh mục & nội dung",
    items: [
      { to: "/admin/brands", label: "Thương hiệu", icon: "tag" },
      { to: "/admin/categories", label: "Danh mục", icon: "folder" },
      { to: "/admin/media", label: "Thư viện ảnh", icon: "image" },
    ],
  },
  {
    title: "Cộng đồng",
    items: [
      { to: "/admin/reviews", label: "Đánh giá", icon: "star" },
      { to: "/admin/users", label: "Người dùng", icon: "users" },
    ],
  },
];

export default function AdminLayout() {
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const initial = (user?.name || user?.email || "A").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* -------------------------------------------------------- Sidebar -- */}
      <aside className="fixed left-0 top-0 flex h-full w-64 flex-col border-r border-gray-800 bg-gray-950 text-white">
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-gray-800 px-5 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-950">
            <Icon name="store" className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="font-title text-lg font-bold leading-tight">
              {"L'Essence Noire"}
            </h1>
            <p className="text-[11px] uppercase tracking-widest text-gray-500">
              Admin Console
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {NAV_SECTIONS.map((section, i) => (
            <div key={i}>
              {section.title && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-white text-gray-950 shadow-sm"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`
                    }
                  >
                    <Icon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="space-y-1 border-t border-gray-800 p-3">
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <Icon name="arrowRight" className="h-[18px] w-[18px] shrink-0 rotate-180" />
            Về trang bán hàng
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <Icon name="logout" className="h-[18px] w-[18px] shrink-0" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------------------- Main -- */}
      <div className="ml-64 flex min-h-screen flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/80 px-8 py-3 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Icon name="grid" className="h-4 w-4" />
            Bảng điều khiển quản trị
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-gray-900">
                {user?.name || "Quản trị viên"}
              </p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
              {initial}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
