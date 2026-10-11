import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { X, Plus, SlidersHorizontal, Loader2, ArrowRight } from 'lucide-react';
import { api, formatINR } from '../services/api';

export default function ComparisonPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [comparedProducts, setComparedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPicker, setShowAddPicker] = useState(false);

  useEffect(() => {
    loadComparison();
  }, [searchParams]);

  async function loadComparison() {
    setLoading(true);
    try {
      // 1. Fetch catalog summary for adding devices
      const listRes = await api.getProducts({ size: 50 });
      const catalog = listRes.data.content || [];
      setAllProducts(catalog);

      // 2. Determine initial product IDs
      const idsParam = searchParams.get('ids');
      const preset = searchParams.get('preset');
      let targetIds = [];

      if (idsParam) {
        targetIds = idsParam.split(',').map((id) => Number(id.trim())).filter((n) => !isNaN(n));
      } else if (preset === 'iphones' || targetIds.length === 0) {
        // Default iPhone comparison preset: Compare current lineup (iPhone 16 Pro Max, 16 Pro, 16, 16e)
        const iphones = catalog.filter((p) => p.categorySlug === 'iphone').slice(0, 4);
        targetIds = iphones.map((p) => p.id);
      }

      if (targetIds.length > 0) {
        const compRes = await api.compareProducts(targetIds);
        setComparedProducts(compRes.data.products || []);
      }
    } catch (err) {
      console.error('Failed to load comparison data:', err);
    } finally {
      setLoading(false);
    }
  }

  function removeProduct(productId) {
    const updated = comparedProducts.filter((p) => p.id !== productId);
    setComparedProducts(updated);
    const next = new URLSearchParams(searchParams);
    next.set('ids', updated.map((p) => p.id).join(','));
    setSearchParams(next);
  }

  function addProductToCompare(product) {
    if (comparedProducts.length >= 4) {
      alert('You can compare a maximum of 4 devices simultaneously.');
      return;
    }
    if (comparedProducts.some((p) => p.id === product.id)) {
      setShowAddPicker(false);
      return;
    }

    const newIds = [...comparedProducts.map((p) => p.id), product.id];
    const next = new URLSearchParams(searchParams);
    next.set('ids', newIds.join(','));
    setSearchParams(next);
    setShowAddPicker(false);
  }

  function setPreset(categorySlug) {
    const matching = allProducts.filter((p) => p.categorySlug === categorySlug).slice(0, 3);
    const newIds = matching.map((p) => p.id);
    const next = new URLSearchParams();
    next.set('ids', newIds.join(','));
    setSearchParams(next);
  }

  const comparisonSpecs = [
    { label: 'Indian Starting Price', key: 'price', format: (p) => formatINR(p.basePriceInr) },
    { label: 'Display Technology', key: 'display', format: (p) => p.specification?.displaySpec || '—' },
    { label: 'Chipset / Processor', key: 'chip', format: (p) => p.specification?.chipsetSpec || '—' },
    { label: 'Camera Architecture', key: 'camera', format: (p) => p.specification?.cameraSpec || '—' },
    { label: 'Battery Endurance', key: 'battery', format: (p) => p.specification?.batterySpec || '—' },
    { label: 'Available Storage', key: 'storage', format: (p) => p.specification?.storageOptions || '—' },
    { label: 'Connectivity & Ports', key: 'connectivity', format: (p) => p.specification?.connectivitySpec || '—' },
    { label: 'Dimensions & Weight', key: 'dimensions', format: (p) => `${p.specification?.dimensionsSpec || ''} ${p.specification?.weightSpec ? `(${p.specification.weightSpec})` : ''}`.trim() || '—' },
    { label: 'Distinctive Features', key: 'features', format: (p) => p.specification?.specialFeatures || '—' },
  ];

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="badge" style={{ marginBottom: '8px' }}>Side-by-Side</span>
        <h1 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', color: '#171717' }}>
          Compare Apple Models
        </h1>
        <p style={{ color: '#555555', fontSize: '15px', marginTop: '6px' }}>
          Evaluate technical capabilities, processors, displays, and authentic INR pricing across up to 4 models.
        </p>

        {/* Quick Presets */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          <button onClick={() => setPreset('iphone')} className="btn-secondary" style={{ fontSize: '12px', padding: '6px 16px' }}>
            Compare iPhones
          </button>
          <button onClick={() => setPreset('mac')} className="btn-secondary" style={{ fontSize: '12px', padding: '6px 16px' }}>
            Compare Macs
          </button>
          <button onClick={() => setPreset('ipad')} className="btn-secondary" style={{ fontSize: '12px', padding: '6px 16px' }}>
            Compare iPads
          </button>
          <button onClick={() => setPreset('watch')} className="btn-secondary" style={{ fontSize: '12px', padding: '6px 16px' }}>
            Compare Apple Watches
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#555555' }}>
          <Loader2 size={32} color="#B08D42" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p>Compiling comparison matrix...</p>
        </div>
      ) : comparedProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#F5F5F7', borderRadius: 'var(--radius-xl)', border: '1px solid #E5E5E5' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#171717', marginBottom: '8px' }}>No devices selected for comparison</h3>
          <p style={{ color: '#555555', marginBottom: '20px' }}>
            Select products from the catalogue or use a preset to get started.
          </p>
          <button onClick={() => setPreset('iphone')} className="btn-primary">Load iPhone Preset</button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', border: '1px solid #E5E5E5', borderRadius: 'var(--radius-xl)', backgroundColor: '#FFFFFF', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            {/* Table Header: Devices */}
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                <th style={{ padding: '24px', width: '220px', color: '#555555', fontSize: '13px', fontWeight: 600 }}>
                  Device Specification
                </th>
                {comparedProducts.map((prod) => (
                  <th key={prod.id} style={{ padding: '24px 20px', verticalAlign: 'top', width: '260px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                      <button
                        onClick={() => removeProduct(prod.id)}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          backgroundColor: '#F5F5F7',
                          borderRadius: '50%',
                          padding: '4px',
                          color: '#555555',
                          border: '1px solid #E5E5E5',
                          cursor: 'pointer',
                        }}
                        title="Remove product"
                      >
                        <X size={14} />
                      </button>

                      <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        <img
                          src={prod.images?.[0]?.imageUrl || prod.primaryImageUrl || '/images/fallback.svg'}
                          alt={prod.name}
                          style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/fallback.svg';
                          }}
                        />
                      </div>

                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                        {prod.name}
                      </h3>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#171717', marginBottom: '12px' }}>
                        {formatINR(prod.basePriceInr)}
                      </div>

                      <Link to={`/product/${prod.slug}`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                        Configure
                      </Link>
                    </div>
                  </th>
                ))}

                {/* Slot to add another product up to 4 */}
                {comparedProducts.length < 4 && (
                  <th style={{ padding: '24px 20px', verticalAlign: 'middle', width: '220px', textAlign: 'center' }}>
                    <div
                      style={{
                        border: '2px dashed #D0D0D0',
                        borderRadius: 'var(--radius-lg)',
                        padding: '36px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                        backgroundColor: '#F5F5F7',
                      }}
                    >
                      <button
                        onClick={() => setShowAddPicker(true)}
                        className="btn-secondary"
                        style={{ padding: '12px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }}
                        aria-label="Add Device to Compare"
                      >
                        <Plus size={20} color="#B08D42" />
                      </button>
                      <span style={{ fontSize: '13px', color: '#555555', fontWeight: 500 }}>
                        Add Device to Compare
                      </span>
                    </div>
                  </th>
                )}
              </tr>
            </thead>

            {/* Table Body: Specifications Comparison */}
            <tbody>
              {comparisonSpecs.map((spec, sIdx) => {
                // Check if all products have identical specs or differences
                const values = comparedProducts.map(spec.format);
                const hasDifferences = new Set(values).size > 1;

                return (
                  <tr
                    key={spec.key}
                    style={{
                      borderBottom: '1px solid #E5E5E5',
                      backgroundColor: sIdx % 2 === 0 ? '#FFFFFF' : '#FAFAFC',
                    }}
                  >
                    <td
                      style={{
                        padding: '18px 24px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#171717',
                      }}
                    >
                      <div>{spec.label}</div>
                      {hasDifferences && (
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            color: '#B08D42',
                            backgroundColor: 'rgba(176, 141, 66, 0.1)',
                            border: '1px solid rgba(176, 141, 66, 0.25)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            marginTop: '4px',
                          }}
                        >
                          Differs
                        </span>
                      )}
                    </td>

                    {comparedProducts.map((prod) => (
                      <td
                        key={prod.id}
                        style={{
                          padding: '18px 20px',
                          fontSize: '13px',
                          lineHeight: 1.5,
                          color: hasDifferences ? '#171717' : '#555555',
                          fontWeight: hasDifferences ? 600 : 400,
                        }}
                      >
                        {spec.format(prod)}
                      </td>
                    ))}

                    {comparedProducts.length < 4 && <td />}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Device Selection Modal for Adding to Comparison */}
      {showAddPicker && (
        <div className="modal-overlay" onClick={() => setShowAddPicker(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', maxHeight: '75vh', overflowY: 'auto', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#171717' }}>Select Product to Compare</h3>
              <button onClick={() => setShowAddPicker(false)} style={{ background: 'none', border: 'none', color: '#171717', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {allProducts.map((p) => {
                const alreadySelected = comparedProducts.some((c) => c.id === p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => !alreadySelected && addProductToCompare(p)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: alreadySelected ? '#F5F5F7' : '#FFFFFF',
                      border: '1px solid #E5E5E5',
                      opacity: alreadySelected ? 0.45 : 1,
                      cursor: alreadySelected ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={p.primaryImageUrl || '/images/fallback.svg'}
                        alt=""
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/fallback.svg';
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#171717' }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: '#555555' }}>{p.categoryName}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#171717' }}>
                      {alreadySelected ? 'Added' : formatINR(p.basePriceInr)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
