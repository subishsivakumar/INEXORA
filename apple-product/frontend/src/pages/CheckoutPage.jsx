import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle,
  Truck,
  ArrowRight,
  Loader2,
  Lock,
  PackageCheck,
  ShoppingBag,
} from 'lucide-react';
import { api, formatINR } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
  const { cart, fetchCart } = useCart();
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingPostalCode, setShippingPostalCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      openAuthModal('login');
    } else {
      setShippingName(user.fullName || '');
    }
  }, [user]);

  const items = cart?.items || [];
  const subtotal = cart?.subtotalInr || 0;

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (items.length === 0) {
      setError('Your shopping bag contains no items to checkout.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        shippingName,
        shippingPhone,
        shippingAddress,
        addressLine2,
        shippingCity,
        shippingState,
        shippingPostalCode,
      };

      const res = await api.createOrder(payload);
      setConfirmedOrder(res.data);
      // Refresh cart to show 0
      await fetchCart();
    } catch (err) {
      setError(err.message || 'Failed to place demonstration order. Please check availability.');
    } finally {
      setLoading(false);
    }
  }

  // 1. Order Confirmation Screen
  if (confirmedOrder) {
    return (
      <div className="container" style={{ padding: '80px 24px', maxWidth: '720px' }}>
        <div
          className="glass-card"
          style={{
            padding: '48px 36px',
            textAlign: 'center',
            backgroundColor: '#F5F5F7',
            borderColor: '#E5E5E5',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(176, 141, 66, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <CheckCircle size={36} color="#B08D42" />
          </div>

          <span className="badge" style={{ backgroundColor: '#171717', color: '#FFFFFF', fontWeight: 600, marginBottom: '12px' }}>
            Demonstration Order Confirmed
          </span>

          <h1 style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px', color: '#171717' }}>
            Thank You, {confirmedOrder.shippingName}
          </h1>

          <p style={{ color: '#555555', fontSize: '15px', lineHeight: 1.5, marginBottom: '28px' }}>
            Your demonstration order has been successfully saved to the MySQL database.
          </p>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E5E5', paddingBottom: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: '#555555', fontWeight: 600 }}>ORDER NUMBER</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#171717' }}>{confirmedOrder.orderNumber}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E5E5', paddingBottom: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: '#555555', fontWeight: 600 }}>DELIVERY ADDRESS</span>
              <span style={{ fontSize: '13px', color: '#171717', textAlign: 'right', maxWidth: '300px' }}>
                {confirmedOrder.shippingAddress}, {confirmedOrder.shippingCity}, {confirmedOrder.shippingState} - {confirmedOrder.shippingPostalCode}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#555555', fontWeight: 600 }}>TOTAL PAID (DEMO)</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#171717' }}>{formatINR(confirmedOrder.totalInr)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/account?tab=orders" className="btn-primary" style={{ padding: '14px 28px' }}>
              <PackageCheck size={16} />
              <span>Track in Order History</span>
            </Link>

            <Link to="/products" className="btn-secondary" style={{ padding: '14px 24px', backgroundColor: '#FFFFFF' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Checkout Entry Form
  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '32px' }}>
        <span className="badge" style={{ marginBottom: '8px' }}>Demo Checkout</span>
        <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', color: '#171717' }}>
          Delivery & Demonstration Order
        </h1>
        <p style={{ color: '#555555', fontSize: '14px', marginTop: '4px' }}>
          Safe demonstration checkout. No actual credit card or payment data is collected.
        </p>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            borderRadius: '8px',
            padding: '14px 18px',
            marginBottom: '24px',
            fontSize: '13px',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'start',
          }}
        >
          {/* Left Form: Delivery Address */}
          <div className="glass-card" style={{ padding: '32px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#171717' }}>
              <Truck size={18} color="#B08D42" />
              <span>1. Delivery Destination</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#171717', marginBottom: '6px' }}>
                  RECIPIENT FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#171717' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#171717', marginBottom: '6px' }}>
                  CONTACT PHONE NUMBER *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#171717' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#171717', marginBottom: '6px' }}>
                  STREET ADDRESS (LINE 1) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Apartment, suite, street name"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#171717' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#171717', marginBottom: '6px' }}>
                  LANDMARK / SUITE (LINE 2)
                </label>
                <input
                  type="text"
                  placeholder="Optional landmark or apartment number"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#171717' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#171717', marginBottom: '6px' }}>
                    CITY *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mumbai / Bengaluru / Delhi"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#171717' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#171717', marginBottom: '6px' }}>
                    STATE *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Maharashtra / Karnataka"
                    value={shippingState}
                    onChange={(e) => setShippingState(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#171717' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#171717', marginBottom: '6px' }}>
                    PIN CODE *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="400001 / 560001"
                    value={shippingPostalCode}
                    onChange={(e) => setShippingPostalCode(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#171717' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#171717', marginBottom: '6px' }}>
                    COUNTRY
                  </label>
                  <input
                    type="text"
                    disabled
                    value="India"
                    style={{ width: '100%', opacity: 0.8, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#171717' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E5E5E5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#555555' }}>
                <ShieldCheck size={16} color="#B08D42" />
                <span>Standard Delivery • 2–4 Business Days via Express Courier</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Placement */}
          <div className="glass-card" style={{ padding: '32px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#171717' }}>
              <ShoppingBag size={18} color="#B08D42" />
              <span>2. Bag Items ({cart?.totalQuantity || 0})</span>
            </h2>

            <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid #E5E5E5',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={item.imageUrl || (item.productSlug ? `/images/products/${item.productSlug}.svg` : '/images/fallback.svg')}
                      alt=""
                      style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = item.productSlug ? `/images/products/${item.productSlug}.svg` : '/images/fallback.svg';
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#171717' }}>{item.productName}</div>
                      <div style={{ fontSize: '11px', color: '#555555' }}>
                        Qty: {item.quantity} • {item.colourName} {item.storage ? `(${item.storage})` : ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#171717' }}>
                    {formatINR(item.totalPriceInr)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555555' }}>
                <span>Subtotal</span>
                <span style={{ color: '#171717', fontWeight: 600 }}>{formatINR(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555555' }}>
                <span>Delivery</span>
                <span style={{ color: '#B08D42', fontWeight: 600 }}>Free Express Shipping</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555555' }}>
                <span>Estimated Tax</span>
                <span style={{ color: '#171717' }}>Included (GST)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, color: '#171717', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid #E5E5E5' }}>
                <span>Total Amount</span>
                <span>{formatINR(subtotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="btn-primary"
              style={{ width: '100%', padding: '16px', marginTop: '24px', fontSize: '15px' }}
            >
              {loading ? (
                <Loader2 size={16} className="spin" />
              ) : (
                <>
                  <Lock size={16} />
                  <span>Place Demonstration Order</span>
                </>
              )}
            </button>

            <p style={{ fontSize: '11px', color: '#777777', textAlign: 'center', marginTop: '12px', lineHeight: 1.4 }}>
              By clicking "Place Demonstration Order", a transactional record will be generated in MySQL with full item snapshots.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
