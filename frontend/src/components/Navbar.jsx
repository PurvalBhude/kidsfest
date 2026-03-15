import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useEffect } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const leftLinks = [
  { to: '/activities', label: 'Activities' },
  { to: '/exhibitor', label: 'Sponsors' },
];
const rightLinks = [
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/passes', label: 'Book Passes' },
];

export default function Navbar({ banner = {} }) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    api.get('/public/data')
      .then(({ data }) => {
        const d = data.data || data;
        setSettings(d.settings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      {/* Announcement Banner */}
      {banner?.isBannerActive && banner?.announcementBanner && (
        <div className="text-white text-center text-sm font-semibold py-2 px-4"
          style={{ background: '#e63228', fontFamily: 'Signika, sans-serif' }}>
          {banner.announcementBanner}
        </div>
      )}

      {/* Main Nav */}
      <nav className="sticky top-0 z-50 shadow-sm" style={{ background: '#fff', borderBottom: '2px solid #f0ede6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop - 3 column: left links | logo | right links */}
          <div className="hidden md:flex items-center justify-between h-18 py-3">
            {/* Left links */}
            <div className="flex items-center gap-1 flex-1">
              {leftLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="px-4 py-2 text-sm font-semibold transition-colors rounded-full"
                  style={{
                    fontFamily: 'Lilita One, sans-serif',
                    color: pathname === l.to ? '#e63228' : '#333',
                    backgroundColor: pathname === l.to ? '#fef2f2' : 'transparent',
                    letterSpacing: '0.02em',
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Logo - centered */}
            <Link to="/" className="flex-shrink-0 mx-6 flex flex-col items-center">
              <div className="text-center leading-none">
                <div style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.6rem', color: '#1a9fb5', lineHeight: 1 }}>
                  KID-O
                </div>
                <div style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.6rem', color: '#e63228', lineHeight: 1 }}>
                  FEST
                </div>
                <div style={{ fontFamily: 'Signika, sans-serif', fontSize: '0.6rem', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {settings?.eventName || '2026'}
                </div>
              </div>
            </Link>

            {/* Right links */}
            <div className="flex items-center gap-1 flex-1 justify-end">
              {rightLinks.map((l, i) =>
                i === rightLinks.length - 1 ? (
                  // "Book Passes" is a special CTA button
                  <Link
                    key={l.to}
                    to={l.to}
                    className="ml-2 px-5 py-2 text-sm font-semibold text-white rounded-full transition-all hover:scale-105"
                    style={{
                      fontFamily: 'Lilita One, sans-serif',
                      background: '#e63228',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {l.label}
                  </Link>
                ) : (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="px-4 py-2 text-sm font-semibold transition-colors rounded-full"
                    style={{
                      fontFamily: 'Lilita One, sans-serif',
                      color: pathname === l.to ? '#e63228' : '#333',
                      backgroundColor: pathname === l.to ? '#fef2f2' : 'transparent',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {l.label}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Mobile bar */}
          <div className="flex md:hidden items-center justify-between py-3">
            <Link to="/" style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.3rem', color: '#1a9fb5' }}>
              KID-O<span style={{ color: '#e63228' }}>FEST</span>
            </Link>
            <button onClick={() => setOpen(!open)} className="p-2 rounded-lg" style={{ color: '#333' }}>
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t px-4 pb-4 pt-2 space-y-1" style={{ background: '#fff', borderColor: '#f0ede6' }}>
            {[...leftLinks, ...rightLinks].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  fontFamily: 'Lilita One, sans-serif',
                  color: pathname === l.to ? '#fff' : '#333',
                  background: pathname === l.to ? '#e63228' : 'transparent',
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
