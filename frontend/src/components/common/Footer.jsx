import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#F5F5F7',
        borderTop: '1px solid #E5E5E5',
        paddingTop: '48px',
        paddingBottom: '40px',
        marginTop: 'auto',
        fontSize: '12px',
        color: '#555555',
        lineHeight: 1.6,
      }}
    >
      <div className="container">
        {/* Footnote Disclaimers */}
        <div
          style={{
            borderBottom: '1px solid #E5E5E5',
            paddingBottom: '24px',
            marginBottom: '32px',
          }}
        >
          <p style={{ marginBottom: '8px' }}>
            * Indian Rupee (₹) pricing reflects verified starting and exact variant prices sourced from official Apple India documentation. Real-time availability may vary.
          </p>
          <p style={{ marginBottom: '8px' }}>
            iNexora is an independent full-stack technology demonstration shopping experience designed to showcase verified Apple devices with precision. This demonstration website does not claim official Apple authorization, reseller status, or official manufacturer warranties.
          </p>
          <p>
            Apple, the Apple logo, iPhone, Mac, MacBook Pro, MacBook Air, iMac, Mac mini, Mac Studio, Mac Pro, iPad, iPad Pro, iPad Air, Apple Watch, Ultra, AirPods, Apple Vision Pro, AirTag, MagSafe, and visionOS are trademarks of Apple Inc., registered in the U.S. and other countries.
          </p>
        </div>

        {/* Directory Links Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '32px',
            marginBottom: '40px',
          }}
        >
          {/* Shop Categories */}
          <div>
            <h4 style={{ color: '#171717', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
              Shop & Learn
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link to="/products?category=iphone" style={{ color: '#555555' }}>iPhone 16 Pro & Series</Link></li>
              <li><Link to="/products?category=mac" style={{ color: '#555555' }}>MacBook Pro & Mac mini</Link></li>
              <li><Link to="/products?category=ipad" style={{ color: '#555555' }}>iPad Pro (M4) & iPad Air</Link></li>
              <li><Link to="/products?category=watch" style={{ color: '#555555' }}>Apple Watch Series 10</Link></li>
              <li><Link to="/products?category=airpods" style={{ color: '#555555' }}>AirPods Pro 2 & AirPods 4</Link></li>
              <li><Link to="/products?category=vision" style={{ color: '#555555' }}>Apple Vision Pro</Link></li>
              <li><Link to="/products?category=tv-home" style={{ color: '#555555' }}>Apple TV 4K & HomePod</Link></li>
              <li><Link to="/products?category=accessories" style={{ color: '#555555' }}>Accessories & Cables</Link></li>
              <li><Link to="/products?category=displays" style={{ color: '#555555' }}>Studio Display & Pro Display</Link></li>
            </ul>
          </div>

          {/* Experience & Tools */}
          <div>
            <h4 style={{ color: '#171717', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
              Experience & Compare
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link to="/compare" style={{ color: '#555555' }}>Product Comparison Matrix</Link></li>
              <li><Link to="/products" style={{ color: '#555555' }}>Full Catalog & Filters</Link></li>
              <li><Link to="/cart" style={{ color: '#555555' }}>Shopping Bag</Link></li>
              <li><Link to="/account?tab=wishlist" style={{ color: '#555555' }}>Saved Wishlist</Link></li>
            </ul>
          </div>

          {/* Account & Orders */}
          <div>
            <h4 style={{ color: '#171717', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
              Account & Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link to="/account" style={{ color: '#555555' }}>Manage Account</Link></li>
              <li><Link to="/account?tab=orders" style={{ color: '#555555' }}>Order History & Tracking</Link></li>
              <li><Link to="/account?tab=addresses" style={{ color: '#555555' }}>Saved Delivery Addresses</Link></li>
              <li><a href="#support" style={{ color: '#555555' }}>Customer Support (Demo)</a></li>
              <li><a href="mailto:support@inexora.store" style={{ color: '#555555' }}>Contact Engineering</a></li>
            </ul>
          </div>

          {/* Brand Philosophy */}
          <div>
            <h4 style={{ color: '#171717', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
              About iNexora
            </h4>
            <p style={{ color: '#555555', fontSize: '12px', marginBottom: '12px' }}>
              Built with precision using React 18, Spring Boot 3, and MySQL. Dedicated to offering a pristine, high-fidelity technology retail showcase with a White & Gold design system.
            </p>
            <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '4px', backgroundColor: 'rgba(176, 141, 66, 0.1)', color: '#B08D42', border: '1px solid rgba(176, 141, 66, 0.25)', fontSize: '11px', fontWeight: 600 }}>
              White & Gold Showcase
            </div>
          </div>
        </div>

        {/* Copyright & Secondary Disclaimer */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            paddingTop: '20px',
            borderTop: '1px solid #E5E5E5',
            color: '#777777',
          }}
        >
          <div>
            Copyright © {new Date().getFullYear()} iNexora. All rights reserved.
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ color: '#B08D42' }}>•</span>
            <span style={{ cursor: 'pointer' }}>Terms of Use</span>
            <span style={{ color: '#B08D42' }}>•</span>
            <span style={{ cursor: 'pointer' }}>Sales Policy</span>
            <span style={{ color: '#B08D42' }}>•</span>
            <span style={{ cursor: 'pointer' }}>Legal Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
