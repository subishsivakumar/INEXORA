import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../services/api';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const subtotal = cart?.subtotalInr || 0;

  function handleProceedToCheckout() {
    if (!user) {
      openAuthModal('login');
      return;
    }
    navigate('/checkout');
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'rgba(176, 141, 66, 0.1)',
            border: '1px solid rgba(176, 141, 66, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: '#B08D42',
          }}
        >
          <ShoppingBag size={32} />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px', letterSpacing: '-0.02em', color: '#171717' }}>
          Your Bag is Empty
        </h1>
        <p style={{ color: '#555555', fontSize: '15px', maxWidth: '440px', margin: '0 auto 32px' }}>
          Items you add to your shopping bag will appear here with verified Apple specifications and pricing.
        </p>
        <Link to="/products" className="btn-primary" style={{ padding: '14px 32px' }}>
          Explore iNexora Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '36px', color: '#171717' }}>
        Review your Bag ({cart?.totalQuantity || 0} {cart?.totalQuantity === 1 ? 'item' : 'items'})
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {items.map((item) => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                padding: '24px',
                display: 'flex',
                gap: '24px',
                alignItems: 'center',
                backgroundColor: '#F5F5F7',
                border: '1px solid #E5E5E5',
              }}
            >
              {/* Product Thumbnail */}
              <div
                style={{
                  width: '96px',
                  height: '96px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  flexShrink: 0,
                  border: '1px solid #E5E5E5',
                }}
              >
                <img
                  src={item.imageUrl || '/images/fallback.svg'}
                  alt={item.productName}
                  style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/fallback.svg';
                  }}
                />
              </div>

              {/* Item Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Link to={`/product/${item.productSlug}`}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#171717' }}>
                      {item.productName}
                    </h3>
                  </Link>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ color: '#888888', padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ fontSize: '13px', color: '#555555', marginTop: '4px', marginBottom: '16px' }}>
                  {item.colourName} {item.storage ? `• ${item.storage}` : ''}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* Quantity Stepper */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-full)',
                      padding: '4px 10px',
                      border: '1px solid #E5E5E5',
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={loading}
                      style={{ padding: '4px', background: 'none', border: 'none', color: '#171717', cursor: 'pointer' }}
                    >
                      <Minus size={13} />
                    </button>
                    <span style={{ fontSize: '14px', fontWeight: 600, minWidth: '18px', textAlign: 'center', color: '#171717' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={loading}
                      style={{ padding: '4px', background: 'none', border: 'none', color: '#171717', cursor: 'pointer' }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#171717' }}>
                      {formatINR(item.totalPriceInr)}
                    </div>
                    {item.quantity > 1 && (
                      <div style={{ fontSize: '11px', color: '#555555' }}>
                        {formatINR(item.unitPriceInr)} each
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary */}
        <div className="glass-card" style={{ padding: '32px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: '#171717' }}>Order Summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid #E5E5E5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555555' }}>
              <span>Subtotal</span>
              <span style={{ color: '#171717', fontWeight: 600 }}>{formatINR(subtotal)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555555' }}>
              <span>Standard Delivery</span>
              <span style={{ color: '#B08D42', fontWeight: 600 }}>Free</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555555' }}>
              <span>Taxes (GST Included)</span>
              <span style={{ color: '#171717' }}>₹0.00</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '20px 0 28px' }}>
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#171717' }}>Total</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#171717' }}>{formatINR(subtotal)}</span>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '15px' }}
          >
            <span>Proceed to Demo Checkout</span>
            <ArrowRight size={16} />
          </button>

          {!user && (
            <p style={{ fontSize: '11px', color: '#555555', textAlign: 'center', marginTop: '12px' }}>
              Sign in is required to complete demonstration checkout and save order records.
            </p>
          )}

          <div
            style={{
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid #E5E5E5',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '12px',
              color: '#555555',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={14} color="#B08D42" />
              <span>Safe Demonstration Architecture (No card required)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={14} color="#B08D42" />
              <span>Orders safely transactionally committed to MySQL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
