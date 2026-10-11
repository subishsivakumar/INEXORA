// API Client for iNexora Backend with Autonomous Offline Fallback
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from './fallbackData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Retrieve or generate guest session token
export function getGuestSessionToken() {
  let token = localStorage.getItem('apple_product_session');
  if (!token) {
    token = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('apple_product_session', token);
  }
  return token;
}

// Format number in Indian Rupee format (e.g. ₹1,29,900)
export function formatINR(amount) {
  if (amount == null) return 'Price unavailable';
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(num)) return 'Price unavailable';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
}

// Core Fetch wrapper with Vercel HTML SPA rewrite interception
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const sessionToken = getGuestSessionToken();
  const authToken = localStorage.getItem('apple_product_jwt');

  const headers = {
    'Content-Type': 'application/json',
    'X-Session-Token': sessionToken,
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type') || '';

    // If Vercel rewrote /api to index.html (text/html) or returned 404/500
    if (contentType.includes('text/html') || !response.ok) {
      throw new Error(`API Endpoint returned non-JSON response (${response.status}) on ${endpoint}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`[iNexora API] Backend unavailable on ${endpoint}. Error: ${error.message}`);
    throw error;
  }
}

export const api = {
  // Authentication
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getCurrentUser: () => request('/auth/me'),

  // Catalog & Categories with Resilient Verified Fallback
  getCategories: async () => {
    try {
      return await request('/categories');
    } catch {
      return { success: true, data: FALLBACK_CATEGORIES };
    }
  },

  getProducts: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.category) query.append('category', params.category);
      if (params.minPrice) query.append('minPrice', params.minPrice);
      if (params.maxPrice) query.append('maxPrice', params.maxPrice);
      if (params.availability) query.append('availability', params.availability);
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.page != null) query.append('page', params.page);
      if (params.size != null) query.append('size', params.size);
      return await request(`/products?${query.toString()}`);
    } catch {
      let filtered = [...FALLBACK_PRODUCTS];
      if (params.category) {
        filtered = filtered.filter(p => p.categorySlug === params.category);
      }
      if (params.maxPrice) {
        filtered = filtered.filter(p => p.basePriceInr <= params.maxPrice);
      }
      if (params.sortBy === 'price_asc') {
        filtered.sort((a, b) => a.basePriceInr - b.basePriceInr);
      } else if (params.sortBy === 'price_desc') {
        filtered.sort((a, b) => b.basePriceInr - a.basePriceInr);
      }

      return {
        success: true,
        data: {
          content: filtered,
          totalElements: filtered.length,
          totalPages: 1,
          number: 0,
          size: filtered.length,
        }
      };
    }
  },

  getFeaturedProducts: async () => {
    try {
      return await request('/products/featured');
    } catch {
      return { success: true, data: FALLBACK_PRODUCTS.filter(p => p.featured) };
    }
  },

  getNewArrivals: async () => {
    try {
      return await request('/products/new-arrivals');
    } catch {
      return { success: true, data: FALLBACK_PRODUCTS.filter(p => p.isNewArrival) };
    }
  },

  searchProducts: async (query) => {
    try {
      return await request(`/products/search?query=${encodeURIComponent(query)}`);
    } catch {
      const q = (query || '').toLowerCase();
      const matched = FALLBACK_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
      );
      return { success: true, data: matched };
    }
  },

  getProductDetail: async (idOrSlug) => {
    try {
      return await request(`/products/${idOrSlug}`);
    } catch {
      const product = FALLBACK_PRODUCTS.find(p => p.id === Number(idOrSlug) || p.slug === idOrSlug) || FALLBACK_PRODUCTS[0];
      return { success: true, data: product };
    }
  },

  compareProducts: async (productIds) => {
    try {
      return await request(`/products/compare?ids=${productIds.join(',')}`);
    } catch {
      const idSet = new Set((productIds || []).map(Number));
      const matched = FALLBACK_PRODUCTS.filter(p => idSet.has(p.id));
      return { success: true, data: matched };
    }
  },

  // Cart
  getCart: () => request('/cart'),
  addToCart: (productId, variantId, quantity = 1) =>
    request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, variantId, quantity }),
    }),
  updateCartItem: (itemId, quantity) =>
    request(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }),
  removeCartItem: (itemId) =>
    request(`/cart/items/${itemId}`, { method: 'DELETE' }),
  mergeCart: () => request('/cart/merge', { method: 'POST' }),

  // Wishlist
  getWishlist: () => request('/wishlist'),
  addToWishlist: (productId) => request(`/wishlist/${productId}`, { method: 'POST' }),
  removeFromWishlist: (productId) => request(`/wishlist/${productId}`, { method: 'DELETE' }),
  moveToCartFromWishlist: (productId, variantId) =>
    request(`/wishlist/${productId}/move-to-cart${variantId ? `?variantId=${variantId}` : ''}`, { method: 'POST' }),

  // Orders & Checkout
  createOrder: (payload) => request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  getUserOrders: () => request('/orders'),
  getOrderDetails: (orderNumber) => request(`/orders/${orderNumber}`),

  // Admin
  getAdminAnalytics: () => request('/admin/analytics'),
  getAdminOrders: () => request('/admin/orders'),
  updateOrderStatus: (orderId, status) =>
    request(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  updateVariant: (variantId, priceInr, stockQuantity) =>
    request(`/admin/variants/${variantId}`, {
      method: 'PATCH',
      body: JSON.stringify({ priceInr, stockQuantity }),
    }),
  deleteProduct: (productId) =>
    request(`/admin/products/${productId}`, { method: 'DELETE' }),
};
