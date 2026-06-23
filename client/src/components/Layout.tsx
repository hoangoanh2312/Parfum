import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header className="border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold">PARFUM</h1>

          <nav className="flex gap-6">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/login">Login</Link>
          </nav>

          <div className="flex gap-4">
            <span>🔍</span>
            <span>🛒</span>
            <span>👤</span>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-[#f7f4ef] border-t mt-20">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-3">PARFUM</h3>
            <p>Luxury perfume collection</p>
          </div>

          <div>
            <h4 className="font-semibold">Navigation</h4>
            <ul>
              <li>Home</li>
              <li>Shop</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Collections</h4>
            <ul>
              <li>Byredo</li>
              <li>Tom Ford</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Newsletter</h4>
            <input
              className="border p-2 w-full"
              placeholder="Email..."
            />
          </div>
        </div>
      </footer>
    </>
  );
}