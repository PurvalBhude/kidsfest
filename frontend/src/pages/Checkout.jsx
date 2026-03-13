import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { CreditCard, Tag, CheckCircle, Loader2, ShieldCheck, Lock, ArrowLeft } from 'lucide-react';

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({ customerName: '', customerEmail: '', customerPhone: '' });
  const [promoCode, setPromoCode] = useState('');
  const [promoResult, setPromoResult] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!state?.items || !state?.passes) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-slide-up">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No items selected</h2>
          <p className="text-gray-500 mb-4">Please go back and select your passes first.</p>
          <button onClick={() => navigate('/passes')} className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors">
            Browse Passes
          </button>
        </div>
      </div>
    );
  }

  const { items, passes } = state;

  const cartDetails = items.map((item) => {
    const pass = passes.find((p) => p._id === item.passId);
    const price = pass?.price ?? (pass?.isEarlyBird ? pass?.earlyBirdPrice : pass?.regularPrice) ?? 0;
    return { ...item, name: pass?.name, price, subtotal: price * item.quantity };
  });

  const subtotal = cartDetails.reduce((s, c) => s + c.subtotal, 0);
  let discount = 0;
  if (promoResult) {
    discount = promoResult.discountType === 'percentage'
      ? subtotal * (promoResult.discountValue / 100)
      : promoResult.discountValue;
  }
  const total = Math.max(subtotal - discount, 0);

  const validatePromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    try {
      const { data } = await api.post('/checkout/validate-promo', { code: promoCode });
      setPromoResult(data);
      toast.success(`Promo applied! ${data.discountType === 'percentage' ? data.discountValue + '%' : '₹' + data.discountValue} off`);
    } catch (err) {
      setPromoResult(null);
      toast.error(err.response?.data?.message || 'Invalid promo code');
    } finally {
      setPromoLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!form.customerName.trim() || !form.customerEmail.trim() || !form.customerPhone.trim()) {
      toast.error('Please fill in all your details');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post('/checkout/create-order', {
        ...form, items, promoCode: promoResult ? promoCode : undefined,
      });
      const options = {
        key: data.keyId, amount: data.amount, currency: data.currency,
        name: 'KidsFest', description: 'Festival Pass Booking',
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/checkout/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful!');
            navigate('/booking-confirmation', { state: { bookingId: verifyRes.data.bookingId }, replace: true });
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        prefill: { name: form.customerName, email: form.customerEmail, contact: form.customerPhone },
        theme: { color: '#7C3AED' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => toast.error('Payment failed. Please try again.'));
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden bg-linear-to-r from-primary via-purple-600 to-accent py-12 sm:py-16 text-white text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </div>
        <div className="relative">
          <h1 className="text-3xl sm:text-4xl font-bold animate-slide-up">Secure Checkout 💳</h1>
          <p className="text-white/80 mt-2 animate-slide-up delay-100">You're almost there!</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <button onClick={() => navigate('/passes')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Passes
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm animate-slide-up">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Your Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="you@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="+91 98765 43210" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm animate-slide-up delay-100">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" /> Promo Code
              </h2>
              <div className="flex gap-3">
                <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none uppercase font-mono" placeholder="Enter code" />
                <button onClick={validatePromo} disabled={promoLoading}
                  className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50">
                  {promoLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Apply'}
                </button>
              </div>
              {promoResult && (
                <div className="mt-3 flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 rounded-lg px-3 py-2">
                  <CheckCircle className="w-4 h-4" />
                  Promo applied: {promoResult.discountType === 'percentage' ? `${promoResult.discountValue}% off` : `₹${promoResult.discountValue} off`}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2 animate-slide-up delay-200">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cartDetails.map((c) => (
                  <div key={c.passId} className="flex justify-between text-sm">
                    <span className="text-gray-600">{c.name} × {c.quantity}</span>
                    <span className="font-semibold">₹{c.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button onClick={handlePayment} disabled={submitting}
                className="w-full mt-6 px-6 py-4 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-xl text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <><ShieldCheck className="w-5 h-5" /> Pay ₹{total.toLocaleString('en-IN')}</>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <Lock className="w-3 h-3" />
                Secured by Razorpay. 100% safe & encrypted.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
