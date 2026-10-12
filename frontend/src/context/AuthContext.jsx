import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);

  // Check if first-time visitor to display welcome dialog
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('apple_product_welcome_seen');
    if (!hasSeenWelcome) {
      setWelcomeModalOpen(true);
    }
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await api.getCurrentUser();
      if (res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await api.login({ email, password });
    if (res.data?.token) {
      localStorage.setItem('apple_product_jwt', res.data.token);
    }
    setUser(res.data.user);
    closeAuthModal();
    return res.data;
  }

  async function register(fullName, email, password, confirmPassword) {
    const res = await api.register({ fullName, email, password, confirmPassword });
    if (res.data?.token) {
      localStorage.setItem('apple_product_jwt', res.data.token);
    }
    setUser(res.data.user);
    closeAuthModal();
    return res.data;
  }

  async function logout() {
    try {
      await api.logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    localStorage.removeItem('apple_product_jwt');
    setUser(null);
  }

  function openAuthModal(tab = 'login') {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
    setWelcomeModalOpen(false);
  }

  function closeAuthModal() {
    setAuthModalOpen(false);
  }

  function continueAsGuest() {
    sessionStorage.setItem('apple_product_welcome_seen', 'true');
    setWelcomeModalOpen(false);
  }

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || false;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        register,
        logout,
        authModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
        welcomeModalOpen,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
