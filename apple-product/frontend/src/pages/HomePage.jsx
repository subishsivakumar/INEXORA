import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Box, SlidersHorizontal, ShieldCheck, Truck, RotateCcw, Sparkles, Check, ChevronRight } from 'lucide-react';
import { api, formatINR } from '../services/api';
import ProductCard from '../components/common/ProductCard';

// Premier verified Apple flagship lineup available in India
const FLAGSHIP_HERO_DEVICES = [
  {
    id: 1,
    slug: 'iphone-16-pro-max',
    categorySlug: 'iphone',
    badge: 'Flagship Showcase',
    name: 'iPhone 16 Pro Max',
    tagline: 'Forged in titanium. Powered by A18 Pro.',
    description: 'Featuring a stunning 6.9-inch Super Retina XDR display, pro-level Camera Control, 48MP Fusion camera system with 5x Telephoto, and extraordinary battery endurance.',
    startingPrice: 144900,
    specs: ['Grade 5 Titanium', 'A18 Pro Chip', '48MP Fusion Camera', 'Camera Control', '6.9" Super Retina XDR'],
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-1-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95',
  },
  {
    id: 33,
    slug: 'iphone-16e',
    categorySlug: 'iphone',
    badge: 'Latest Arrival',
    name: 'iPhone 16e',
    tagline: 'Latest performance. Built for Apple Intelligence.',
    description: 'Equipped with the powerful A18 chip, Apple custom C1 cellular modem, a 48MP 2-in-1 camera with 2x optical-quality Telephoto, and all-day battery life.',
    startingPrice: 59900,
    specs: ['A18 Chip', 'Built for Apple Intelligence', '48MP 2-in-1 Camera', 'C1 Modem', '6.1" OLED Display'],
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-model-unselect-gallery-1-202409?wid=5120&hei=2880&fmt=p-jpg&qlt=95',
  },
  {
    id: 6,
    slug: 'macbook-pro-14-m4',
    categorySlug: 'mac',
    badge: 'Monumental Power',
    name: 'MacBook Pro 14-inch',
    tagline: 'Supercharged by the M4 family.',
    description: 'Industry-leading performance with up to 24 hours of battery life, Liquid Retina XDR display with up to 1,600 nits peak brightness, and Thunderbolt 5 support.',
    startingPrice: 169900,
    specs: ['M4 / M4 Pro / M4 Max', 'Liquid Retina XDR', 'Up to 24h Battery', 'Thunderbolt 5', '12MP Center Stage'],
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mac-card-40-macbookpro-14-16-202410?wid=680&hei=528&fmt=p-jpg&qlt=95',
  },
  {
    id: 9,
    slug: 'mac-mini-m4',
    categorySlug: 'mac',
    badge: 'Redesigned Icon',
    name: 'Mac mini',
    tagline: 'More muscle. Tiny 5x5-inch size.',
    description: 'Completely redesigned around Apple silicon in an ultra-compact enclosure. Features front and back ports, Thunderbolt 5, and Apple Intelligence.',
    startingPrice: 59900,
    specs: ['M4 & M4 Pro Silicon', '5x5-inch Compact Footprint', 'Front USB-C Ports', 'Thunderbolt 5', 'Carbon Neutral'],
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mac-mini-select-202410?wid=5120&hei=2880&fmt=p-jpg&qlt=95',
  },
  {
    id: 12,
    slug: 'ipad-pro-13-m4',
    categorySlug: 'ipad',
    badge: 'Ultra Thin OLED',
    name: 'iPad Pro 13-inch',
    tagline: 'Thinpossible. Groundbreaking M4 power.',
    description: 'The thinnest Apple product ever at just 5.1mm. Features the revolutionary tandem OLED Ultra Retina XDR display and Apple Pencil Pro support.',
    startingPrice: 129900,
    specs: ['Tandem OLED Display', 'M4 Processor', '5.1mm Profile', 'Pencil Pro Compatible', 'Landscape 12MP Camera'],
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-card-40-pro-202405?wid=680&hei=528&fmt=p-jpg&qlt=95',
  },
  {
    id: 16,
    slug: 'apple-watch-series-10',
    categorySlug: 'watch',
    badge: 'Thinnest Watch Ever',
    name: 'Apple Watch Series 10',
    tagline: 'Apple’s thinnest profile. Biggest display.',
    description: 'Wide-angle OLED screen with up to 40% brighter off-axis viewing, fast charging to 80% in 30 minutes, depth and water temperature gauge, and sleep apnea notifications.',
    startingPrice: 46900,
    specs: ['Wide-Angle OLED', 'Thinnest Design Ever', 'S10 SiP', 'Sleep Apnea Alerts', 'Fast Charging (80% in 30m)'],
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-card-40-s10-202409?wid=680&hei=528&fmt=p-jpg&qlt=95',
  },
];

const INNOVATION_FILTERS = [
  { id: 'all', label: 'All Innovations' },
  { id: 'ai', label: 'Apple Intelligence' },
  { id: 'm4', label: 'M4 Silicon Series' },
  { id: 'titanium', label: 'Titanium & Pro' },
  { id: 'audio', label: 'Audio & Wearables' },
];

const IPHONE_COMPARE_DATA = {
  pro: {
    name: 'iPhone 16 Pro',
    slug: 'iphone-16-pro',
    chip: 'A18 Pro',
    camera: '48MP Fusion + 5x Tele',
    display: '6.3" ProMotion',
    price: 119900,
    finishes: [
      { name: 'Natural Titanium', hex: '#9E978E', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'Desert Titanium', hex: '#C5A992', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'Black Titanium', hex: '#2D2D2E', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-blacktitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'White Titanium', hex: '#F2F1ED', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-whitetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
    ],
  },
  base: {
    name: 'iPhone 16',
    slug: 'iphone-16',
    chip: 'A18 Silicon',
    camera: '48MP Fusion 2-in-1',
    display: '6.1" Super Retina',
    price: 79900,
    finishes: [
      { name: 'Ultramarine', hex: '#3D5A80', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-ultramarine?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'Teal', hex: '#52796F', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-teal?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'Pink', hex: '#E07A5F', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-pink?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'White', hex: '#F8F9FA', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-white?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'Black', hex: '#2B2D42', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-black?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
    ],
  },
  e: {
    name: 'iPhone 16e',
    slug: 'iphone-16e',
    chip: 'A18 & C1 Modem',
    camera: '48MP 2-in-1 Dual-Optics',
    display: '6.1" OLED Display',
    price: 59900,
    finishes: [
      { name: 'Black', hex: '#2B2D42', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-black?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
      { name: 'White', hex: '#F8F9FA', img: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-white?wid=5120&hei=2880&fmt=p-jpg&qlt=95' },
    ],
  },
};

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
  const [activeInnovationFilter, setActiveInnovationFilter] = useState('all');
  const [compareFinishIdx, setCompareFinishIdx] = useState({ pro: 0, base: 0, e: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentHero = FLAGSHIP_HERO_DEVICES[selectedHeroIndex];

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [catRes, featRes, newRes] = await Promise.all([
          api.getCategories(),
          api.getFeaturedProducts(),
          api.getNewArrivals(),
        ]);
        setCategories(catRes.data || []);
        setFeaturedProducts(featRes.data || []);
        setNewArrivals(newRes.data || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const filteredInnovations = React.useMemo(() => {
    const allUnique = Array.from(new Map([...newArrivals, ...featuredProducts].map((p) => [p.id, p])).values());
    if (activeInnovationFilter === 'ai') {
      return allUnique.filter((p) =>
        p.slug?.includes('iphone-16') || p.slug?.includes('ipad-mini') || p.fullDescription?.toLowerCase().includes('apple intelligence')
      );
    }
    if (activeInnovationFilter === 'm4') {
      return allUnique.filter((p) =>
        p.slug?.includes('m4') || p.modelAndGeneration?.includes('M4')
      );
    }
    if (activeInnovationFilter === 'titanium') {
      return allUnique.filter((p) =>
        p.slug?.includes('pro') || p.slug?.includes('ultra') || p.shortDescription?.toLowerCase().includes('titanium')
      );
    }
    if (activeInnovationFilter === 'audio') {
      return allUnique.filter((p) =>
        p.categorySlug === 'airpods' || p.categorySlug === 'watch' || p.slug?.includes('airpods') || p.slug?.includes('watch')
      );
    }
    return newArrivals.length > 0 ? newArrivals : allUnique;
  }, [newArrivals, featuredProducts, activeInnovationFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>
      {/* 1. Flagship Hero Section with Interactive Switcher */}
      <section
        style={{
          position: 'relative',
          paddingTop: '40px',
          paddingBottom: '30px',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Headline & Mission Statement */}
          <div style={{ marginBottom: '24px' }}>
            <span
              className="badge"
              style={{
                padding: '6px 16px',
                fontSize: '12px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={13} />
              <span>iNexora • Apple Innovation Showcase</span>
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(36px, 5.5vw, 64px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
                marginBottom: '16px',
                maxWidth: '920px',
                marginLeft: 'auto',
                marginRight: 'auto',
                color: '#171717',
              }}
            >
              Discover Technology. <span style={{ color: '#B08D42' }}>Experience Excellence.</span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(15px, 1.8vw, 19px)',
                color: '#555555',
                maxWidth: '680px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: 1.5,
              }}
            >
              Verified Apple India specifications, authentic INR pricing, and transactional shopping bag across all 10 device categories in premium white and gold elegance.
            </p>
          </div>

          {/* Interactive Flagship Tabs Switcher */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '36px',
              backgroundColor: '#F5F5F7',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #E5E5E5',
              maxWidth: '860px',
              marginLeft: 'auto',
              marginRight: 'auto',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
            }}
          >
            {FLAGSHIP_HERO_DEVICES.map((device, idx) => {
              const isActive = selectedHeroIndex === idx;
              return (
                <button
                  key={device.id}
                  onClick={() => {
                    setSelectedHeroIndex(idx);
                  }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#FFFFFF' : '#555555',
                    backgroundColor: isActive ? '#171717' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
                  }}
                >
                  <span>{device.name}</span>
                  {device.badge === 'Latest Arrival' && (
                    <span
                      style={{
                        fontSize: '9px',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        backgroundColor: isActive ? '#B08D42' : 'rgba(176, 141, 66, 0.15)',
                        color: isActive ? '#FFFFFF' : '#B08D42',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      New
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Flagship Details & CTAs */}
          <div style={{ maxWidth: '800px', margin: '0 auto 36px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#B08D42',
                marginBottom: '8px',
              }}
            >
              <span>{currentHero.badge}</span>
              <span>•</span>
              <span style={{ color: '#171717' }}>Starting at {formatINR(currentHero.startingPrice)}</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#171717',
                marginBottom: '10px',
              }}
            >
              {currentHero.tagline}
            </h2>

            <p style={{ color: '#555555', fontSize: '15px', lineHeight: 1.5, marginBottom: '24px' }}>
              {currentHero.description}
            </p>

            {/* Spec Highlights Chips */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '32px',
              }}
            >
              {currentHero.specs.map((spec, sIdx) => (
                <span
                  key={sIdx}
                  style={{
                    fontSize: '12px',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E5E5',
                    color: '#171717',
                    fontWeight: 500,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
                  }}
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                to={`/product/${currentHero.slug}`}
                className="btn-primary"
                style={{ padding: '14px 32px', fontSize: '15px' }}
              >
                <span>Shop {currentHero.name}</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                to={`/product/${currentHero.slug}`}
                className="btn-secondary"
                style={{ padding: '14px 28px', fontSize: '15px' }}
              >
                <span>Explore Specs</span>
              </Link>
            </div>
          </div>

          {/* Hero Media Showcase: Official High-Resolution Photography */}
          <div
            style={{
              maxWidth: '960px',
              margin: '0 auto',
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'relative',
                backgroundColor: '#F5F5F7',
                border: '1px solid #E5E5E5',
                borderRadius: 'var(--radius-xl)',
                padding: '48px 24px 0',
                boxShadow: '0 20px 48px rgba(0, 0, 0, 0.06)',
              }}
            >
              <img
                src={currentHero.imageUrl || `/images/products/${currentHero.slug}.svg`}
                alt={currentHero.name}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const stage = e.currentTarget.dataset.fallbackStage || 'hero';
                  if (stage === 'hero') {
                    e.currentTarget.dataset.fallbackStage = 'localProduct';
                    e.currentTarget.src = `/images/products/${currentHero.slug}.svg`;
                  } else if (stage === 'localProduct') {
                    e.currentTarget.dataset.fallbackStage = 'category';
                    e.currentTarget.src = `/images/categories/${currentHero.categorySlug}.svg`;
                  } else {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/fallback.svg';
                  }
                }}
                style={{
                  maxHeight: '460px',
                  maxWidth: '100%',
                  margin: '0 auto',
                  objectFit: 'contain',
                  transform: 'translateY(10px)',
                  transition: 'transform 0.3s ease',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  right: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 24px',
                  backgroundColor: 'rgba(255, 255, 255, 0.94)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #E5E5E5',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#171717' }}>{currentHero.name}</div>
                  <div style={{ fontSize: '12px', color: '#555555' }}>
                    Official Apple India Verified MRP • {currentHero.specs[0]} • {currentHero.specs[1]}
                  </div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#171717' }}>
                  {formatINR(currentHero.startingPrice)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Latest Arrivals in India Spotlight with Innovation Filters */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge" style={{ marginBottom: '8px' }}>
              Latest Verified Releases
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.02em', color: '#171717' }}>
              New Arrivals in India
            </h2>
            <p style={{ color: '#555555', fontSize: '14px', marginTop: '4px' }}>
              Discover newly launched Apple innovations with authentic INR pricing and breakthrough hardware architecture.
            </p>
          </div>
          <Link to="/products?availability=IN_STOCK" className="btn-ghost" style={{ color: '#171717' }}>
            <span>Browse All New Releases</span>
            <ArrowRight size={14} color="#B08D42" />
          </Link>
        </div>

        {/* Interactive Innovation Filter Bar */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: '28px',
          }}
        >
          {INNOVATION_FILTERS.map((f) => {
            const isActive = activeInnovationFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveInnovationFilter(f.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  backgroundColor: isActive ? '#171717' : '#F5F5F7',
                  color: isActive ? '#FFFFFF' : '#555555',
                  border: isActive ? '1px solid #171717' : '1px solid #E5E5E5',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.12)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#B08D42';
                    e.currentTarget.style.borderColor = '#B08D42';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#555555';
                    e.currentTarget.style.borderColor = '#E5E5E5';
                  }
                }}
              >
                {isActive && <Sparkles size={12} color="#B08D42" />}
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredInnovations.slice(0, 8).map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 3. Shop by Category (All 10 Categories) */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge" style={{ marginBottom: '8px' }}>Complete Ecosystem</span>
          <h2 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', color: '#171717' }}>
            Shop by Category
          </h2>
          <p style={{ color: '#555555', fontSize: '15px', marginTop: '4px' }}>
            Select from the complete range of 10 official Apple device lines in pristine white and gold elegance.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="glass-card"
              style={{
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: '220px',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease',
                backgroundColor: '#F5F5F7',
                border: '1px solid #E5E5E5',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '8px',
                  border: '1px solid #EAEAEA',
                }}
              >
                {cat.imageUrl && (
                  <img
                    src={cat.imageUrl || `/images/categories/${cat.slug}.svg`}
                    alt={cat.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `/images/categories/${cat.slug}.svg`;
                    }}
                    style={{ maxHeight: '80px', maxWidth: '80px', objectFit: 'contain' }}
                  />
                )}
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '12px', color: '#555555', lineHeight: 1.3 }}>
                  {cat.description}
                </p>
              </div>

              <span
                style={{
                  marginTop: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#B08D42',
                }}
              >
                <span>Browse {cat.name}</span>
                <ArrowRight size={12} color="#B08D42" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Product Comparison Matrix Preview (iPhone Lineup in India) */}
      <section className="container">
        <div
          style={{
            backgroundColor: '#F5F5F7',
            border: '1px solid #E5E5E5',
            borderRadius: 'var(--radius-xl)',
            padding: '48px 36px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div style={{ maxWidth: '520px' }}>
            <span className="badge" style={{ marginBottom: '12px' }}>
              Decision Tool
            </span>
            <h3 style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px', color: '#171717' }}>
              Compare verified iPhone models side by side.
            </h3>
            <p style={{ color: '#555555', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
              Review differences across display technology, processors, camera systems, battery life, and authentic Apple India pricing across iPhone 16 Pro, iPhone 16, and iPhone 16e.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/compare?preset=iphones" className="btn-primary">
                <SlidersHorizontal size={16} />
                <span>Compare iPhone Models</span>
              </Link>
              <Link to="/compare" className="btn-secondary">
                <span>Custom Comparison</span>
              </Link>
            </div>
          </div>

          {/* Interactive Innovation Comparison 3-Column Preview */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              backgroundColor: '#FFFFFF',
              padding: '24px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid #E5E5E5',
              flexWrap: 'wrap',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
              flex: '1 1 540px',
            }}
          >
            {['pro', 'base', 'e'].map((modelKey, colIdx) => {
              const model = IPHONE_COMPARE_DATA[modelKey];
              const activeFinish = model.finishes[compareFinishIdx[modelKey] || 0];
              return (
                <React.Fragment key={modelKey}>
                  {colIdx > 0 && (
                    <div
                      style={{
                        width: '1px',
                        backgroundColor: '#EBEBEB',
                        alignSelf: 'stretch',
                      }}
                      className="desktop-divider"
                    />
                  )}
                  <div
                    style={{
                      textAlign: 'center',
                      flex: '1 1 150px',
                      maxWidth: '180px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      {/* Interactive Visual with Smooth Transition */}
                      <Link
                        to={`/product/${model.slug}`}
                        style={{
                          height: '115px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none',
                        }}
                      >
                        <img
                          src={activeFinish.img}
                          alt={`${model.name} in ${activeFinish.name}`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const stage = e.currentTarget.dataset.fallbackStage || 'finish';
                            if (stage === 'finish') {
                              e.currentTarget.dataset.fallbackStage = 'localProduct';
                              e.currentTarget.src = `/images/products/${model.slug}.svg`;
                            } else if (stage === 'localProduct') {
                              e.currentTarget.dataset.fallbackStage = 'category';
                              e.currentTarget.src = '/images/categories/iphone.svg';
                            } else {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/fallback.svg';
                            }
                          }}
                          style={{
                            maxHeight: '105px',
                            maxWidth: '100%',
                            objectFit: 'contain',
                            transition: 'transform 0.25s ease',
                          }}
                        />
                      </Link>

                      {/* Interactive Finish Swatches */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '6px',
                          marginTop: '6px',
                          marginBottom: '4px',
                        }}
                      >
                        {model.finishes.map((f, fIdx) => {
                          const isSelected = (compareFinishIdx[modelKey] || 0) === fIdx;
                          return (
                            <button
                              key={f.name}
                              onClick={() =>
                                setCompareFinishIdx((prev) => ({
                                  ...prev,
                                  [modelKey]: fIdx,
                                }))
                              }
                              title={f.name}
                              aria-label={`Select ${f.name} finish`}
                              style={{
                                width: isSelected ? '14px' : '11px',
                                height: isSelected ? '14px' : '11px',
                                borderRadius: '50%',
                                backgroundColor: f.hex,
                                border: isSelected ? '2px solid #B08D42' : '1px solid #CCCCCC',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'all 0.15s ease',
                              }}
                            />
                          );
                        })}
                      </div>

                      <div style={{ fontSize: '10px', color: '#888888', minHeight: '14px' }}>
                        {activeFinish.name}
                      </div>

                      <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '4px', color: '#171717' }}>
                        {model.name}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#B08D42', marginTop: '2px' }}>
                        {formatINR(model.price)}
                      </div>
                    </div>

                    {/* Spec Highlights Matrix */}
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          backgroundColor: '#F5F5F7',
                          color: '#171717',
                          padding: '3px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {model.chip}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          color: '#555555',
                          backgroundColor: '#FAFAFA',
                          padding: '3px 6px',
                          borderRadius: '4px',
                          border: '1px solid #F0F0F0',
                        }}
                      >
                        {model.camera}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          color: '#555555',
                          backgroundColor: '#FAFAFA',
                          padding: '3px 6px',
                          borderRadius: '4px',
                          border: '1px solid #F0F0F0',
                        }}
                      >
                        {model.display}
                      </span>

                      <Link
                        to={`/product/${model.slug}`}
                        style={{
                          marginTop: '8px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#171717',
                          textDecoration: 'none',
                          padding: '5px 0',
                          borderTop: '1px solid #F0F0F0',
                          display: 'block',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#B08D42')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#171717')}
                      >
                        Configure &rarr;
                      </Link>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Apple Intelligence Showcase */}
      <section className="container">
        <div
          style={{
            position: 'relative',
            backgroundColor: '#F5F5F7',
            border: '1px solid #E5E5E5',
            borderRadius: 'var(--radius-xl)',
            padding: '48px 36px',
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <span className="badge" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={12} color="#B08D42" />
              <span>Apple Silicon</span>
            </span>

            <h3 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', color: '#171717', marginBottom: '14px' }}>
              Built for Apple Intelligence.
            </h3>

            <p style={{ color: '#555555', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
              Personal, private, powerful. Apple Intelligence is seamlessly integrated into macOS, iOS, and iPadOS across devices powered by A18, A18 Pro, and M-series silicon with unified memory architectures.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/products?category=iphone" className="btn-secondary">
                <span>Explore A18 Devices</span>
                <ArrowRight size={14} color="#B08D42" />
              </Link>
              <Link to="/products?category=mac" className="btn-ghost" style={{ color: '#171717' }}>
                <span>Explore M4 Macs</span>
                <ChevronRight size={14} color="#B08D42" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Trust & Transparency Guarantees */}
      <section className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          <div className="glass-card" style={{ padding: '32px 24px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(176, 141, 66, 0.1)',
                border: '1px solid rgba(176, 141, 66, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                color: '#B08D42',
              }}
            >
              <ShieldCheck size={20} color="#B08D42" />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#171717' }}>
              Verified Apple India Specifications
            </h4>
            <p style={{ fontSize: '13px', color: '#555555', lineHeight: 1.5 }}>
              Every product specification, chipset generation, display dimension, and pricing tier is researched against official Apple India technical documentation and press releases.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px 24px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(176, 141, 66, 0.1)',
                border: '1px solid rgba(176, 141, 66, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                color: '#B08D42',
              }}
            >
              <Truck size={20} color="#B08D42" />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#171717' }}>
              Transactional Demo Checkout
            </h4>
            <p style={{ fontSize: '13px', color: '#555555', lineHeight: 1.5 }}>
              Experience transactional order placement, automated address verification, and real-time order history tracking persisted in MySQL with zero payment risk.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px 24px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(176, 141, 66, 0.1)',
                border: '1px solid rgba(176, 141, 66, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                color: '#B08D42',
              }}
            >
              <RotateCcw size={20} color="#B08D42" />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#171717' }}>
              Seamless Device Comparison
            </h4>
            <p style={{ fontSize: '13px', color: '#555555', lineHeight: 1.5 }}>
              Guest bag synchronization, multi-variant price calculations, and responsive side-by-side comparison matrix engineered on React and Spring Boot.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
