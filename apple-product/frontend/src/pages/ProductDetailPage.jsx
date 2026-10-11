import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  SlidersHorizontal,
  Check,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { api, formatINR } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/common/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await api.getProductDetail(slug);
        const data = res.data;
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        setSelectedImageIndex(0);
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px', color: '#B08D42' }} />
        <p style={{ color: '#555555' }}>Loading Apple specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#171717' }}>Product Not Found</h2>
        <p style={{ color: '#555555', marginBottom: '24px' }}>
          The requested Apple device could not be located in our catalogue.
        </p>
        <Link to="/products" className="btn-primary">Browse Catalogue</Link>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const currentPrice = selectedVariant ? selectedVariant.priceInr : product.basePriceInr;
  const images = product.images || [];
  const currentImageUrl = images[selectedImageIndex]?.imageUrl || product.primaryImageUrl || `/images/products/${product.slug}.svg`;

  // Extract unique storage and colour options
  const uniqueColours = Array.from(
    new Map(product.variants.map((v) => [v.colourName, { name: v.colourName, hex: v.colourHex }])).values()
  );
  const uniqueStorage = Array.from(new Set(product.variants.map((v) => v.storage).filter(Boolean)));

  function handleColourSelect(colourName) {
    const matching = product.variants.find(
      (v) => v.colourName === colourName && (!selectedVariant?.storage || v.storage === selectedVariant.storage)
    ) || product.variants.find((v) => v.colourName === colourName);

    if (matching) setSelectedVariant(matching);

    // Sync gallery photo to selected colour finish
    if (images && images.length > 0) {
      const colourClean = colourName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const imgIdx = images.findIndex((img) => {
        const altClean = (img.altText || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const urlClean = (img.imageUrl || '').toLowerCase();
        return altClean.includes(colourClean) || urlClean.includes(colourClean);
      });
      if (imgIdx !== -1) {
        setSelectedImageIndex(imgIdx);
      }
    }
  }

  function handleThumbnailClick(idx) {
    setSelectedImageIndex(idx);
    const clickedImg = images[idx];
    if (clickedImg && clickedImg.altText) {
      const matchedColour = uniqueColours.find((c) =>
        clickedImg.altText.toLowerCase().includes(c.name.toLowerCase())
      );
      if (matchedColour) {
        const matching = product.variants.find(
          (v) => v.colourName === matchedColour.name && (!selectedVariant?.storage || v.storage === selectedVariant.storage)
        ) || product.variants.find((v) => v.colourName === matchedColour.name);
        if (matching) setSelectedVariant(matching);
      }
    }
  }

  function handleStorageSelect(storage) {
    const matching = product.variants.find(
      (v) => v.storage === storage && (!selectedVariant?.colourName || v.colourName === selectedVariant.colourName)
    ) || product.variants.find((v) => v.storage === storage);

    if (matching) setSelectedVariant(matching);
  }

  async function handleAddToCartClick() {
    if (!selectedVariant) return;
    setAddingToCart(true);
    try {
      await addToCart(product.id, selectedVariant.id, quantity);
    } catch (err) {
      alert(err.message || 'Could not add item to bag');
    } finally {
      setAddingToCart(false);
    }
  }

  return (
    <div style={{ paddingTop: '24px', paddingBottom: '80px', backgroundColor: '#FFFFFF' }}>
      {/* Breadcrumb Navigation */}
      <div className="container" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#555555' }}>
          <Link to="/" style={{ color: '#555555' }}>Home</Link>
          <ChevronRight size={12} color="#888888" />
          <Link to={`/products?category=${product.categorySlug}`} style={{ color: '#555555' }}>{product.categoryName}</Link>
          <ChevronRight size={12} color="#888888" />
          <span style={{ color: '#171717', fontWeight: 600 }}>{product.name}</span>
        </div>
      </div>

      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '56px',
            alignItems: 'start',
            marginBottom: '80px',
          }}
        >
          {/* Left Column: Multi-Angle High-Resolution Product Gallery */}
          <div>
            <div
              style={{
                backgroundColor: '#F5F5F7',
                border: '1px solid #E5E5E5',
                borderRadius: 'var(--radius-xl)',
                padding: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '440px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                position: 'relative',
              }}
            >
              <img
                src={currentImageUrl || `/images/products/${product.slug}.svg`}
                alt={images[selectedImageIndex]?.altText || product.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const stage = e.currentTarget.dataset.fallbackStage || 'main';
                  if (stage === 'main') {
                    e.currentTarget.dataset.fallbackStage = 'localProduct';
                    e.currentTarget.src = `/images/products/${product.slug}.svg`;
                  } else if (stage === 'localProduct') {
                    e.currentTarget.dataset.fallbackStage = 'category';
                    e.currentTarget.src = `/images/categories/${product.categorySlug}.svg`;
                  } else {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/fallback.svg';
                  }
                }}
                style={{
                  maxHeight: '380px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>

            {/* View Perspective Caption */}
            {images.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '12px',
                  padding: '0 4px',
                  fontSize: '12px',
                  color: '#555555',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 500, color: '#171717' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#B08D42' }}></span>
                  {images[selectedImageIndex]?.altText || product.name}
                </span>
                <span style={{ color: '#888888', fontSize: '11px', fontWeight: 500 }}>
                  {selectedImageIndex + 1} of {images.length}
                </span>
              </div>
            )}

            {/* Distinct Perspective Gallery Thumbnails */}
            {images.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '14px',
                }}
              >
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => handleThumbnailClick(idx)}
                    title={img.altText || `View ${idx + 1}`}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#FFFFFF',
                      border:
                        selectedImageIndex === idx
                          ? '2px solid #B08D42'
                          : '1px solid #E5E5E5',
                      boxShadow:
                        selectedImageIndex === idx
                          ? '0 4px 14px rgba(176, 141, 66, 0.22)'
                          : '0 2px 6px rgba(0, 0, 0, 0.02)',
                      transform: selectedImageIndex === idx ? 'scale(1.05)' : 'scale(1)',
                      padding: '6px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={img.imageUrl || `/images/products/${product.slug}.svg`}
                      alt={img.altText || ''}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `/images/products/${product.slug}.svg`;
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Configuration & Purchase Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge">{product.categoryName}</span>
              {product.isNewArrival && (
                <span className="badge" style={{ backgroundColor: '#171717', color: '#FFFFFF', fontWeight: 600, border: 'none' }}>
                  New Release
                </span>
              )}
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'clamp(28px, 4vw, 38px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: '8px',
                color: '#171717',
              }}
            >
              {product.name}
            </h1>

            <div style={{ fontSize: '13px', color: '#555555', marginBottom: '16px' }}>
              Model: {product.modelAndGeneration}
            </div>

            {/* Price Display */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '12px',
                paddingBottom: '20px',
                borderBottom: '1px solid #E5E5E5',
                marginBottom: '24px',
              }}
            >
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#171717' }}>
                {formatINR(currentPrice)}
              </div>
              {currentPrice != null ? (
                <div style={{ fontSize: '12px', color: '#555555' }}>
                  MRP (Inclusive of all taxes)
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#888888' }}>
                  Official Apple India retail price unannounced
                </div>
              )}
            </div>

            <p style={{ color: '#555555', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>
              {product.fullDescription || product.shortDescription}
            </p>

            {/* 1. Colour Selection */}
            {uniqueColours.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#171717' }}>
                    Finish • <span style={{ color: '#B08D42' }}>{selectedVariant?.colourName}</span>
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {uniqueColours.map((c) => {
                    const isSelected = selectedVariant?.colourName === c.name;
                    return (
                      <button
                        key={c.name}
                        onClick={() => handleColourSelect(c.name)}
                        title={c.name}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: c.hex,
                          border: isSelected ? '3px solid #171717' : '2px solid #E5E5E5',
                          boxShadow: isSelected ? '0 0 8px rgba(0, 0, 0, 0.2)' : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isSelected && (
                          <Check size={14} color={c.hex === '#F5F5F7' || c.hex === '#F4F2EE' || c.hex === '#FFFFFF' ? '#000' : '#fff'} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Storage Selection */}
            {uniqueStorage.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#171717', marginBottom: '10px' }}>
                  Storage Capacity
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '8px' }}>
                  {uniqueStorage.map((s) => {
                    const isSelected = selectedVariant?.storage === s;
                    return (
                      <button
                        key={s}
                        onClick={() => handleStorageSelect(s)}
                        style={{
                          padding: '12px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isSelected ? '#171717' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#171717',
                          border: isSelected ? '1px solid #171717' : '1px solid #E5E5E5',
                          fontSize: '13px',
                          fontWeight: 600,
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#F5F5F7',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid #E5E5E5',
                  padding: '4px 12px',
                }}
              >
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '6px', color: '#171717', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>-</button>
                <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 700, fontSize: '14px', color: '#171717' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '6px', color: '#171717', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>+</button>
              </div>

              <button
                onClick={handleAddToCartClick}
                disabled={addingToCart || !selectedVariant || currentPrice == null}
                className="btn-primary"
                style={{ flex: 1, padding: '16px 24px', fontSize: '15px' }}
              >
                {addingToCart ? (
                  <Loader2 size={16} className="spin" />
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>{currentPrice == null ? 'Official Price Unannounced' : 'Add to Bag'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#FFFFFF',
                  border: wishlisted ? '1px solid #B08D42' : '1px solid #E5E5E5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: wishlisted ? '#B08D42' : '#555555',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
                aria-label="Toggle Wishlist"
              >
                <Heart size={20} fill={wishlisted ? '#B08D42' : 'none'} color={wishlisted ? '#B08D42' : 'currentColor'} />
              </button>

              <button
                onClick={() => navigate(`/compare?ids=${product.id}`)}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#171717',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#B08D42')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E5E5E5')}
                title="Compare with other devices"
              >
                <SlidersHorizontal size={18} color="#B08D42" />
              </button>
            </div>

            {/* Sourced Price Verification Metadata Box */}
            <div
              style={{
                backgroundColor: '#F5F5F7',
                border: '1px solid #E5E5E5',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                fontSize: '12px',
                color: '#555555',
                lineHeight: 1.5,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                <ShieldCheck size={14} color="#B08D42" />
                <span>Verified Apple India Technical Data</span>
              </div>
              <div>
                Official INR pricing verified on: {product.priceVerificationDate || 'September 2026'}.
              </div>
              {product.sourceUrl && (
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '6px',
                    color: '#B08D42',
                    textDecoration: 'underline',
                  }}
                >
                  <span>View Official Apple Documentation</span>
                  <ExternalLink size={11} color="#B08D42" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Technical Specifications Matrix */}
        {product.specification && (
          <section style={{ marginBottom: '80px' }}>
            <div style={{ borderBottom: '1px solid #E5E5E5', paddingBottom: '16px', marginBottom: '32px' }}>
              <span className="badge" style={{ marginBottom: '8px' }}>Specifications</span>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#171717' }}>
                Technical Specifications
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {product.specification.displaySpec && (
                <div className="glass-card" style={{ padding: '24px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#B08D42', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                    Display
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#171717' }}>
                    {product.specification.displaySpec}
                  </div>
                </div>
              )}

              {product.specification.chipsetSpec && (
                <div className="glass-card" style={{ padding: '24px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#B08D42', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                    Chip / Processor
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#171717' }}>
                    {product.specification.chipsetSpec}
                  </div>
                </div>
              )}

              {product.specification.cameraSpec && (
                <div className="glass-card" style={{ padding: '24px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#B08D42', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                    Camera System
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#171717' }}>
                    {product.specification.cameraSpec}
                  </div>
                </div>
              )}

              {product.specification.batterySpec && (
                <div className="glass-card" style={{ padding: '24px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#B08D42', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                    Power & Battery
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#171717' }}>
                    {product.specification.batterySpec}
                  </div>
                </div>
              )}

              {product.specification.connectivitySpec && (
                <div className="glass-card" style={{ padding: '24px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#B08D42', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                    Connectivity
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#171717' }}>
                    {product.specification.connectivitySpec}
                  </div>
                </div>
              )}

              {product.specification.dimensionsSpec && (
                <div className="glass-card" style={{ padding: '24px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#B08D42', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                    Dimensions & Weight
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#171717' }}>
                    {product.specification.dimensionsSpec} {product.specification.weightSpec ? `(${product.specification.weightSpec})` : ''}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <section>
            <div style={{ borderBottom: '1px solid #E5E5E5', paddingBottom: '16px', marginBottom: '32px' }}>
              <span className="badge" style={{ marginBottom: '8px' }}>Similar Choices</span>
              <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#171717' }}>
                More in {product.categoryName}
              </h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '24px',
              }}
            >
              {product.relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
