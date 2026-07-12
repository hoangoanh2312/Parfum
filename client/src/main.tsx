import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';
import { useAuth } from './store/auth.store';
import { useWishlist } from './store/wishlist.store';

function AppWrapper() {
  const user = useAuth((s) => s.user);
  const fetchWishlist = useWishlist((s) => s.fetchWishlist);
  const clearWishlist = useWishlist((s) => s.clearWishlist);

  useEffect(() => {
    if (user) fetchWishlist();
    else clearWishlist();
  }, [user, fetchWishlist, clearWishlist]);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
);
