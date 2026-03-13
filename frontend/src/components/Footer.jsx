import { Link } from 'react-router-dom';
import { PartyPopper, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer({ settings }) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <PartyPopper className="w-7 h-7 text-secondary" />
              <span className="font-heading">{settings?.eventName || 'KidsFest'}</span>
            </Link>
            <p className="text-sm leading-relaxed">
              The ultimate festival for kids! Fun activities, exciting shows, and unforgettable memories.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/activities" className="hover:text-white transition-colors">Activities</Link></li>
              <li><Link to="/passes" className="hover:text-white transition-colors">Tickets</Link></li>
              <li><Link to="/volunteer" className="hover:text-white transition-colors">Volunteer</Link></li>
              <li><Link to="/exhibitor" className="hover:text-white transition-colors">Exhibitor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Event Info</h4>
            <ul className="space-y-2 text-sm">
              {settings?.eventDates && (
                <li className="flex items-center gap-2">📅 {settings.eventDates}</li>
              )}
              {settings?.venue && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  {settings.venue}
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> info@kidsfest.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> +91 98765 43210
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {settings?.eventName || 'KidsFest'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
