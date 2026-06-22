import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b p-4 flex gap-4">
        <Link to="/" className="font-bold">HOC PARFUM</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/login" className="ml-auto">Dang nhap</Link>
      </header>
      <main className="flex-1 p-6"><Outlet /></main>
      <footer className="border-t p-4 text-center text-sm text-gray-500">(c) HOC PARFUM</footer>
    </div>
  );
}
