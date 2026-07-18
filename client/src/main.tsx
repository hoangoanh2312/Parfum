<<<<<<< HEAD
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAuth } from './store/auth.store';
import './index.css';
=======
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useAuth } from "./store/auth.store";
import "./index.css";
>>>>>>> feature/pf-32-category-brand-crud

function App() {
  const isBootstrapped = useAuth((s) => s.isBootstrapped);

  useEffect(() => {
    useAuth.getState().bootstrap();
  }, []);

  if (!isBootstrapped) {
<<<<<<< HEAD
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
=======
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
>>>>>>> feature/pf-32-category-brand-crud
  }

  return <RouterProvider router={router} />;
}

<<<<<<< HEAD
ReactDOM.createRoot(document.getElementById('root')!).render(
=======
ReactDOM.createRoot(document.getElementById("root")!).render(
>>>>>>> feature/pf-32-category-brand-crud
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
