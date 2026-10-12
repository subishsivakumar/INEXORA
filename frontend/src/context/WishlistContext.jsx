import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, openAuthModal } = useAuth();
  const { fetchCart } = useCart();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  async function fetchWishlist() {
    setLoading(true);
    try {
      const res = await api.getWishlist();
      setWishlist(res.data.items || []);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  }

  function isInWishlist(productId) {
    return wishlist.some((item) => item.productId === productId);
  }

  async function toggleWishlist(productId) {
    if (!user) {
      openAuthModal('login');
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist(productId)) {
        const res = await api.removeFromWishlist(productId);
        setWishlist(res.data.items || []);
      } else {
        const res = await api.addToWishlist(productId);
        setWishlist(res.data.items || []);
      }
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
    } finally {
      setLoading(false);
    }
  }

  async function moveToCart(productId, variantId) {
    if (!user) {
      openAuthModal('login');
      return;
    }

    try {
      const res = await api.moveToCartFromWishlist(productId, variantId);
      setWishlist(res.data.items || []);
      await fetchCart();
    } catch (err) {
      console.error('Failed to move item to cart:', err);
    }
  }

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
        moveToCart,
        fetchWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
