import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Toaster from "./Toaster";

export default function Layout() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [hash, pathname]);

  return (
    <div className="bg-[#f8f5ef] min-h-screen">
      <Header />
      <Outlet />
      <Toaster />
    </div>
  );
}
