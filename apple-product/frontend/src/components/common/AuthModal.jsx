import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, ShieldAlert, KeyRound } from 'lucide-react';

export default function AuthModal() {
  const { authModalOpen, authModalTab, setAuthModalTab, closeAuthModal, login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authModalTab === 'login') {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        await register(fullName, email, password, confirmPassword);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  function handleQuickLogin(role) {
    setError('');
    if (role === 'admin') {
      setEmail('admin@appleproduct.store');
      setPassword('Customer@Password2026');
    } else {
      setEmail('customer@appleproduct.store');
      setPassword('Customer@Password2026');
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content" style={{ maxWidth: '440px', padding: '32px', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)' }}>
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: '#171717',
            padding: '4px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          aria-label="Close Authentication Dialog"
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', color: '#171717' }}>
            {authModalTab === 'login' ? 'Sign In with iNexora ID' : 'Create Your iNexora ID'}
          </h3>
          <p style={{ fontSize: '12px', color: '#555555', marginTop: '4px' }}>
            {authModalTab === 'login'
              ? 'Access saved wishlist, order history, and express checkout.'
              : 'Join to save configurations, track deliveries, and compare products.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#F5F5F7',
            borderRadius: 'var(--radius-full)',
            padding: '4px',
            marginBottom: '20px',
            border: '1px solid #E5E5E5',
          }}
        >
          <button
            type="button"
            onClick={() => { setAuthModalTab('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: 'var(--radius-full)',
              backgroundColor: authModalTab === 'login' ? '#171717' : 'transparent',
              color: authModalTab === 'login' ? '#FFFFFF' : '#555555',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthModalTab('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: 'var(--radius-full)',
              backgroundColor: authModalTab === 'register' ? '#171717' : 'transparent',
              color: authModalTab === 'register' ? '#FFFFFF' : '#555555',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '12px',
              color: '#B91C1C',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {authModalTab === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#171717', marginBottom: '6px' }}>
                FULL NAME
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', paddingLeft: '38px', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#171717' }}
                />
                <UserIcon size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#B08D42' }} />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#171717', marginBottom: '6px' }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#171717' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#B08D42' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#171717', marginBottom: '6px' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#171717' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#B08D42' }} />
            </div>
          </div>

          {authModalTab === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#171717', marginBottom: '6px' }}>
                CONFIRM PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', paddingLeft: '38px', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#171717' }}
                />
                <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#B08D42' }} />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '6px', fontSize: '14px' }}
          >
            {loading ? 'Authenticating...' : authModalTab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        {authModalTab === 'login' && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E5E5E5' }}>
            <div style={{ fontSize: '11px', color: '#555555', marginBottom: '10px', textAlign: 'center' }}>
              Quick Demo Fill Credentials:
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('customer')}
                className="btn-secondary"
                style={{ flex: 1, padding: '8px 12px', fontSize: '11px', backgroundColor: '#F5F5F7' }}
              >
                Fill Customer
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="btn-secondary"
                style={{ flex: 1, padding: '8px 12px', fontSize: '11px', backgroundColor: '#F5F5F7' }}
              >
                Fill Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
