import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useAuth } from "./store/auth.store";
import LanguageRuntime from "./components/LanguageRuntime";
import "./index.css";

function App() {
  const isBootstrapped = useAuth((s) => s.isBootstrapped);

  useEffect(() => {
    useAuth.getState().bootstrap();
  }, []);

  if (!isBootstrapped) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <LanguageRuntime />
      <RouterProvider router={router} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
