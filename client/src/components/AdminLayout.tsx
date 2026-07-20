import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth.store";

const NAV = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Sản phẩm" },
  { to: "/admin/variants", label: "Biến thể / Tồn kho" },
  { to: "/admin/orders", label: "Đơn hàng" },
  { to: "/admin/brands", label: "Thương hiệu" },
  { to: "/admin/categories", label: "Danh mục" },
  { to: "/admin/media", label: "Thư viện ảnh" },
  { to: "/admin/reviews", label: "Đánh giá" },
  { to: "/admin/users", label: "Người dùng" },
];

export default function AdminLayout() {
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="fixed left-0 top-0 flex h-full w-64 flex-col bg-gray-950 text-white">
        <div className="border-b border-gray-800 p-5">
          <h1 className="text-xl font-bold">PARFUM Admin</h1>
          <p className="mt-1 truncate text-sm text-gray-400">{user?.email}</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <NavLink
            to="/"
            className="mt-2 block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-800"
          >
            ← Về trang bán hàng
          </NavLink>
        </nav>

        <div className="border-t border-gray-800 p-4">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  );
}
