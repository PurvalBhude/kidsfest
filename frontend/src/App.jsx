import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from './api/axios';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Activities from './pages/Activities';
import Passes from './pages/Passes';
import Checkout from './pages/Checkout';
import BookingConfirmation from './pages/BookingConfirmation';
import Volunteer from './pages/Volunteer';
import Exhibitor from './pages/Exhibitor';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManagePasses from './pages/admin/ManagePasses';
import ManageActivities from './pages/admin/ManageActivities';
import ManagePromoCodes from './pages/admin/ManagePromoCodes';
import ManageVolunteers from './pages/admin/ManageVolunteers';
import ManageExhibitors from './pages/admin/ManageExhibitors';
import ManageBookings from './pages/admin/ManageBookings';
import ManageSponsors from './pages/admin/ManageSponsors';
import EventSettings from './pages/admin/EventSettings';

function PublicLayout({ children, settings }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar banner={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}

function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      api.get('/public/data')
        .then(({ data }) => setSettings(data.settings))
        .catch(() => {});
    }
  }, [isAdmin]);

  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="passes" element={<ManagePasses />} />
        <Route path="activities" element={<ManageActivities />} />
        <Route path="promo-codes" element={<ManagePromoCodes />} />
        <Route path="volunteers" element={<ManageVolunteers />} />
        <Route path="exhibitors" element={<ManageExhibitors />} />
        <Route path="sponsors" element={<ManageSponsors />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="settings" element={<EventSettings />} />
      </Route>

      {/* Public routes */}
      <Route path="/" element={<PublicLayout settings={settings}><Home /></PublicLayout>} />
      <Route path="/activities" element={<PublicLayout settings={settings}><Activities /></PublicLayout>} />
      <Route path="/passes" element={<PublicLayout settings={settings}><Passes /></PublicLayout>} />
      <Route path="/checkout" element={<PublicLayout settings={settings}><Checkout /></PublicLayout>} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      <Route path="/volunteer" element={<PublicLayout settings={settings}><Volunteer /></PublicLayout>} />
      <Route path="/exhibitor" element={<PublicLayout settings={settings}><Exhibitor /></PublicLayout>} />

      {/* 404 */}
      <Route
        path="*"
        element={
          <PublicLayout settings={settings}>
            <div className="flex items-center justify-center min-h-[60vh] text-center">
              <div>
                <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-6">Page not found</p>
                <a href="/" className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors">
                  Go Home
                </a>
              </div>
            </div>
          </PublicLayout>
        }
      />
    </Routes>
  );
}

export default App;
