import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Toaster from "./Toaster";

export default function Layout() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  return (
    <div className="bg-[#f8f5ef] min-h-screen">
      <Header />
      <Outlet />
      <Toaster />
    </div>
  );
}
