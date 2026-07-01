import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../store/auth.store';

export default function Layout() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HEADER SANG TRỌNG ĐÃ TÍCH HỢP LOGIC JWT */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <Link to="/" className="text-2xl font-bold tracking-wider">PARFUM</Link>

          <nav className="flex gap-6 font-medium text-gray-700">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
          </nav>

          <div className="flex items-center gap-6">
            {/* Các icon chức năng */}
            <div className="flex gap-4 text-lg cursor-pointer">
              <span className="hover:opacity-70 transition-opacity">🔍</span>
              <span className="hover:opacity-70 transition-opacity">🛒</span>
            </div>

            {/* Khu vực thành viên: Đăng nhập / Đăng xuất */}
            <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">
                    👤 {user.name || user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* NỘI DUNG CHÍNH CỦA CÁC TRANG CON */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* FOOTER LUXURY ĐẦY ĐỦ THÔNG TIN */}
      <footer className="bg-[#f7f4ef] border-t mt-20">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8 text-gray-800">
          <div>
            <h3 className="font-bold text-xl mb-3 tracking-wider">PARFUM</h3>
            <p className="text-sm text-gray-600">Luxury perfume collection</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-black">Home</Link></li>
              <li><Link to="/shop" className="hover:text-black">Shop</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Collections</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-black cursor-pointer">Byredo</li>
              <li className="hover:text-black cursor-pointer">Tom Ford</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Newsletter</h4>
            <div className="flex gap-2">
              <input
                className="border p-2 w-full text-sm outline-none bg-white"
                placeholder="Email..."
              />
              <button className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200/50 py-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} PARFUM. All rights reserved.
        </div>
      </footer>
    </div>
  );
}