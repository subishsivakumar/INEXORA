import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserPlus, LogIn, ArrowRight } from 'lucide-react';

export default function WelcomeModal() {
  const { welcomeModalOpen, continueAsGuest, openAuthModal } = useAuth();

  if (!welcomeModalOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div
        className="modal-content"
        style={{
          maxWidth: '480px',
          textAlign: 'center',
          padding: '40px 32px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E5E5',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Brand Icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(176, 141, 66, 0.1)',
            border: '1px solid rgba(176, 141, 66, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <svg width="24" height="28" viewBox="0 0 170 170" fill="none">
            <path
              d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.43-6.08-3.69-3.08-7.73-7.93-12.13-14.54-6.42-9.74-11.45-20.73-15.09-32.96-3.64-12.23-5.46-23.77-5.46-34.62 0-14.48 3.73-26.44 11.19-35.88 7.46-9.44 17-14.28 28.61-14.53 4.24 0 9.25 1.16 15.03 3.49 5.78 2.33 9.49 3.53 11.12 3.59 1.41 0 5.23-1.32 11.46-3.95 6.23-2.63 11.49-3.83 15.78-3.62 11.75.58 21.03 4.88 27.84 12.9-10.27 6.23-15.3 14.88-15.1 25.96.2 8.79 3.46 16.14 9.77 22.04 6.31 5.9 13.9 9.38 22.78 10.43-2.22 6.64-4.78 13.29-7.68 19.95zM119.22 33.11c0-7.39 2.65-14.43 7.95-21.11 5.3-6.68 12.02-11.02 20.15-13 1.09 7.06-.99 14.07-6.23 21.03-5.24 6.96-12.21 11.32-20.91 13.08-.27-.67-.96-1.33-.96-2z"
              fill="#171717"
            />
          </svg>
        </div>

        <span className="badge" style={{ marginBottom: '12px', backgroundColor: '#171717', color: '#FFFFFF' }}>
          White & Gold Showcase
        </span>

        <h2 id="welcome-title" style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em', color: '#171717' }}>
          iNexora
        </h2>
        <p style={{ color: '#555555', fontSize: '14px', lineHeight: 1.5, marginBottom: '28px' }}>
          Discover iNexora — the premier destination for verified Apple innovations with official INR pricing and White & Gold luxury aesthetics.
        </p>

        {/* 3 Explicit Welcome Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Create Account */}
          <button
            onClick={() => openAuthModal('register')}
            className="btn-primary"
            style={{ width: '100%', padding: '14px 20px', fontSize: '15px' }}
          >
            <UserPlus size={16} />
            <span>Create Account</span>
          </button>

          {/* Login */}
          <button
            onClick={() => openAuthModal('login')}
            className="btn-secondary"
            style={{ width: '100%', padding: '14px 20px', fontSize: '15px', backgroundColor: '#F5F5F7' }}
          >
            <LogIn size={16} />
            <span>Sign In to Existing Account</span>
          </button>

          {/* Continue as Guest */}
          <button
            onClick={continueAsGuest}
            className="btn-ghost"
            style={{ width: '100%', padding: '12px 20px', fontSize: '14px', marginTop: '4px', color: '#171717' }}
          >
            <span>Continue as Guest</span>
            <ArrowRight size={14} color="#B08D42" />
          </button>
        </div>

        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #E5E5E5',
            fontSize: '11px',
            color: '#777777',
          }}
        >
          Independent demonstration store. Guest shopping bag will seamlessly synchronize upon sign-in.
        </div>
      </div>
    </div>
  );
}
