import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import WishlistPage from './pages/Wishlist';
import RequireAuth from './components/RequireAuth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
        { path: 'wishlist', element: <RequireAuth><WishlistPage /></RequireAuth> },
      { path: 'login', element: <Login /> },
    ],
  },
]);
