import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Brand from "./pages/Brand";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import ProductDetail from "./pages/ProductDetail";
import AccountLayout from "./pages/Account";
import AccountOverview from "./pages/account/AccountOverview";
import OrderHistory from "./pages/account/OrderHistory";
import Wishlist from "./pages/account/Wishlist";
import SavedAddresses from "./pages/account/SavedAddresses";
import ScentProfile from "./pages/account/ScentProfile";
import Settings from "./pages/account/Settings";
import Contact from "./pages/Contact";
// Trang quản trị
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminVariants from "./pages/admin/AdminVariants";
import AdminBrands from "./pages/admin/AdminBrands";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReviewsPage from "./pages/admin/AdminReviews";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "brand", element: <Brand /> },
      { path: "blog", element: <Blog /> },
      { path: "blog/:slug", element: <BlogPost /> },
      { path: "contact", element: <Contact /> },
      { path: "about", element: <About /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "thank-you/:id", element: <ThankYou /> },
      { path: "products/:idOrSlug", element: <ProductDetail /> },
      { path: "product/:idOrSlug", element: <ProductDetail /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "orders", element: <Orders /> },
          { path: "orders/:id", element: <OrderDetail /> },
          {
            path: "account",
            element: <AccountLayout />,
            children: [
              { index: true, element: <AccountOverview /> },
              { path: "orders", element: <OrderHistory /> },
              { path: "wishlist", element: <Wishlist /> },
              { path: "addresses", element: <SavedAddresses /> },
              { path: "scent-profile", element: <ScentProfile /> },
              { path: "settings", element: <Settings /> },
            ],
          },
        ],
      },
    ],
  },
  // ======================= KHU VỰC QUẢN TRỊ (/admin) =======================
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "products", element: <AdminProducts /> },
      { path: "variants", element: <AdminVariants /> },
      { path: "brands", element: <AdminBrands /> },
      { path: "categories", element: <AdminCategories /> },
      { path: "media", element: <AdminMedia /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "users", element: <AdminUsers /> },
      { path: "reviews", element: <AdminReviewsPage /> },
    ],
  },
]);
