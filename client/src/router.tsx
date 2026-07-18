import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./components/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBrands from "./pages/admin/AdminBrands";
import AdminCategories from "./pages/admin/AdminCategories";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Brand from "./pages/Brand";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "brand", element: <Brand /> },
      { path: "blog", element: <Blog /> },
      { path: "about", element: <About /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "cart", element: <Cart /> },
      { path: "products/:idOrSlug", element: <ProductDetail /> },
      // Khu vực cần đăng nhập
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "orders", element: <Orders /> },
          { path: "orders/:id", element: <OrderDetail /> },
          { path: "checkout", element: <Checkout /> },
          { path: "thank-you/:id", element: <ThankYou /> },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "brands", element: <AdminBrands /> },
      { path: "categories", element: <AdminCategories /> },
    ],
  },
]);

export default router;
