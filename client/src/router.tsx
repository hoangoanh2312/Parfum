import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import Brand from './pages/Brand';
import Blog from './pages/Blog';
import About from './pages/About';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ThankYou from './pages/ThankYou';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import ProductDetail from './pages/ProductDetail';
import AdminReviews from './pages/AdminReviews';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'brand', element: <Brand /> },
      { path: 'blog', element: <Blog /> },
      { path: 'about', element: <About /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'thank-you/:id', element: <ThankYou /> },
      { path: 'products/:idOrSlug', element: <ProductDetail /> },
      { path: 'product/:idOrSlug', element: <ProductDetail /> },
      { path: 'admin/reviews', element: <AdminReviews /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'orders', element: <Orders /> },
          { path: 'orders/:id', element: <OrderDetail /> },
        ],
      },
    ],
  },
]);
