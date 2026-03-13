import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings, fetchBookingById, clearSelectedBooking } from '../../store/slices/bookingSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Success: 'bg-green-100 text-green-700',
  Failed: 'bg-red-100 text-red-700',
};

export default function ManageBookings() {
  const dispatch = useDispatch();
  const { items: bookings, pagination, selectedBooking, loading, detailLoading } = useSelector((s) => s.bookings);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    dispatch(fetchBookings({ page: 1, limit: 15, status: filter }));
  }, [dispatch, filter]);

  const goToPage = (pg) => {
    dispatch(fetchBookings({ page: pg, limit: 15, status: filter }));
  };

  const viewDetail = (id) => dispatch(fetchBookingById(id));
  const closeDetail = () => dispatch(clearSelectedBooking());

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500">View all ticket bookings</p>
        </div>
        <div className="flex gap-2">
          {['', 'Pending', 'Success', 'Failed'].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >{s || 'All'}</button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Amount</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{b.customerName}</td>
                      <td className="px-4 py-3 text-gray-600">{b.customerEmail}</td>
                      <td className="px-4 py-3 font-semibold">₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[b.paymentStatus]}`}>{b.paymentStatus}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => viewDetail(b._id)} className="p-1.5 hover:bg-primary/10 rounded-lg">
                          <Eye className="w-4 h-4 text-primary" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No bookings found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button onClick={() => goToPage(pagination.page - 1)} disabled={pagination.page <= 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">Page {pagination.page} of {pagination.pages}</span>
              <button onClick={() => goToPage(pagination.page + 1)} disabled={pagination.page >= pagination.pages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {(selectedBooking || detailLoading) && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            {detailLoading ? <LoadingSpinner /> : selectedBooking && (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold">Booking Details</h2>
                  <button onClick={closeDetail} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Customer</p><p className="font-semibold">{selectedBooking.customerName}</p></div>
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Email</p><p className="font-semibold text-sm">{selectedBooking.customerEmail}</p></div>
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Phone</p><p className="font-semibold">{selectedBooking.customerPhone}</p></div>
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Status</p>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[selectedBooking.paymentStatus]}`}>{selectedBooking.paymentStatus}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Passes Purchased</p>
                    <div className="space-y-2">
                      {selectedBooking.passesPurchased?.map((p, i) => (
                        <div key={i} className="flex justify-between bg-gray-50 rounded-lg p-3 text-sm">
                          <span>{p.passName} × {p.quantity}</span>
                          <span className="font-semibold">₹{(p.pricePaidPerPass * p.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-3 space-y-2">
                    {selectedBooking.discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span><span>-₹{selectedBooking.discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span><span className="text-primary">₹{selectedBooking.totalAmount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  {selectedBooking.razorpayPaymentId && (
                    <div className="bg-gray-50 rounded-lg p-3 text-xs">
                      <p><span className="text-gray-500">Payment ID:</span> {selectedBooking.razorpayPaymentId}</p>
                      <p><span className="text-gray-500">Order ID:</span> {selectedBooking.razorpayOrderId}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
