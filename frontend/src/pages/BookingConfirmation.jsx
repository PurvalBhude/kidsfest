import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Home, Download } from 'lucide-react';

export default function BookingConfirmation() {
  const { state } = useLocation();

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center max-w-lg w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your tickets have been booked successfully.
        </p>

        {state?.bookingId && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">Booking ID</p>
            <p className="text-lg font-bold text-primary font-mono">{state.bookingId}</p>
          </div>
        )}

        <div className="bg-blue-50 rounded-xl p-4 mb-8 text-left text-sm text-blue-700">
          <p className="font-semibold mb-1">📧 Check your email!</p>
          <p>We've sent your ticket & booking details to your email address. Please check your inbox (and spam folder).</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors"
          >
            <Home className="w-5 h-5" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
