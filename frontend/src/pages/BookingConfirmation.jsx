import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';

export default function BookingConfirmation() {
  const { state } = useLocation();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="animate-slide-up" style={{
        background: '#fff', borderRadius: '24px', boxShadow: '0 8px 40px rgba(0,0,0,.1)',
        padding: '3rem 2rem', textAlign: 'center', maxWidth: 500, width: '100%',
        border: '2px solid #f0ede6',
      }}>
        {/* Success icon */}
        <div style={{ width: 88, height: 88, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <CheckCircle style={{ width: 50, height: 50, color: '#2db46b' }} />
        </div>

        <h1 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '2rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>
          Booking Confirmed! 🎉
        </h1>
        <p style={{ fontFamily: 'Signika, sans-serif', color: '#666', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Thank you for your purchase! Your festival passes have been booked successfully.
        </p>

        {state?.bookingId && (
          <div style={{ background: '#f5f3ee', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
            <p style={{ fontFamily: 'Signika, sans-serif', fontSize: '0.82rem', color: '#888', marginBottom: '0.25rem' }}>Booking ID</p>
            <p style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: '#1a9fb5' }}>{state.bookingId}</p>
          </div>
        )}

        <div style={{ background: '#eff8ff', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '2rem', textAlign: 'left' }}>
          <p style={{ fontFamily: 'Signika, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#1a9fb5', marginBottom: '0.35rem' }}>
            📧 Check your email!
          </p>
          <p style={{ fontFamily: 'Signika, sans-serif', fontSize: '0.85rem', color: '#4a7fa5', lineHeight: 1.5 }}>
            We've sent your ticket & booking details to your email address. Please check your inbox (and spam folder).
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/"
            style={{
              fontFamily: 'Lilita One, sans-serif', fontSize: '1rem',
              background: '#e63228', color: '#fff', borderRadius: '50px',
              padding: '0.75rem 2.2rem', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              transition: 'all .2s', letterSpacing: '0.02em',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#c0281f'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#e63228'}
          >
            <Home style={{ width: 18, height: 18 }} /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
