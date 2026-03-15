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
    <div style={{ minHeight: '100vh', background: '#f5f3ee' }}>
      <section style={{ position: 'relative', overflow: 'hidden', background: '#e63228', padding: '3rem 1rem', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,.1)' }} />
        <div style={{ position: 'relative' }}>
          <h1 className="animate-slide-up" style={{ fontFamily: 'Lilita One, sans-serif', fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: '#fff' }}>Secure Checkout 💳</h1>
          <p className="animate-slide-up delay-100" style={{ fontFamily: 'Signika, sans-serif', color: 'rgba(255,255,255,.85)', marginTop: '0.4rem' }}>You're almost there!</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <button onClick={() => navigate('/passes')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'Signika, sans-serif', fontSize: '0.88rem', color: '#888', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1.5rem' }}
          onMouseEnter={(e) => e.currentTarget.style.color='#1a9fb5'}
          onMouseLeave={(e) => e.currentTarget.style.color='#888'}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Passes
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="animate-slide-up" style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 16px rgba(0,0,0,.07)', border: '1.5px solid #f0ede6', padding: '1.75rem' }}>
              <h2 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.15rem', color: '#1a1a1a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard style={{ width: 20, height: 20, color: '#e63228' }} /> Your Details
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { key: 'customerName', label: 'Full Name', placeholder: 'Enter your full name', type: 'text' },
                  { key: 'customerEmail', label: 'Email', placeholder: 'you@email.com', type: 'email' },
                  { key: 'customerPhone', label: 'Phone', placeholder: '+91 98765 43210', type: 'tel' },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontFamily: 'Signika, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#555', marginBottom: '0.4rem' }}>{label}</label>
                    <input type={type} value={form[key]} placeholder={placeholder}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '2px solid #e8e4dc', outline: 'none', fontFamily: 'Signika, sans-serif', fontSize: '0.95rem', color: '#333', background: '#faf9f6', boxSizing: 'border-box' }}
                      onFocus={(e) => e.target.style.borderColor = '#e63228'}
                      onBlur={(e) => e.target.style.borderColor = '#e8e4dc'}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-slide-up delay-100" style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 16px rgba(0,0,0,.07)', border: '1.5px solid #f0ede6', padding: '1.75rem' }}>
              <h2 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.1rem', color: '#1a1a1a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag style={{ width: 18, height: 18, color: '#1a9fb5' }} /> Promo Code
              </h2>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  style={{ flex: 1, padding: '0.85rem 1rem', borderRadius: '12px', border: '2px solid #e8e4dc', outline: 'none', fontFamily: 'monospace', fontSize: '0.95rem', color: '#333', background: '#faf9f6', textTransform: 'uppercase' }}
                  onFocus={(e) => e.target.style.borderColor = '#1a9fb5'}
                  onBlur={(e) => e.target.style.borderColor = '#e8e4dc'}
                />
                <button onClick={validatePromo} disabled={promoLoading}
                  style={{ padding: '0.85rem 1.5rem', background: '#1a9fb5', color: '#fff', fontFamily: 'Lilita One, sans-serif', fontSize: '0.95rem', border: 'none', borderRadius: '12px', cursor: 'pointer', opacity: promoLoading ? 0.6 : 1 }}>
                  {promoLoading ? <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" /> : 'Apply'}
                </button>
              </div>
              {promoResult && (
                <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2db46b', fontSize: '0.88rem', fontFamily: 'Signika, sans-serif', fontWeight: 600, background: '#f0fdf4', borderRadius: '10px', padding: '0.5rem 0.75rem' }}>
                  <CheckCircle style={{ width: 15, height: 15 }} />
                  Promo applied: {promoResult.discountType === 'percentage' ? `${promoResult.discountValue}% off` : `₹${promoResult.discountValue} off`}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2 animate-slide-up delay-200">
            <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 16px rgba(0,0,0,.07)', border: '1.5px solid #f0ede6', padding: '1.75rem', position: 'sticky', top: '5rem' }}>
              <h2 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.2rem', color: '#1a1a1a', marginBottom: '1rem' }}>Order Summary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {cartDetails.map((c) => (
                  <div key={c.passId} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Signika, sans-serif', fontSize: '0.9rem' }}>
                    <span style={{ color: '#666' }}>{c.name} × {c.quantity}</span>
                    <span style={{ fontWeight: 600, color: '#1a1a1a' }}>₹{c.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1.5px solid #f0ede6', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Signika, sans-serif', fontSize: '0.88rem' }}>
                  <span style={{ color: '#666' }}>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Signika, sans-serif', fontSize: '0.88rem', color: '#2db46b' }}>
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1.5px solid #f0ede6', paddingTop: '0.5rem', fontFamily: 'Lilita One, sans-serif', fontSize: '1.1rem' }}>
                  <span style={{ color: '#1a1a1a' }}>Total</span>
                  <span style={{ color: '#e63228' }}>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button onClick={handlePayment} disabled={submitting}
                style={{
                  width: '100%', marginTop: '1.25rem', padding: '0.95rem', background: '#e63228', color: '#fff',
                  fontFamily: 'Lilita One, sans-serif', fontSize: '1.05rem', border: 'none', borderRadius: '12px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  opacity: submitting ? 0.6 : 1, letterSpacing: '0.03em', transition: 'all .2s',
                }}
                onMouseEnter={(e) => !submitting && (e.currentTarget.style.background = '#c0281f')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#e63228')}
              >
                {submitting ? <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" /> : (
                  <><ShieldCheck style={{ width: 18, height: 18 }} /> Pay ₹{total.toLocaleString('en-IN')}</>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '0.85rem', fontFamily: 'Signika, sans-serif', fontSize: '0.75rem', color: '#aaa' }}>
                <Lock style={{ width: 11, height: 11 }} />
                Secured by Razorpay. 100% safe & encrypted.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
