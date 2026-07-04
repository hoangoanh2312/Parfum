import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function Layout() {
  return (
    <div className="bg-[#f8f5ef] min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
}