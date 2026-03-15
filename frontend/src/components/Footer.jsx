import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Linkedin } from 'lucide-react';

export default function Footer({ settings }) {
  return (
    <footer style={{ position: 'relative', overflow: 'hidden', background: '#fff' }}>
      {/* Green hill illustration SVG */}
      <div style={{ position: 'relative', width: '100%', minHeight: '180px' }}>
        <svg viewBox="0 0 1440 180" preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: '180px' }}>
          <path d="M0,120 Q200,40 400,100 Q600,160 800,80 Q1000,10 1200,100 Q1380,170 1440,130 L1440,180 L0,180 Z"
            fill="#4caf50" opacity="0.9" />
          <path d="M0,140 Q300,90 500,130 Q700,170 900,110 Q1100,60 1300,130 Q1400,160 1440,150 L1440,180 L0,180 Z"
            fill="#3d9e40" opacity="0.8" />
          {/* Grass tufts */}
          {[60, 180, 350, 550, 720, 900, 1080, 1250, 1400].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="155" x2={x - 8} y2="138" stroke="#2e7d32" strokeWidth="2" />
              <line x1={x} y1="155" x2={x} y2="136" stroke="#2e7d32" strokeWidth="2" />
              <line x1={x} y1="155" x2={x + 8} y2="140" stroke="#2e7d32" strokeWidth="2" />
            </g>
          ))}
        </svg>
      </div>

      {/* Dark footer content */}
      <div style={{ background: '#1a2e1a', color: '#d4e8d4', paddingTop: '2rem', paddingBottom: '1.5rem' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">

            {/* Logo + tagline */}
            <div>
              <Link to="/" className="flex items-center gap-3 mb-3">
                <div style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  display: 'inline-block',
                }}>
                  <div style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.1rem', color: '#1a9fb5', lineHeight: 1.1 }}>KID-O</div>
                  <div style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.1rem', color: '#e63228', lineHeight: 1.1 }}>FEST</div>
                </div>
              </Link>
              <p style={{ fontFamily: 'Signika, sans-serif', fontSize: '0.82rem', color: '#b0ccb0', lineHeight: 1.6 }}>
                {settings?.eventDescription || "India's biggest arts & literature festival for kids — bringing joy, creativity, and stories to life."}
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontFamily: 'Lilita One, sans-serif', color: '#fff', marginBottom: '0.75rem', fontSize: '1rem' }}>
                CONTACT
              </h4>
              <ul style={{ fontFamily: 'Signika, sans-serif', fontSize: '0.82rem', color: '#b0ccb0', listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {settings?.venue && (
                  <li className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#4caf50' }} />
                    {settings.venue}
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: '#4caf50' }} />
                  <a href="mailto:fest@kidofest.com" style={{ color: '#b0ccb0', textDecoration: 'none' }}>
                    fest@kidofest.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: '#4caf50' }} />
                  <a href="tel:+918595684432" style={{ color: '#b0ccb0', textDecoration: 'none' }}>
                    +91-8595684432
                  </a>
                </li>
              </ul>
            </div>

            {/* Navigation */}
            <div>
              <h4 style={{ fontFamily: 'Lilita One, sans-serif', color: '#fff', marginBottom: '0.75rem', fontSize: '1rem' }}>
                NAVIGATE
              </h4>
              <ul style={{ fontFamily: 'Signika, sans-serif', fontSize: '0.82rem', listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {[
                  { to: '/', label: 'Home' },
                  { to: '/activities', label: 'Activities' },
                  { to: '/passes', label: 'Get Passes' },
                  { to: '/volunteer', label: 'Volunteer' },
                  { to: '/exhibitor', label: 'Sponsors' },
                ].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} style={{ color: '#b0ccb0', textDecoration: 'none', transition: 'color .2s' }}
                      onMouseEnter={(e) => e.target.style.color = '#fff'}
                      onMouseLeave={(e) => e.target.style.color = '#b0ccb0'}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 style={{ fontFamily: 'Lilita One, sans-serif', color: '#fff', marginBottom: '0.75rem', fontSize: '1rem' }}>
                WE ARE SOCIAL
              </h4>
              <div className="flex gap-3 mb-5">
                {[
                  { href: 'https://www.instagram.com/', icon: Instagram, bg: '#e1306c' },
                  { href: 'https://www.facebook.com/', icon: Facebook, bg: '#1877f2' },
                  { href: 'https://www.youtube.com/', icon: Youtube, bg: '#ff0000' },
                  { href: 'https://www.linkedin.com/', icon: Linkedin, bg: '#0a66c2' },
                ].map(({ href, icon: Icon, bg }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    style={{
                      width: '34px', height: '34px', borderRadius: '50%', background: bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'transform .2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </a>
                ))}
              </div>

              {/* Write to us */}
              <div style={{
                background: '#e63228', borderRadius: '10px', padding: '0.75rem 1rem',
                color: '#fff', fontFamily: 'Lilita One, sans-serif',
              }}>
                <div style={{ fontSize: '0.9rem' }}>WRITE TO US</div>
                <div style={{ fontFamily: 'Signika, sans-serif', fontSize: '0.75rem', opacity: 0.85 }}>
                  Questions? We're here to help.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid #2e4a2e', paddingTop: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms & Conditions'].map((t) => (
              <a key={t} href="#" style={{ fontFamily: 'Signika, sans-serif', fontSize: '0.75rem', color: '#8aac8a', textDecoration: 'none' }}>
                {t.toUpperCase()}
              </a>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '0.5rem', fontFamily: 'Signika, sans-serif', fontSize: '0.72rem', color: '#5a7a5a' }}>
            © {new Date().getFullYear()} {settings?.eventName || 'KidsFest'} · All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
