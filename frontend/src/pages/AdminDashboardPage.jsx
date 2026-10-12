import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  BarChart3,
  DollarSign,
  Package,
  Users,
  CheckCircle,
  Truck,
  RotateCcw,
  Loader2,
  Edit2,
  Trash2,
  Save,
} from 'lucide-react';
import { api, formatINR } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage() {
  const { user, isAdmin, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAdminTab, setActiveAdminTab] = useState('orders');

  // Editing variant modal / state
  const [editingVariant, setEditingVariant] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!isAdmin) {
      alert('Access restricted to administrators only.');
      navigate('/');
      return;
    }
    loadAdminData();
  }, [user, isAdmin]);

  async function loadAdminData() {
    setLoading(true);
    try {
      const [analyticsRes, ordersRes, productsRes] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminOrders(),
        api.getProducts({ size: 50 }),
      ]);
      setAnalytics(analyticsRes.data);
      setOrders(ordersRes.data || []);
      setProducts(productsRes.data.content || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    setStatusUpdating(true);
    try {
      await api.updateOrderStatus(orderId, newStatus);
      await loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setStatusUpdating(false);
    }
  }

  async function handleSaveVariant() {
    if (!editingVariant) return;
    try {
      await api.updateVariant(editingVariant.id, Number(editPrice), Number(editStock));
      setEditingVariant(null);
      await loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to update variant');
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <Loader2 size={36} className="spin" style={{ margin: '0 auto 16px', color: '#B08D42' }} />
        <p style={{ color: '#555555' }}>Loading Administrator Portal...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Admin Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(176, 141, 66, 0.1)',
              border: '1px solid rgba(176, 141, 66, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldAlert size={20} color="#B08D42" />
          </div>
          <div>
            <span className="badge" style={{ backgroundColor: '#171717', color: '#FFFFFF', fontWeight: 600, marginBottom: '4px' }}>
              Admin Console
            </span>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#171717' }}>
              Store Operations & Inventory
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveAdminTab('orders')}
            className={activeAdminTab === 'orders' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            Customer Orders
          </button>
          <button
            onClick={() => setActiveAdminTab('products')}
            className={activeAdminTab === 'products' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            Product Catalog
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        <div className="glass-card" style={{ padding: '24px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
          <div style={{ fontSize: '12px', color: '#555555', fontWeight: 600, marginBottom: '6px' }}>TOTAL REVENUE</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#171717' }}>
            {formatINR(analytics?.totalRevenue || 0)}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
          <div style={{ fontSize: '12px', color: '#555555', fontWeight: 600, marginBottom: '6px' }}>ORDERS PLACED</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#171717' }}>
            {analytics?.totalOrders || 0}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
          <div style={{ fontSize: '12px', color: '#555555', fontWeight: 600, marginBottom: '6px' }}>CATALOG PRODUCTS</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#171717' }}>
            {analytics?.totalProducts || 0}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
          <div style={{ fontSize: '12px', color: '#555555', fontWeight: 600, marginBottom: '6px' }}>REGISTERED USERS</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#171717' }}>
            {analytics?.totalCustomers || 0}
          </div>
        </div>
      </div>

      {/* 1. ORDERS TABLE */}
      {activeAdminTab === 'orders' && (
        <div className="glass-card" style={{ padding: '28px', overflowX: 'auto', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', color: '#171717' }}>
            Customer Orders Management ({orders.length})
          </h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '680px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E5E5', color: '#555555', fontSize: '12px', fontWeight: 600 }}>
                <th style={{ padding: '12px 16px' }}>ORDER NUMBER</th>
                <th style={{ padding: '12px 16px' }}>CUSTOMER</th>
                <th style={{ padding: '12px 16px' }}>AMOUNT</th>
                <th style={{ padding: '12px 16px' }}>STATUS</th>
                <th style={{ padding: '12px 16px' }}>DATE</th>
                <th style={{ padding: '12px 16px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id} style={{ borderBottom: '1px solid #E5E5E5', fontSize: '13px' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#171717' }}>{ord.orderNumber}</td>
                  <td style={{ padding: '14px 16px', color: '#555555' }}>{ord.shippingName}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#171717' }}>{formatINR(ord.totalInr)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="badge">{ord.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#555555' }}>
                    {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <select
                      value={ord.status}
                      disabled={statusUpdating}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '4px', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#171717' }}
                    >
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. PRODUCTS INVENTORY TABLE */}
      {activeAdminTab === 'products' && (
        <div className="glass-card" style={{ padding: '28px', overflowX: 'auto', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', color: '#171717' }}>
            Products & Pricing Overview ({products.length})
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {products.map((p) => (
              <div
                key={p.id}
                style={{
                  padding: '16px',
                  backgroundColor: '#F5F5F7',
                  border: '1px solid #E5E5E5',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div style={{ width: '48px', height: '48px', backgroundColor: '#FFFFFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', border: '1px solid #EAEAEA' }}>
                  <img
                    src={p.primaryImageUrl || `/images/products/${p.slug}.svg`}
                    alt=""
                    style={{ maxHeight: '40px', maxWidth: '40px', objectFit: 'contain' }}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `/images/products/${p.slug}.svg`;
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>{p.name}</div>
                  <div style={{ fontSize: '12px', color: '#555555' }}>{p.categoryName}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#171717', marginTop: '4px' }}>{formatINR(p.basePriceInr)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
