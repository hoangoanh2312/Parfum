import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AccountLayout from "./pages/Account";
import AccountOverview from "./pages/account/AccountOverview";
import SavedAddresses from "./pages/account/SavedAddresses";
import ScentProfile from "./pages/account/ScentProfile";
import Settings from "./pages/account/Settings";
import OrderHistory from "./pages/account/OrderHistory";
import Wishlist from "./pages/account/Wishlist";

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
        children: [
          {
            path: "account",
            element: <AccountLayout />,
            children: [
              {
                index: true,
                element: <AccountOverview />,
              },
              {
                path: "orders",
                element: <OrderHistory />,
              },
              {
                path: "wishlist",
                element: <Wishlist />,
              },
              {
                path: "addresses",
                element: <SavedAddresses />,
              },
              {
                path: "scent-profile",
                element: <ScentProfile />,
              },
              {
                path: "settings",
                element: <Settings />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
