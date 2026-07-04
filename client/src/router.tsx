import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Brand from "./pages/Brand";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "brand",
        element: <Brand />,
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

export default router;