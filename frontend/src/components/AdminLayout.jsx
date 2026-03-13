import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAdmin } from '../store/slices/authSlice';
import {
  LayoutDashboard, Ticket, Sparkles, Tags, Users, Building2,
  ClipboardList, Settings, LogOut, Menu, X, PartyPopper, ChevronRight, Crown,
} from 'lucide-react';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/passes', icon: Ticket, label: 'Passes' },
  { to: '/admin/activities', icon: Sparkles, label: 'Activities' },
  { to: '/admin/promo-codes', icon: Tags, label: 'Promo Codes' },
  { to: '/admin/volunteers', icon: Users, label: 'Volunteers' },
  { to: '/admin/exhibitors', icon: Building2, label: 'Exhibitors' },
  { to: '/admin/sponsors', icon: Crown, label: 'Sponsors' },
  { to: '/admin/bookings', icon: ClipboardList, label: 'Bookings' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.auth);
  const { pathname } = useLocation();

  const isActive = (path) => pathname === path || (path !== '/admin' && pathname.startsWith(path));

  const handleLogout = () => {
    dispatch(logoutAdmin());
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-2 h-16 px-5 border-b border-gray-200">
          <PartyPopper className="w-6 h-6 text-primary" />
          <span className="font-heading font-bold text-lg text-primary">KidsFest Admin</span>
          <button className="lg:hidden ml-auto" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.to)
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
                {isActive(item.to) && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <div className="px-3 py-2 text-xs text-gray-500 mb-1">
            Signed in as <span className="font-semibold text-gray-700">{admin?.name || admin?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 gap-4">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <Link to="/" className="ml-auto text-sm text-primary font-medium hover:underline">
            ← View Site
          </Link>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
