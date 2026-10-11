import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { api, formatINR } from '../../services/api';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query.trim());
      } else {
        setResults([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  async function performSearch(q) {
    setLoading(true);
    try {
      const res = await api.searchProducts(q);
      setResults(res.data || []);
    } catch (err) {
      console.error('Search query failed:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(slug) {
    onClose();
    navigate(`/product/${slug}`);
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        style={{
          maxWidth: '620px',
          padding: '24px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E5E5',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#555555',
            }}
          />
          <input
            type="text"
            autoFocus
            placeholder="Search iPhone, MacBook Pro, AirPods, Apple Watch..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '44px',
              paddingRight: '40px',
              height: '48px',
              fontSize: '15px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #E5E5E5',
              backgroundColor: '#F5F5F7',
              color: '#171717',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#555555',
                padding: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results Area */}
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#B08D42' }}>
              <Loader2 size={24} className="spin" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
              <p style={{ fontSize: '13px', color: '#555555' }}>Searching catalog...</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#555555', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                Products ({results.length})
              </div>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelect(product.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#F5F5F7',
                    border: '1px solid #E5E5E5',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#B08D42';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F5F5F7';
                    e.currentTarget.style.borderColor = '#E5E5E5';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #EAEAEA',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        padding: '4px',
                      }}
                    >
                      {product.primaryImageUrl ? (
                        <img src={product.primaryImageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <Search size={16} color="#B08D42" />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>{product.name}</div>
                      <div style={{ fontSize: '12px', color: '#555555' }}>{product.categoryName}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#171717' }}>
                      {formatINR(product.basePriceInr)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#777777' }}>Starting Price</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <div style={{ textAlign: 'center', padding: '36px 0', color: '#555555' }}>
              <p style={{ fontSize: '14px', marginBottom: '4px', color: '#171717', fontWeight: 600 }}>No products found matching "{query}"</p>
              <p style={{ fontSize: '12px', color: '#777777' }}>
                Try searching for "iPhone", "MacBook", "M4", or "AirPods"
              </p>
            </div>
          )}

          {query.trim().length < 2 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#555555', textTransform: 'uppercase', marginBottom: '8px' }}>
                Quick Categories
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['iPhone 16 Pro', 'MacBook Air M3', 'Apple Watch S10', 'AirPods Pro', 'Vision Pro', 'iPad Pro M4'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '12px', backgroundColor: '#F5F5F7' }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
