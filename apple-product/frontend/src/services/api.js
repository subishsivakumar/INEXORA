// API Client for iNexora Backend
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

// Core Fetch wrapper
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
    credentials: 'include', // Sends HttpOnly cookie
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Authentication
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getCurrentUser: () => request('/auth/me'),

  // Catalog & Categories
  getCategories: () => request('/categories'),
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.availability) query.append('availability', params.availability);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.page != null) query.append('page', params.page);
    if (params.size != null) query.append('size', params.size);
    return request(`/products?${query.toString()}`);
  },
  getFeaturedProducts: () => request('/products/featured'),
  getNewArrivals: () => request('/products/new-arrivals'),
  searchProducts: (query) => request(`/products/search?query=${encodeURIComponent(query)}`),
  getProductDetail: (idOrSlug) => request(`/products/${idOrSlug}`),
  compareProducts: (productIds) => request(`/products/compare?ids=${productIds.join(',')}`),

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
