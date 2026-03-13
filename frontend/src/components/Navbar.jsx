import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PartyPopper } from 'lucide-react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/activities', label: 'Activities' },
  { to: '/passes', label: 'Tickets' },
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/exhibitor', label: 'Exhibitor' },
];

export default function Navbar({ banner }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <>
      {banner?.isBannerActive && banner?.announcementBanner && (
        <div className="bg-secondary text-white text-center text-sm font-semibold py-2 px-4">
          {banner.announcementBanner}
        </div>
      )}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
              <PartyPopper className="w-7 h-7 text-secondary" />
              <span className="font-heading">KidsFest</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    pathname === l.to
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/passes"
                className="ml-2 px-5 py-2 rounded-full bg-secondary text-white font-bold text-sm hover:bg-secondary-dark transition-colors"
              >
                Book Now 🎟️
              </Link>
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t bg-white px-4 pb-4 pt-2 space-y-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-semibold ${
                  pathname === l.to
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-primary/10'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/passes"
              onClick={() => setOpen(false)}
              className="block text-center px-4 py-2.5 rounded-lg bg-secondary text-white font-bold text-sm"
            >
              Book Now 🎟️
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
