import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Sparkles, Check } from 'lucide-react';
import { formatINR } from '../../services/api';
import { useWishlist } from '../../context/WishlistContext';

// Verified Apple device innovation metadata & multi-finish visual assets
const INNOVATION_METADATA = {
  'iphone-16-pro': {
    tag: 'A18 Pro • Grade 5 Titanium',
    secondaryImg: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-2-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95',
    finishes: [
      { name: 'Natural Titanium', hex: '#9E978E', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'Desert Titanium', hex: '#C5A992', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'Black Titanium', hex: '#2D2D2E', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-blacktitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'White Titanium', hex: '#F2F1ED', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-whitetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
    ],
  },
  'iphone-16-pro-max': {
    tag: '6.9" Display • 5x Telephoto',
    secondaryImg: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-2-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95',
    finishes: [
      { name: 'Desert Titanium', hex: '#C5A992', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-deserttitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'Natural Titanium', hex: '#9E978E', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'Black Titanium', hex: '#2D2D2E', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-blacktitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'White Titanium', hex: '#F2F1ED', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-whitetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
    ],
  },
  'iphone-16': {
    tag: 'Apple Intelligence • Camera Control',
    secondaryImg: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-model-unselect-gallery-2-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95',
    finishes: [
      { name: 'Ultramarine', hex: '#3D5A80', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-ultramarine?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'Teal', hex: '#52796F', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-teal?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'Pink', hex: '#E07A5F', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-pink?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'White', hex: '#F8F9FA', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-white?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'Black', hex: '#2B2D42', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-black?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
    ],
  },
  'iphone-16-plus': {
    tag: '6.7" OLED • Longest Battery',
    secondaryImg: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-model-unselect-gallery-2-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95',
    finishes: [
      { name: 'Ultramarine', hex: '#3D5A80', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-7inch-ultramarine?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'Teal', hex: '#52796F', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-7inch-teal?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'Pink', hex: '#E07A5F', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-7inch-pink?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'Black', hex: '#2B2D42', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-7inch-black?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
    ],
  },
  'iphone-16e': {
    tag: 'Apple C1 Modem • A18 Silicon',
    secondaryImg: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-model-unselect-gallery-2-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95',
    finishes: [
      { name: 'Black', hex: '#2B2D42', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-black?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'White', hex: '#F8F9FA', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-white?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
    ],
  },
  'macbook-pro-14-m4': {
    tag: 'M4 Pro / Max • Liquid Retina XDR',
    secondaryImg: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp14-spaceblack-gallery1-202410?wid=4000&hei=3074&fmt=jpeg&qlt=95',
    finishes: [
      { name: 'Space Black', hex: '#2D2E30', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp14-spaceblack-select-202410?wid=904&hei=840&fmt=jpeg&qlt=95' },
      { name: 'Silver', hex: '#E3E4E5', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp14-silver-select-202410?wid=904&hei=840&fmt=jpeg&qlt=95' },
    ],
  },
  'mac-mini-m4': {
    tag: 'M4 Silicon • 5x5-inch Tiny Footprint',
    secondaryImg: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mac-mini-select-202410?wid=5120&hei=2880&fmt=p-jpg&qlt=95',
    finishes: [
      { name: 'Silver', hex: '#E3E4E5', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mac-mini-select-202410?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
    ],
  },
  'macbook-air-13-m3': {
    tag: 'M3 Silicon • 11.3mm Thin Fanless',
    finishes: [
      { name: 'Midnight', hex: '#1E2530', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-midnight-select-202402?wid=1000' },
      { name: 'Starlight', hex: '#EFE8DD', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-starlight-select-202402?wid=1000' },
      { name: 'Space Grey', hex: '#7D7E80', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-spacegray-select-202402?wid=1000' },
      { name: 'Silver', hex: '#E3E4E5', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-silver-select-202402?wid=1000' },
    ],
  },
  'ipad-pro-13-m4': {
    tag: 'Tandem OLED • 5.1mm Ultra Thin',
    secondaryImg: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-model-select-gallery-2-202405?wid=5120&hei=2880&fmt=p-jpg&qlt=95',
    finishes: [
      { name: 'Space Black', hex: '#2E2E30', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-finish-select-202405-13inch-spaceblack?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'Silver', hex: '#E4E5E7', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-finish-select-202405-13inch-silver?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
    ],
  },
  'apple-watch-series-10': {
    tag: '9.7mm Thinnest • Wide-Angle OLED',
    secondaryImg: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/s10-case-unselect-gallery-2-202409?wid=5120&hei=3280&fmt=p-jpg&qlt=95',
  },
  'apple-watch-ultra-2': {
    tag: '3000 Nits • Grade 5 Titanium',
    secondaryImg: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ultra-case-unselect-gallery-2-202409?wid=5120&hei=3280&fmt=p-jpg&qlt=95',
    finishes: [
      { name: 'Natural Titanium', hex: '#9E978E', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ultra-case-unselect-gallery-1-202409?wid=5120&hei=3280&fmt=p-jpg&qlt=95' },
      { name: 'Black Titanium', hex: '#2D2D2E', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ultra-case-unselect-gallery-2-202409?wid=5120&hei=3280&fmt=p-jpg&qlt=95' },
    ],
  },
  'airpods-pro-2-usb-c': {
    tag: '2x ANC • FDA Hearing Test',
    secondaryImg: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MQD83_AV1?wid=1144&hei=1144&fmt=jpeg&qlt=95',
  },
  'airpods-4-anc': {
    tag: 'Open-Ear ANC • H2 Silicon',
    secondaryImg: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-anc-select-202409?wid=904&hei=840&fmt=jpeg&qlt=95',
  },
  'apple-vision-pro': {
    tag: 'spatialOS • 23M Micro-OLED',
  },
};

export default function ProductCard({ product, onCompareToggle, isComparing }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const meta = INNOVATION_METADATA[product.slug] || null;
  const [selectedFinishIndex, setSelectedFinishIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Determine which image to show dynamically:
  // 1. Manually selected finish swatch takes top priority
  // 2. On hover (without locked finish), peek secondary perspective if available
  // 3. Default to primary product image
  let displayImage = product.primaryImageUrl || '/images/fallback.svg';
  if (selectedFinishIndex !== null && meta?.finishes?.[selectedFinishIndex]) {
    displayImage = meta.finishes[selectedFinishIndex].img;
  } else if (isHovered && meta?.secondaryImg) {
    displayImage = meta.secondaryImg;
  }

  const activeFinishName = selectedFinishIndex !== null && meta?.finishes?.[selectedFinishIndex]
    ? meta.finishes[selectedFinishIndex].name
    : null;

  return (
    <div
      className="glass-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        height: '100%',
        backgroundColor: '#FFFFFF',
        border: isHovered ? '1px solid #B08D42' : '1px solid #E5E5E5',
        borderRadius: 'var(--radius-xl)',
        boxShadow: isHovered
          ? '0 16px 36px rgba(176, 141, 66, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)'
          : '0 4px 16px rgba(0, 0, 0, 0.03)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Top Floating Bar: Badges & Wishlist Trigger */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          right: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', pointerEvents: 'auto' }}>
          {product.isNewArrival && (
            <span
              style={{
                backgroundColor: '#171717',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                letterSpacing: '0.02em',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
              }}
            >
              New
            </span>
          )}

          {meta?.tag && (
            <span
              style={{
                backgroundColor: 'rgba(245, 245, 247, 0.95)',
                color: '#171717',
                fontWeight: 600,
                fontSize: '10px',
                padding: '4px 9px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid #E5E5E5',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Sparkles size={10} color="#B08D42" />
              <span>{meta.tag.split('•')[0].trim()}</span>
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{
            pointerEvents: 'auto',
            backgroundColor: '#FFFFFF',
            border: wishlisted ? '1px solid #B08D42' : '1px solid #E5E5E5',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: wishlisted ? '#B08D42' : '#555555',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#B08D42';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = wishlisted ? '#B08D42' : '#E5E5E5';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Heart size={16} fill={wishlisted ? '#B08D42' : 'none'} color={wishlisted ? '#B08D42' : 'currentColor'} />
        </button>
      </div>

      {/* Innovative Interactive Product Visual Area */}
      <Link
        to={`/product/${product.slug}`}
        style={{
          padding: '48px 24px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '235px',
          backgroundColor: '#F5F5F7',
          borderBottom: '1px solid #EBEBEB',
          position: 'relative',
          overflow: 'hidden',
          textDecoration: 'none',
        }}
      >
        <img
          src={displayImage}
          alt={activeFinishName ? `${product.name} in ${activeFinishName}` : product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/fallback.svg';
          }}
          style={{
            maxHeight: '175px',
            maxWidth: '100%',
            objectFit: 'contain',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
          }}
        />

        {/* Dynamic Perspective Indicator Tag on Hover */}
        {(isHovered || activeFinishName) && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #E5E5E5',
              borderRadius: 'var(--radius-full)',
              padding: '2px 8px',
              fontSize: '10px',
              fontWeight: 600,
              color: activeFinishName ? '#B08D42' : '#555555',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
            }}
          >
            {activeFinishName ? activeFinishName : meta?.secondaryImg ? 'Angled View' : 'Verified'}
          </div>
        )}
      </Link>

      {/* Interactive Finish Swatches Directly On Card */}
      {meta?.finishes && meta.finishes.length > 0 && (
        <div
          style={{
            padding: '8px 20px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #F0F0F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {meta.finishes.map((f, fIdx) => {
            const isSelected = selectedFinishIndex === fIdx;
            return (
              <button
                key={f.name}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedFinishIndex(isSelected ? null : fIdx);
                }}
                onMouseEnter={() => setSelectedFinishIndex(fIdx)}
                title={f.name}
                aria-label={`Select ${f.name} finish`}
                style={{
                  width: isSelected ? '18px' : '14px',
                  height: isSelected ? '18px' : '14px',
                  borderRadius: '50%',
                  backgroundColor: f.hex,
                  border: isSelected ? '2px solid #B08D42' : '1px solid #D0D0D0',
                  boxShadow: isSelected ? '0 0 0 2px #FFFFFF, 0 2px 6px rgba(176, 141, 66, 0.3)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  padding: 0,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Details & Specs Area */}
      <div
        style={{
          padding: '18px 22px 22px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#B08D42', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {product.categoryName}
            </span>
            <span style={{ fontSize: '10px', color: '#888888', fontWeight: 500 }}>
              India MRP
            </span>
          </div>

          <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
            <h3
              style={{
                fontSize: '17px',
                fontWeight: 700,
                color: '#171717',
                marginBottom: '6px',
                letterSpacing: '-0.01em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#B08D42')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#171717')}
            >
              {product.name}
            </h3>
          </Link>

          <p
            style={{
              fontSize: '13px',
              color: '#555555',
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '14px',
            }}
          >
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing, Innovation Highlights & Action */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '14px',
              paddingTop: '8px',
              borderTop: '1px solid #F0F0F0',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#888888' }}>
                {product.basePriceInr != null ? 'Starting from' : 'Pricing'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
                {formatINR(product.basePriceInr)}
              </div>
            </div>

            {onCompareToggle && (
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: '#555555',
                  cursor: 'pointer',
                  userSelect: 'none',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#F5F5F7',
                  border: '1px solid #E5E5E5',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={isComparing || false}
                  onChange={() => onCompareToggle(product.id)}
                  style={{ width: '13px', height: '13px', accentColor: '#B08D42' }}
                />
                <span>Compare</span>
              </label>
            )}
          </div>

          <Link
            to={`/product/${product.slug}`}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '11px 18px',
              fontSize: '13px',
              fontWeight: 600,
              justifyContent: 'space-between',
              backgroundColor: '#171717',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: isHovered ? '0 4px 14px rgba(0, 0, 0, 0.15)' : 'none',
            }}
          >
            <span>Explore & Configure</span>
            <ArrowRight size={15} style={{ transform: isHovered ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 0.2s ease' }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
