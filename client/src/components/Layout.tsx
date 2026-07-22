import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Toaster from "./Toaster";

export default function Layout() {
  return (
    <div className="bg-[#f8f5ef] min-h-screen">
      <Header />
      <main className="pt-20">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
