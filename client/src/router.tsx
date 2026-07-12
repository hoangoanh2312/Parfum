import { createBrowserRouter } from 'react-router-dom';

import Layout from './components/Layout';

import AdminLayout from './components/AdminLayout';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBrands from './pages/admin/AdminBrands';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Brand from './pages/Brand';
import Blog from './pages/Blog';
import About from './pages/About';
import Login from './pages/Login';
import Cart from './pages/Cart';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
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
        path: 'brand',
        element: <Brand />,
      },
      {
        path: 'blog',
        element: <Blog />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
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

export default router;
