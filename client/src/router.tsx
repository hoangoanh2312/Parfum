import { createBrowserRouter } from 'react-router-dom';

import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBrands from './pages/admin/AdminBrands';

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
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'shop',
        element: <Shop />,
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
  // ======================= KHU VỰC QUẢN TRỊ (/admin) =======================
  {
    path: '/admin',
    element: (
      <AdminRoute>
        {lazyElement(<AdminLayout />)}
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'brands',
        element: <AdminBrands />,
      },
    ],
  },
]);
