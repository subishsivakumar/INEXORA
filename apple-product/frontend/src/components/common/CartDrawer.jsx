import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../services/api';

export default function CartDrawer() {
  const { cart, drawerOpen, closeDrawer, updateQuantity, removeFromCart, loading } = useCart();
  const navigate = useNavigate();

  if (!drawerOpen) return null;

  const items = cart?.items || [];
  const subtotal = cart?.subtotalInr || 0;

  function handleCheckout() {
    closeDrawer();
    navigate('/checkout');
  }

  function handleViewBag() {
    closeDrawer();
    navigate('/cart');
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={closeDrawer}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          borderLeft: '1px solid #E5E5E5',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E5E5E5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} color="#B08D42" />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#171717' }}>
              Your Bag ({cart?.totalQuantity || 0})
            </h3>
          </div>
          <button
            onClick={closeDrawer}
            style={{ color: '#171717', padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Close Shopping Bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#555555' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(176, 141, 66, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: '#B08D42',
                }}
              >
                <ShoppingBag size={24} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#171717', marginBottom: '6px' }}>
                Your Bag is empty
              </h4>
              <p style={{ fontSize: '13px', lineHeight: 1.5, marginBottom: '20px' }}>
                Explore Apple devices and add your favourite configurations.
              </p>
              <button onClick={() => { closeDrawer(); navigate('/products'); }} className="btn-secondary">
                Explore Catalog
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #E5E5E5',
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '10px',
                      backgroundColor: '#F5F5F7',
                      border: '1px solid #E5E5E5',
                      overflow: 'hidden',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                    }}
                  >
                    <img
                      src={item.imageUrl || '/images/fallback.svg'}
                      alt={item.productName}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/fallback.svg';
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{ color: '#888888', padding: '2px', background: 'none', border: 'none', cursor: 'pointer' }}
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div style={{ fontSize: '12px', color: '#555555', marginTop: '2px' }}>
                        {item.colourName} {item.storage ? `• ${item.storage}` : ''}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      {/* Quantity Controls */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          backgroundColor: '#F5F5F7',
                          borderRadius: 'var(--radius-full)',
                          padding: '2px 8px',
                          border: '1px solid #E5E5E5',
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={loading}
                          style={{ padding: '4px', display: 'flex', background: 'none', border: 'none', color: '#171717', cursor: 'pointer' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '13px', fontWeight: 600, minWidth: '16px', textAlign: 'center', color: '#171717' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={loading}
                          style={{ padding: '4px', display: 'flex', background: 'none', border: 'none', color: '#171717', cursor: 'pointer' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Total Price */}
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#171717' }}>
                        {formatINR(item.totalPriceInr)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid #E5E5E5',
              backgroundColor: '#F5F5F7',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#555555' }}>Subtotal</span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#171717' }}>{formatINR(subtotal)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '12px', color: '#555555' }}>
              <span>Shipping</span>
              <span style={{ color: '#B08D42', fontWeight: 600 }}>Free Delivery</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%', padding: '14px' }}>
                <span>Demo Checkout</span>
                <ArrowRight size={16} />
              </button>

              <button onClick={handleViewBag} className="btn-secondary" style={{ width: '100%', padding: '12px', backgroundColor: '#FFFFFF' }}>
                Review Full Bag
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
