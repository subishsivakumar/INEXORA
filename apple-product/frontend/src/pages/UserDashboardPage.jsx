import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ShoppingBag,
  ExternalLink,
  Loader2,
  Trash2,
} from 'lucide-react';
import { api, formatINR } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function UserDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'orders';

  const { user, logout, openAuthModal } = useAuth();
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();
  const { fetchCart } = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (activeTab === 'orders') {
      loadOrders();
    }
  }, [user, activeTab]);

  async function loadOrders() {
    setLoadingOrders(true);
    try {
      const res = await api.getUserOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load user orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }

  function handleTabChange(tab) {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next);
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Please Sign In</h2>
        <p style={{ color: 'rgba(245, 245, 247, 0.6)', marginBottom: '24px' }}>
          Authentication is required to view account data and order records.
        </p>
        <button onClick={() => openAuthModal('login')} className="btn-primary">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Account Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '24px',
          borderBottom: '1px solid #E5E5E5',
          marginBottom: '32px',
        }}
      >
        <div>
          <span className="badge" style={{ marginBottom: '6px' }}>Account Dashboard</span>
          <h1 style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.02em', color: '#171717' }}>
            Welcome, {user.fullName}
          </h1>
          <div style={{ fontSize: '13px', color: '#555555', marginTop: '2px' }}>
            {user.email}
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="btn-secondary"
          style={{ padding: '8px 18px', fontSize: '13px', backgroundColor: '#FFFFFF' }}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '36px',
          alignItems: 'start',
        }}
      >
        {/* Navigation Sidebar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            backgroundColor: '#F5F5F7',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            border: '1px solid #E5E5E5',
          }}
        >
          <button
            onClick={() => handleTabChange('orders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: 500,
              backgroundColor: activeTab === 'orders' ? '#171717' : 'transparent',
              color: activeTab === 'orders' ? '#FFFFFF' : '#555555',
              transition: 'all 0.2s ease',
              textAlign: 'left',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Package size={16} />
            <span style={{ fontWeight: activeTab === 'orders' ? 600 : 500 }}>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('wishlist')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: 500,
              backgroundColor: activeTab === 'wishlist' ? '#171717' : 'transparent',
              color: activeTab === 'wishlist' ? '#FFFFFF' : '#555555',
              transition: 'all 0.2s ease',
              textAlign: 'left',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Heart size={16} />
            <span style={{ fontWeight: activeTab === 'wishlist' ? 600 : 500 }}>Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: 500,
              backgroundColor: activeTab === 'profile' ? '#171717' : 'transparent',
              color: activeTab === 'profile' ? '#FFFFFF' : '#555555',
              transition: 'all 0.2s ease',
              textAlign: 'left',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <User size={16} />
            <span style={{ fontWeight: activeTab === 'profile' ? 600 : 500 }}>Profile & Security</span>
          </button>
        </div>

        {/* Content Pane */}
        <div style={{ gridColumn: 'span 2' }}>
          {/* 1. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: '#171717' }}>Your Orders</h2>

              {loadingOrders ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#B08D42' }}>
                  <Loader2 size={24} className="spin" style={{ margin: '0 auto 8px' }} />
                  <p>Retrieving database records...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
                  <Package size={36} style={{ color: '#B08D42', margin: '0 auto 12px' }} />
                  <h3 style={{ fontSize: '16px', marginBottom: '6px', color: '#171717' }}>No orders placed yet</h3>
                  <p style={{ color: '#555555', fontSize: '13px', marginBottom: '20px' }}>
                    When you place demonstration orders, your order tracking records will be listed here.
                  </p>
                  <button onClick={() => navigate('/products')} className="btn-secondary" style={{ backgroundColor: '#FFFFFF' }}>Explore Products</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {orders.map((ord) => (
                    <div key={ord.id} className="glass-card" style={{ padding: '24px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '12px',
                          borderBottom: '1px solid #E5E5E5',
                          paddingBottom: '14px',
                          marginBottom: '16px',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '12px', color: '#555555', fontWeight: 600 }}>ORDER NUMBER</div>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#171717' }}>{ord.orderNumber}</div>
                        </div>

                        <div>
                          <div style={{ fontSize: '12px', color: '#555555', fontWeight: 600 }}>STATUS</div>
                          <span className="badge" style={{ marginTop: '2px' }}>{ord.status}</span>
                        </div>

                        <div>
                          <div style={{ fontSize: '12px', color: '#555555', fontWeight: 600 }}>TOTAL AMOUNT</div>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#171717' }}>{formatINR(ord.totalInr)}</div>
                        </div>
                      </div>

                      {/* Items Ordered */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {ord.items?.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '13px',
                              color: '#171717',
                            }}
                          >
                            <span>
                              {item.productName} ({item.colourName}{item.storage ? `, ${item.storage}` : ''}) × {item.quantity}
                            </span>
                            <span style={{ fontWeight: 600, color: '#171717' }}>{formatINR(item.totalPriceInr)}</span>
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          marginTop: '16px',
                          paddingTop: '12px',
                          borderTop: '1px solid #E5E5E5',
                          fontSize: '11px',
                          color: '#555555',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>Deliver to: {ord.shippingName}, {ord.shippingCity}</span>
                        <span>Date: {new Date(ord.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: '#171717' }}>Your Saved Wishlist</h2>

              {wishlist.length === 0 ? (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
                  <Heart size={36} style={{ color: '#B08D42', margin: '0 auto 12px' }} />
                  <h3 style={{ fontSize: '16px', marginBottom: '6px', color: '#171717' }}>Your wishlist is empty</h3>
                  <p style={{ color: '#555555', fontSize: '13px', marginBottom: '20px' }}>
                    Save devices by clicking the heart icon on any product page.
                  </p>
                  <button onClick={() => navigate('/products')} className="btn-secondary" style={{ backgroundColor: '#FFFFFF' }}>Explore Products</button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                  {wishlist.map((item) => (
                    <div key={item.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
                      <div>
                        <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '12px' }}>
                          <img
                            src={item.imageUrl || '/images/fallback.svg'}
                            alt={item.productName || ''}
                            style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/fallback.svg';
                            }}
                          />
                        </div>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                          {item.productName}
                        </h4>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#171717', marginBottom: '16px' }}>
                          {formatINR(item.basePriceInr)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => moveToCart(item.productId)}
                          className="btn-primary"
                          style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                        >
                          <ShoppingBag size={14} />
                          <span>Move to Bag</span>
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.productId)}
                          style={{
                            padding: '8px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid #E5E5E5',
                            backgroundColor: '#FFFFFF',
                            color: '#555555',
                            cursor: 'pointer',
                          }}
                          title="Remove from wishlist"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="glass-card" style={{ padding: '32px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: '#171717' }}>Profile Information</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '440px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#555555', marginBottom: '4px' }}>
                    FULL NAME
                  </label>
                  <div style={{ fontSize: '15px', color: '#171717', fontWeight: 600 }}>{user.fullName}</div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#555555', marginBottom: '4px' }}>
                    EMAIL ADDRESS
                  </label>
                  <div style={{ fontSize: '15px', color: '#171717' }}>{user.email}</div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#555555', marginBottom: '4px' }}>
                    ASSIGNED ROLES
                  </label>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    {user.roles?.map((r) => (
                      <span key={r} className="badge">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
