import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminRoute from "./components/AdminRoute";

const AdminLayout = lazy(() => import("./components/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminBrands = lazy(() => import("./pages/admin/AdminBrands"));
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const Brand = lazy(() => import("./pages/Brand"));
const Blog = lazy(() => import("./pages/Blog"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Cart = lazy(() => import("./pages/Cart"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ThankYou = lazy(() => import("./pages/ThankYou"));

function RouteFallback() {
  return (
    <div className="flex min-h-[45vh] items-center justify-center bg-[#F8F5EF] px-6 text-sm text-[#6B665F]">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#D8CDAF] border-t-[#735C00]" />
      <span className="ml-3">Đang tải trang…</span>
    </div>
  );
}

const lazyElement = (element: ReactNode) => <Suspense fallback={<RouteFallback />}>{element}</Suspense>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: lazyElement(<Home />) },
      { path: "shop", element: lazyElement(<Shop />) },
      { path: "brand", element: lazyElement(<Brand />) },
      { path: "blog", element: lazyElement(<Blog />) },
      { path: "about", element: lazyElement(<About />) },
      { path: "login", element: lazyElement(<Login />) },
      { path: "register", element: lazyElement(<Register />) },
      { path: "cart", element: lazyElement(<Cart />) },
      { path: "products/:idOrSlug", element: lazyElement(<ProductDetail />) },
      // Khu vực cần đăng nhập
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: lazyElement(<Dashboard />) },
          { path: "orders", element: lazyElement(<Orders />) },
          { path: "orders/:id", element: lazyElement(<OrderDetail />) },
          { path: "checkout", element: lazyElement(<Checkout />) },
          { path: "thank-you/:id", element: lazyElement(<ThankYou />) },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        {lazyElement(<AdminLayout />)}
      </AdminRoute>
    ),
    children: [
      { index: true, element: lazyElement(<AdminDashboard />) },
      { path: "brands", element: lazyElement(<AdminBrands />) },
    ],
  },
]);

export default router;
