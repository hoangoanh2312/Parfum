import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Account from './pages/Account';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'cart', element: <Cart /> },
      { path: 'products/:idOrSlug', element: <ProductDetail /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: 'account', element: <Account /> }],
      },
    ],
  },
]);
