import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, SlidersHorizontal, LogOut, ShieldAlert, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Navbar({ onOpenSearch }) {
  const { user, isAdmin, logout, openAuthModal } = useAuth();
  const { cartCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navCategories = [
    { name: 'iPhone', path: '/products?category=iphone', slug: 'iphone' },
    { name: 'Mac', path: '/products?category=mac', slug: 'mac' },
    { name: 'iPad', path: '/products?category=ipad', slug: 'ipad' },
    { name: 'Watch', path: '/products?category=watch', slug: 'watch' },
    { name: 'AirPods', path: '/products?category=airpods', slug: 'airpods' },
    { name: 'Vision', path: '/products?category=vision', slug: 'vision' },
    { name: 'TV & Home', path: '/products?category=tv-home', slug: 'tv-home' },
    { name: 'Accessories', path: '/products?category=accessories', slug: 'accessories' },
    { name: 'Displays', path: '/products?category=displays', slug: 'displays' },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Main Glass Navigation Bar */}
      <nav
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid #E5E5E5',
          height: 'var(--header-height)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              fontWeight: 700,
              fontSize: '16px',
              letterSpacing: '-0.02em',
              color: '#171717',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
          >
            {/* Apple Logo in Iconic Black */}
            <svg width="19" height="23" viewBox="0 0 170 170" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.43-6.08-3.69-3.08-7.73-7.93-12.13-14.54-6.42-9.74-11.45-20.73-15.09-32.96-3.64-12.23-5.46-23.77-5.46-34.62 0-14.48 3.73-26.44 11.19-35.88 7.46-9.44 17-14.28 28.61-14.53 4.24 0 9.25 1.16 15.03 3.49 5.78 2.33 9.49 3.53 11.12 3.59 1.41 0 5.23-1.32 11.46-3.95 6.23-2.63 11.49-3.83 15.78-3.62 11.75.58 21.03 4.88 27.84 12.9-10.27 6.23-15.3 14.88-15.1 25.96.2 8.79 3.46 16.14 9.77 22.04 6.31 5.9 13.9 9.38 22.78 10.43-2.22 6.64-4.78 13.29-7.68 19.95zM119.22 33.11c0-7.39 2.65-14.43 7.95-21.11 5.3-6.68 12.02-11.02 20.15-13 1.09 7.06-.99 14.07-6.23 21.03-5.24 6.96-12.21 11.32-20.91 13.08-.27-.67-.96-1.33-.96-2z"
                fill="#171717"
              />
            </svg>
            <span style={{ fontFamily: 'var(--font-primary)', letterSpacing: '-0.01em', color: '#171717', fontWeight: 800 }}>
              iNexora
            </span>
          </Link>

          {/* Desktop Category Navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '22px',
            }}
            className="desktop-nav"
          >
            {navCategories.map((cat) => {
              const isCatActive =
                location.pathname === '/products' &&
                location.search.includes(`category=${cat.slug}`);
              return (
                <Link
                  key={cat.name}
                  to={cat.path}
                  style={{
                    position: 'relative',
                    fontSize: '12px',
                    fontWeight: isCatActive ? 600 : 400,
                    color: isCatActive ? '#171717' : '#555555',
                    letterSpacing: '-0.01em',
                    padding: '8px 0',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#B08D42')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = isCatActive ? '#171717' : '#555555')
                  }
                >
                  {cat.name}
                  {isCatActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        height: '2px',
                        backgroundColor: '#B08D42',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </Link>
              );
            })}

            <Link
              to="/compare"
              style={{
                position: 'relative',
                fontSize: '12px',
                fontWeight: location.pathname === '/compare' ? 600 : 500,
                color: location.pathname === '/compare' ? '#171717' : '#555555',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 0',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#B08D42')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = location.pathname === '/compare' ? '#171717' : '#555555')
              }
            >
              <SlidersHorizontal size={13} color="#B08D42" />
              <span>Compare</span>
              {location.pathname === '/compare' && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    height: '2px',
                    backgroundColor: '#B08D42',
                    borderRadius: '2px',
                  }}
                />
              )}
            </Link>
          </div>

          {/* Action Icons (Big Size 26px with 46px Touch Targets) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              aria-label="Search iNexora Products"
              style={{
                color: '#171717',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                backgroundColor: 'transparent',
                border: '1px solid transparent',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#B08D42';
                e.currentTarget.style.backgroundColor = '#F5F5F7';
                e.currentTarget.style.borderColor = 'rgba(176, 141, 66, 0.3)';
                e.currentTarget.style.transform = 'scale(1.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#171717';
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Search size={26} strokeWidth={2.2} />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/account?tab=wishlist"
              aria-label="View Saved Wishlist"
              style={{
                position: 'relative',
                color: '#171717',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                backgroundColor: 'transparent',
                border: '1px solid transparent',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#B08D42';
                e.currentTarget.style.backgroundColor = '#F5F5F7';
                e.currentTarget.style.borderColor = 'rgba(176, 141, 66, 0.3)';
                e.currentTarget.style.transform = 'scale(1.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#171717';
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Heart size={26} strokeWidth={2.2} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '1px',
                    right: '1px',
                    backgroundColor: '#B08D42',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 700,
                    minWidth: '20px',
                    height: '20px',
                    borderRadius: '10px',
                    padding: '0 4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(176, 141, 66, 0.45)',
                    border: '2px solid #FFFFFF',
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Drawer Button */}
            <button
              onClick={openDrawer}
              aria-label="Open Shopping Bag"
              style={{
                position: 'relative',
                color: '#171717',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                border: '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#B08D42';
                e.currentTarget.style.backgroundColor = '#F5F5F7';
                e.currentTarget.style.borderColor = 'rgba(176, 141, 66, 0.3)';
                e.currentTarget.style.transform = 'scale(1.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#171717';
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ShoppingBag size={26} strokeWidth={2.2} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '1px',
                    right: '1px',
                    backgroundColor: '#B08D42',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 700,
                    minWidth: '20px',
                    height: '20px',
                    borderRadius: '10px',
                    padding: '0 4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(176, 141, 66, 0.45)',
                    border: '2px solid #FFFFFF',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  if (!user) {
                    openAuthModal('login');
                  } else {
                    setUserMenuOpen(!userMenuOpen);
                  }
                }}
                aria-label="Account Profile"
                style={{
                  color: '#171717',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  border: '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#B08D42';
                  e.currentTarget.style.backgroundColor = '#F5F5F7';
                  e.currentTarget.style.borderColor = 'rgba(176, 141, 66, 0.3)';
                  e.currentTarget.style.transform = 'scale(1.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#171717';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <User size={26} strokeWidth={2.2} />
              </button>

              {/* User Dropdown */}
              {user && userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '36px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E5E5',
                    borderRadius: '12px',
                    width: '220px',
                    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
                    padding: '8px',
                    zIndex: 200,
                  }}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #E5E5E5' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#171717' }}>{user.fullName}</div>
                    <div style={{ fontSize: '11px', color: '#555555', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </div>
                  </div>

                  <Link
                    to="/account"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'block',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: '#171717',
                      borderRadius: '6px',
                      transition: 'color 0.2s ease, background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#B08D42';
                      e.currentTarget.style.backgroundColor = '#F5F5F7';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#171717';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Account & Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        fontSize: '13px',
                        color: '#B08D42',
                        fontWeight: 600,
                        borderRadius: '6px',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(176, 141, 66, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <ShieldAlert size={14} color="#B08D42" />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: '#555555',
                      textAlign: 'left',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease, background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#171717';
                      e.currentTarget.style.backgroundColor = '#F5F5F7';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#555555';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-nav-toggle"
              style={{ display: 'none', padding: '6px', color: '#171717', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} color="#171717" /> : <Menu size={20} color="#171717" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E5E5E5',
            padding: '16px 24px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          }}
        >
          {navCategories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'block',
                padding: '10px 0',
                fontSize: '15px',
                color: '#171717',
                borderBottom: '1px solid #E5E5E5',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#B08D42')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#171717')}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            to="/compare"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'block',
              padding: '10px 0',
              fontSize: '15px',
              fontWeight: 500,
              color: '#B08D42',
            }}
          >
            Compare Products
          </Link>
        </div>
      )}

      {/* Inline media query style for desktop vs mobile */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
