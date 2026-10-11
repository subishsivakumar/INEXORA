import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Loader2, Check } from 'lucide-react';
import { api, formatINR } from '../services/api';
import ProductCard from '../components/common/ProductCard';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters state
  const selectedCategory = searchParams.get('category') || '';
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sortBy') || 'featured');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [onlyInStock, setOnlyInStock] = useState(searchParams.get('availability') === 'IN_STOCK');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Comparison multi-selection
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [searchParams, selectedCategory, selectedSort, maxPrice, onlyInStock]);

  async function loadCategories() {
    try {
      const res = await api.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }

  async function loadProducts() {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory || undefined,
        sortBy: selectedSort,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        availability: onlyInStock ? 'IN_STOCK' : undefined,
        size: 36,
      };

      const res = await api.getProducts(params);
      setProducts(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleCategoryChange(slug) {
    const next = new URLSearchParams(searchParams);
    if (slug) {
      next.set('category', slug);
    } else {
      next.delete('category');
    }
    setSearchParams(next);
  }

  function handleSortChange(e) {
    const val = e.target.value;
    setSelectedSort(val);
    const next = new URLSearchParams(searchParams);
    next.set('sortBy', val);
    setSearchParams(next);
  }

  function handlePriceFilter(e) {
    const val = e.target.value;
    setMaxPrice(val);
    const next = new URLSearchParams(searchParams);
    if (val) {
      next.set('maxPrice', val);
    } else {
      next.delete('maxPrice');
    }
    setSearchParams(next);
  }

  function toggleCompare(id) {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((x) => x !== id));
    } else {
      if (selectedForCompare.length >= 4) {
        alert('You can compare a maximum of 4 products side by side.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, id]);
    }
  }

  function goToCompare() {
    if (selectedForCompare.length === 0) return;
    navigate(`/compare?ids=${selectedForCompare.join(',')}`);
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Header Bar */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', color: '#171717' }}>
          {selectedCategory
            ? categories.find((c) => c.slug === selectedCategory)?.name || 'iNexora Collection'
            : 'All iNexora Products'}
        </h1>
        <p style={{ color: '#555555', fontSize: '15px', marginTop: '6px' }}>
          Explore {totalElements} verified Apple devices with authentic Indian Rupee pricing.
        </p>
      </div>

      {/* Category Pills Scroller */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '16px',
          marginBottom: '24px',
          scrollbarWidth: 'none',
        }}
      >
        <button
          onClick={() => handleCategoryChange('')}
          className={selectedCategory === '' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '8px 18px', fontSize: '13px', whiteSpace: 'nowrap' }}
        >
          All Products
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => handleCategoryChange(c.slug)}
            className={selectedCategory === c.slug ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 18px', fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Filter and Sort Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '16px 20px',
          backgroundColor: '#F5F5F7',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #E5E5E5',
          marginBottom: '32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {/* Price Range */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#555555', fontWeight: 500 }}>Max Price:</span>
            <select
              value={maxPrice}
              onChange={handlePriceFilter}
              style={{ padding: '7px 12px', fontSize: '13px', borderRadius: 'var(--radius-sm)', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#171717' }}
            >
              <option value="">Any Price</option>
              <option value="50000">Under ₹50,000</option>
              <option value="100000">Under ₹1,00,000</option>
              <option value="150000">Under ₹1,50,000</option>
              <option value="200000">Under ₹2,00,000</option>
            </select>
          </div>

          {/* Availability Toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: '#171717', fontWeight: 500 }}>
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              style={{ width: '15px', height: '15px', accentColor: '#171717' }}
            >
            </input>
            In Stock Only
          </label>
        </div>

        {/* Sort Options */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ArrowUpDown size={14} style={{ color: '#B08D42' }} />
          <span style={{ fontSize: '13px', color: '#555555', fontWeight: 500 }}>Sort by:</span>
          <select
            value={selectedSort}
            onChange={handleSortChange}
            style={{ padding: '7px 12px', fontSize: '13px', borderRadius: 'var(--radius-sm)', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#171717' }}
          >
            <option value="featured">Featured First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest Releases</option>
            <option value="name_asc">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Floating Compare Drawer when items are checked */}
      {selectedForCompare.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 90,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E5E5',
            borderRadius: 'var(--radius-full)',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#171717' }}>
            {selectedForCompare.length} product{selectedForCompare.length > 1 ? 's' : ''} selected
          </div>
          <button onClick={goToCompare} className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
            <SlidersHorizontal size={14} />
            <span>Compare Now</span>
          </button>
          <button
            onClick={() => setSelectedForCompare([])}
            style={{ color: '#555555', padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
            title="Clear selections"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="glass-card" style={{ height: '380px', padding: '24px', backgroundColor: '#F5F5F7', border: '1px solid #E5E5E5' }}>
              <div className="skeleton" style={{ height: '180px', marginBottom: '16px' }} />
              <div className="skeleton" style={{ height: '14px', width: '40%', marginBottom: '10px' }} />
              <div className="skeleton" style={{ height: '20px', width: '80%', marginBottom: '12px' }} />
              <div className="skeleton" style={{ height: '14px', width: '50%' }} />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onCompareToggle={toggleCompare}
              isComparing={selectedForCompare.includes(product.id)}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: '#F5F5F7',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #E5E5E5',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#171717', marginBottom: '8px' }}>
            No products match the selected filters
          </h3>
          <p style={{ color: '#555555', fontSize: '14px', marginBottom: '24px' }}>
            Try expanding your price range or switching categories.
          </p>
          <button
            onClick={() => {
              setMaxPrice('');
              setOnlyInStock(false);
              handleCategoryChange('');
            }}
            className="btn-secondary"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
