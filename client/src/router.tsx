import { createBrowserRouter } from 'react-router-dom';

import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
]);
