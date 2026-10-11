import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchCart();
  }, [user]);

  async function fetchCart() {
    setLoading(true);
    try {
      const res = await api.getCart();
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(productId, variantId, quantity = 1) {
    setLoading(true);
    try {
      const res = await api.addToCart(productId, variantId, quantity);
      setCart(res.data);
      setDrawerOpen(true);
      return res.data;
    } catch (err) {
      console.error('Failed to add to cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(itemId, quantity) {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }
    setLoading(true);
    try {
      const res = await api.updateCartItem(itemId, quantity);
      setCart(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to update cart item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function removeFromCart(itemId) {
    setLoading(true);
    try {
      const res = await api.removeCartItem(itemId);
      setCart(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to remove cart item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  const cartCount = cart?.totalQuantity || 0;
  const cartSubtotal = cart?.subtotalInr || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        cartSubtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        fetchCart,
        drawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
