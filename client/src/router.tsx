<<<<<<< HEAD
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import Brand from './pages/Brand';
import Blog from './pages/Blog';
import About from './pages/About';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import AdminReviews from './pages/AdminReviews';
=======
import { createBrowserRouter } from "react-router-dom";
>>>>>>> 370e5a108f256acb306946aad424ff837135ade1

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./components/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBrands from "./pages/admin/AdminBrands";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Brand from "./pages/Brand";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
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
<<<<<<< HEAD
      { path: 'shop', element: <Shop /> },
      { path: 'brand', element: <Brand /> },
      { path: 'blog', element: <Blog /> },
      { path: 'about', element: <About /> },
      { path: 'cart', element: <Cart /> },
      { path: 'products/:idOrSlug', element: <ProductDetail /> },
      { path: 'product/:idOrSlug', element: <ProductDetail /> },
      { path: 'admin/reviews', element: <AdminReviews /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
=======
      { path: "shop", element: <Shop /> },
      { path: "brand", element: <Brand /> },
      { path: "blog", element: <Blog /> },
      { path: "about", element: <About /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "cart", element: <Cart /> },
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
>>>>>>> 370e5a108f256acb306946aad424ff837135ade1
    ],
  },
]);

export default router;
