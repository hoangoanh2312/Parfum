import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminRoute from "./components/AdminRoute";
import RouteErrorPage from "./components/RouteErrorPage";

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
  return <div className="min-h-[55vh] bg-[#F8F5F0] px-5 py-12"><div className="mx-auto max-w-6xl space-y-4"><div className="h-9 w-56 animate-pulse rounded bg-stone-200 motion-reduce:animate-none" /><div className="h-4 w-80 max-w-full animate-pulse rounded bg-stone-200 motion-reduce:animate-none" /><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="aspect-[4/5] animate-pulse rounded bg-stone-200 motion-reduce:animate-none" />)}</div></div></div>;
}

const lazyElement = (element: ReactNode) => <Suspense fallback={<RouteFallback />}>{element}</Suspense>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <RouteErrorPage />,
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
    errorElement: <RouteErrorPage />,
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
